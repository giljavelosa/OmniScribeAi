import { auditLog } from "@/lib/audit";
import { requireSuperAdminWithMfa } from "@/lib/auth/current-user";
import { isAuthzError } from "@/lib/auth/errors";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { appLog, scrubError } from "@/lib/logger";
import { fail, ok } from "@/lib/api-envelope";
import { wrapRoute } from "@/lib/wrap-route";

// PATCH /api/admin/users/:id — compatibility endpoint (SUPER_ADMIN + MFA)
export const PATCH = wrapRoute(async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  requestId: string,
) => {
  try {
    const actor = await requireSuperAdminWithMfa();
    const { id } = await params;
    const data = await req.json();

    // Only allow specific fields
    const allowed: Record<string, string | boolean> = {};
    if (data.name !== undefined) allowed.name = data.name;
    if (data.role !== undefined) allowed.role = data.role;
    if (data.clinicianType !== undefined) allowed.clinicianType = data.clinicianType;
    if (data.credentials !== undefined) allowed.credentials = data.credentials;
    if (data.isActive !== undefined) allowed.isActive = data.isActive;

    const user = await prisma.user.update({ where: { id }, data: allowed });

    try {
      await auditLog({
        userId: actor.id,
        adminId: actor.id,
        action: "UPDATE_USER",
        targetType: "User",
        targetId: id,
        metadata: { fields: Object.keys(allowed) },
        resource: `user:${id}`,
        details: { fields: Object.keys(allowed) },
        ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
        userAgent: req.headers.get("user-agent") ?? undefined,
      });
    } catch (auditError) {
      appLog("warn", "AdminUserByIdRoute", "Audit logging failed", { error: scrubError(auditError) });
    }

    return ok(
      { user: { id: user.id, email: user.email, name: user.name, role: user.role, isActive: user.isActive } },
      undefined,
      requestId,
    );
  } catch (error) {
    if (isAuthzError(error)) {
      return fail(error.code, error.message, requestId, error.status);
    }
    appLog("error", "AdminUserByIdRoute", "PATCH admin user by id failed", { error: scrubError(error) });
    return fail("INTERNAL_ERROR", "Internal server error", requestId, 500);
  }
});
