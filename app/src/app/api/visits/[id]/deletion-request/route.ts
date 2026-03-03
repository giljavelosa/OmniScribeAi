import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { canViewVisit } from "@/lib/visit-access";
import { appLog, scrubError } from "@/lib/logger";
import { ok, fail } from "@/lib/api-envelope";
import { wrapRoute } from "@/lib/wrap-route";

export const POST = wrapRoute(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }, requestId) => {
  const session = await auth();
  if (!session?.user) {
    return fail("UNAUTHORIZED", "Unauthorized", requestId, 401);
  }

  try {
    const { id } = await params;
    const body = (await req.json()) as { reason?: string };
    const reason = body.reason?.trim();
    if (!reason) {
      return fail("VALIDATION_ERROR", "Deletion request reason is required", requestId, 400);
    }

    const visit = await prisma.visit.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        organizationId: true,
        visibility: true,
        shareGrants: {
          where: { revokedAt: null },
          select: { granteeUserId: true, revokedAt: true, permission: true },
        },
      },
    });
    if (!visit) {
      return fail("NOT_FOUND", "Visit not found", requestId, 404);
    }

    const viewDecision = canViewVisit(
      {
        userId: visit.userId,
        organizationId: visit.organizationId,
        visibility: visit.visibility,
      },
      {
        id: session.user.id,
        role: session.user.role,
        organizationId: session.user.organizationId,
      },
      visit.shareGrants,
    );
    if (!viewDecision.allowed) {
      return fail("FORBIDDEN", "Forbidden", requestId, 403);
    }

    await auditLog({
      userId: session.user.id,
      action: "REQUEST_VISIT_DELETION",
      resource: `visit:${id}`,
      details: {
        reason,
        requestedByRole: session.user.role,
        status: "pending_admin_review",
      },
    });

    return ok(
      {
        requested: true,
        status: "pending_admin_review",
      },
      { status: 202 },
      requestId,
    );
  } catch (error) {
    appLog("error", "VisitDeletionRequestRoute", "Failed to submit deletion request", {
      error: scrubError(error),
    });
    return fail("INTERNAL_ERROR", "Internal server error", requestId, 500);
  }
  },
);
