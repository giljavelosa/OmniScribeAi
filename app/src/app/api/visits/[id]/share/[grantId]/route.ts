import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { appLog, errorCode, scrubError } from "@/lib/logger";
import { canManageSharing, SHARE_AUDIT_ACTIONS } from "@/lib/visit-access";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; grantId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, grantId } = await params;
    const visit = await prisma.visit.findUnique({
      where: { id },
      select: { id: true, userId: true, organizationId: true, visibility: true },
    });

    if (!visit) {
      return NextResponse.json({ success: false, error: "Visit not found" }, { status: 404 });
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
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const grant = await prisma.visitShareGrant.findUnique({
      where: { id: grantId },
      select: { id: true, visitId: true, granteeUserId: true, revokedAt: true },
    });

    if (!grant || grant.visitId !== visit.id) {
      return NextResponse.json({ success: false, error: "Grant not found" }, { status: 404 });
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

    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const code = errorCode();
    appLog("error", "VisitShare", "Failed to revoke share grant", { code, error: scrubError(error) });
    return NextResponse.json({ success: false, error: "Internal server error", code }, { status: 500 });
  }
}

