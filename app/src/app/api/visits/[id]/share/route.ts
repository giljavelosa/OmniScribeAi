import { NextRequest, NextResponse } from "next/server";
import { VisitSharePermission, VisitVisibility } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { appLog, errorCode, scrubError } from "@/lib/logger";
import { canManageSharing, SHARE_AUDIT_ACTIONS } from "@/lib/visit-access";
import { getEntitlementSnapshot, enforceFeature } from "@/lib/billing/entitlements";
import { getRequestIdFromRequest } from "@/lib/request-id";
import { fail, ok } from "@/lib/api-envelope";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

function parseVisibility(value: unknown): VisitVisibility | null {
  if (value === "private" || value === "organization" || value === "restricted") return value;
  return null;
}

function parsePermission(value: unknown): VisitSharePermission {
  return value === "comment" ? "comment" : "view";
}

type RequestedGrant = {
  granteeUserId: string;
  permission: VisitSharePermission;
};

function normalizeRequestedGrants(input: unknown): RequestedGrant[] {
  if (!Array.isArray(input)) return [];

  const byUserId = new Map<string, VisitSharePermission>();
  for (const item of input) {
    if (typeof item === "string" && item.length > 0) {
      byUserId.set(item, "view");
      continue;
    }

    if (
      item &&
      typeof item === "object" &&
      "granteeUserId" in item &&
      typeof (item as { granteeUserId?: unknown }).granteeUserId === "string"
    ) {
      const userId = (item as { granteeUserId: string }).granteeUserId;
      if (userId.length === 0) continue;
      const permission = parsePermission((item as { permission?: unknown }).permission);
      byUserId.set(userId, permission);
    }
  }

  return Array.from(byUserId.entries()).map(([granteeUserId, permission]) => ({
    granteeUserId,
    permission,
  }));
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestIdFromRequest(_req);
  const session = await auth();
  if (!session?.user) {
    return fail("UNAUTHORIZED", "Unauthorized", requestId, 401);
  }

  const entitlements = await getEntitlementSnapshot(session.user.id);
  const featureCheck = enforceFeature(entitlements, "organization_sharing");
  if (!featureCheck.allowed) {
    return fail(featureCheck.code, featureCheck.message, requestId, 403);
  }

  try {
    const { id } = await params;
    const visit = await prisma.visit.findUnique({
      where: { id },
      include: {
        shareGrants: {
          where: { revokedAt: null },
          include: { granteeUser: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!visit) {
      return fail("NOT_FOUND", "Visit not found", requestId, 404);
    }

    const decision = canManageSharing(
      visit,
      { id: session.user.id, role: session.user.role, organizationId: session.user.organizationId },
    );
    if (!decision.allowed) {
      await auditLog({
        userId: session.user.id,
        action: SHARE_AUDIT_ACTIONS.denyShared,
        resource: `visit:${visit.id}`,
        details: { reason: decision.reason, operation: "read_share_config" },
      });
      return fail("FORBIDDEN", "Forbidden", requestId, 403);
    }

    const orgUsers = visit.organizationId
      ? await prisma.user.findMany({
          where: { organizationId: visit.organizationId, isActive: true },
          select: { id: true, name: true, email: true },
          orderBy: [{ name: "asc" }, { email: "asc" }],
        })
      : [];

    return ok(
      {
        sharing: {
          visitId: visit.id,
          visibility: visit.visibility,
          organizationId: visit.organizationId,
          grants: visit.shareGrants.map((grant) => ({
            id: grant.id,
            granteeUserId: grant.granteeUserId,
            granteeName: grant.granteeUser.name,
            granteeEmail: grant.granteeUser.email,
            permission: grant.permission,
            createdAt: grant.createdAt,
          })),
          members: orgUsers,
        },
      },
      { headers: NO_STORE_HEADERS, status: 200 },
      requestId,
    );
  } catch (error) {
    const code = errorCode();
    appLog("error", "VisitShare", "Failed to read sharing settings", {
      code,
      error: scrubError(error),
    });
    return fail("INTERNAL_ERROR", "Internal server error", requestId, 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestIdFromRequest(req);
  const session = await auth();
  if (!session?.user) {
    return fail("UNAUTHORIZED", "Unauthorized", requestId, 401);
  }

  const entitlements = await getEntitlementSnapshot(session.user.id);
  const featureCheck = enforceFeature(entitlements, "organization_sharing");
  if (!featureCheck.allowed) {
    return fail(featureCheck.code, featureCheck.message, requestId, 403);
  }

  try {
    const { id } = await params;
    const body = (await req.json()) as {
      visibility?: VisitVisibility;
      grants?: Array<string | { granteeUserId: string; permission?: VisitSharePermission }>;
    };

    const nextVisibility = parseVisibility(body.visibility);
    if (!nextVisibility) {
      return fail("VALIDATION_ERROR", "Invalid visibility", requestId, 400);
    }

    const requestedGrantSpecs = normalizeRequestedGrants(body.grants);
    const requestedGrantIds = requestedGrantSpecs.map((grant) => grant.granteeUserId);

    const visit = await prisma.visit.findUnique({
      where: { id },
      include: { shareGrants: true },
    });
    if (!visit) {
      return fail("NOT_FOUND", "Visit not found", requestId, 404);
    }

    const decision = canManageSharing(
      visit,
      { id: session.user.id, role: session.user.role, organizationId: session.user.organizationId },
    );
    if (!decision.allowed) {
      await auditLog({
        userId: session.user.id,
        action: SHARE_AUDIT_ACTIONS.denyShared,
        resource: `visit:${visit.id}`,
        details: { reason: decision.reason, operation: "update_share_config" },
      });
      return fail("FORBIDDEN", "Forbidden", requestId, 403);
    }

    if ((nextVisibility === "organization" || nextVisibility === "restricted") && !visit.organizationId) {
      return fail(
        "VALIDATION_ERROR",
        "Visit must belong to an organization before sharing",
        requestId,
        400,
      );
    }

    if (nextVisibility === "restricted" && requestedGrantSpecs.length === 0) {
      return fail(
        "VALIDATION_ERROR",
        "Restricted visibility requires at least one grantee",
        requestId,
        400,
      );
    }

    let validGrantSpecs = requestedGrantSpecs;
    if (requestedGrantSpecs.length > 0) {
      const members = await prisma.user.findMany({
        where: {
          id: { in: requestedGrantIds },
          isActive: true,
          organizationId: visit.organizationId,
        },
        select: { id: true },
      });
      const allowed = new Set(members.map((m) => m.id));
      validGrantSpecs = requestedGrantSpecs.filter(
        (grant) => grant.granteeUserId !== visit.userId && allowed.has(grant.granteeUserId),
      );
    }

    const activeExisting = visit.shareGrants.filter((grant) => grant.revokedAt === null);
    const validGrantIds = validGrantSpecs.map((grant) => grant.granteeUserId);
    const toRevoke =
      nextVisibility === "private"
        ? activeExisting
        : activeExisting.filter((grant) => !validGrantIds.includes(grant.granteeUserId));

    const existingByGrantee = new Map(visit.shareGrants.map((grant) => [grant.granteeUserId, grant]));
    const toGrant =
      nextVisibility === "restricted"
        ? validGrantSpecs
        : [];

    await prisma.visit.update({
      where: { id: visit.id },
      data: { visibility: nextVisibility },
    });

    for (const revoke of toRevoke) {
      await prisma.visitShareGrant.update({
        where: { id: revoke.id },
        data: { revokedAt: new Date() },
      });
    }

    for (const grantSpec of toGrant) {
      const existing = existingByGrantee.get(grantSpec.granteeUserId);
      if (existing) {
        if (existing.revokedAt !== null || existing.permission !== grantSpec.permission) {
          await prisma.visitShareGrant.update({
            where: { id: existing.id },
            data: {
              revokedAt: null,
              grantedByUserId: session.user.id,
              permission: grantSpec.permission,
            },
          });
        }
      } else {
        await prisma.visitShareGrant.create({
          data: {
            visitId: visit.id,
            granteeUserId: grantSpec.granteeUserId,
            grantedByUserId: session.user.id,
            permission: grantSpec.permission,
          },
        });
      }
    }

    await auditLog({
      userId: session.user.id,
      action: SHARE_AUDIT_ACTIONS.setVisibility,
      resource: `visit:${visit.id}`,
      details: {
        visibility: nextVisibility,
        revokedGrantCount: toRevoke.length,
        activeGrantCount: toGrant.length,
      },
    });

    for (const grantSpec of toGrant) {
      await auditLog({
        userId: session.user.id,
        action: SHARE_AUDIT_ACTIONS.grantAccess,
        resource: `visit:${visit.id}`,
        details: { granteeUserId: grantSpec.granteeUserId, permission: grantSpec.permission },
      });
    }

    for (const grant of toRevoke) {
      await auditLog({
        userId: session.user.id,
        action: SHARE_AUDIT_ACTIONS.revokeAccess,
        resource: `visit:${visit.id}`,
        details: { granteeUserId: grant.granteeUserId },
      });
    }

    const updated = await prisma.visit.findUnique({
      where: { id: visit.id },
      include: {
        shareGrants: {
          where: { revokedAt: null },
          include: { granteeUser: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    return ok(
      {
        sharing: {
          visibility: updated?.visibility ?? nextVisibility,
          grants:
            updated?.shareGrants.map((grant) => ({
              id: grant.id,
              granteeUserId: grant.granteeUserId,
              granteeName: grant.granteeUser.name,
              granteeEmail: grant.granteeUser.email,
              permission: grant.permission,
              createdAt: grant.createdAt,
            })) ?? [],
        },
      },
      { headers: NO_STORE_HEADERS, status: 200 },
      requestId,
    );
  } catch (error) {
    const code = errorCode();
    appLog("error", "VisitShare", "Failed to update sharing settings", {
      code,
      error: scrubError(error),
    });
    return fail("INTERNAL_ERROR", "Internal server error", requestId, 500);
  }
}

