import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { appLog, errorCode, scrubError } from "@/lib/logger";
import { canManageSharing, SHARE_AUDIT_ACTIONS } from "@/lib/visit-access";
import { getEntitlementSnapshot, enforceFeature } from "@/lib/billing/entitlements";
import { getRequestIdFromRequest } from "@/lib/request-id";
import { fail, ok } from "@/lib/api-envelope";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; grantId: string }> },
) {
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
    const { id, grantId } = await params;
    const visit = await prisma.visit.findUnique({
      where: { id },
      select: { id: true, userId: true, organizationId: true, visibility: true },
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
        details: { reason: decision.reason, operation: "revoke_grant" },
      });
      return fail("FORBIDDEN", "Forbidden", requestId, 403);
    }

    const grant = await prisma.visitShareGrant.findUnique({
      where: { id: grantId },
      select: { id: true, visitId: true, granteeUserId: true, revokedAt: true },
    });

    if (!grant || grant.visitId !== visit.id) {
      return fail("NOT_FOUND", "Grant not found", requestId, 404);
    }

    await prisma.visitShareGrant.update({
      where: { id: grant.id },
      data: { revokedAt: new Date() },
    });

    await auditLog({
      userId: session.user.id,
      action: SHARE_AUDIT_ACTIONS.revokeAccess,
      resource: `visit:${visit.id}`,
      details: { granteeUserId: grant.granteeUserId, grantId: grant.id },
    });

    return ok({}, { headers: { "Cache-Control": "no-store" }, status: 200 }, requestId);
  } catch (error) {
    const code = errorCode();
    appLog("error", "VisitShare", "Failed to revoke share grant", { code, error: scrubError(error) });
    return fail("INTERNAL_ERROR", "Internal server error", requestId, 500);
  }
}

