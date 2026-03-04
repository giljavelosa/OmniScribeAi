import { Role } from "@prisma/client";
import { auditLog } from "@/lib/audit";
import {
  requireSuperAdminWithMfa,
} from "@/lib/auth/current-user";
import { isAuthzError } from "@/lib/auth/errors";
import { prisma } from "@/lib/db";
import type { NextRequest } from "next/server";
import { appLog, scrubError } from "@/lib/logger";
import bcrypt from "bcryptjs";
import { fail, ok } from "@/lib/api-envelope";
import { AppError, validationError } from "@/lib/errors";
import { wrapRoute } from "@/lib/wrap-route";

const ALLOWED_PATCH_ROLES = new Set<Role>([
  Role.SUPER_ADMIN,
  Role.ENTERPRISE_ADMIN,
  Role.ADMIN,
  Role.CLINICIAN,
  Role.SUPERVISOR,
  "OFFICE_STAFF" as Role,
]);

function getRequestIp(req: NextRequest): string | undefined {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    undefined
  );
}

async function logAdminAuditSafe(args: {
  adminId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}) {
  try {
    await auditLog({
      userId: args.adminId,
      action: args.action,
      resource: args.targetType && args.targetId ? `${args.targetType}:${args.targetId}` : undefined,
      details: args.metadata,
      ipAddress: args.ip,
      userAgent: args.userAgent,
      adminId: args.adminId,
      targetType: args.targetType,
      targetId: args.targetId,
      metadata: args.metadata,
      ip: args.ip,
    });
  } catch (error) {
    appLog("warn", "AdminUsersRoute", "Audit logging failed", {
      action: args.action,
      targetType: args.targetType,
      targetId: args.targetId,
      error: scrubError(error),
    });
  }
}

// GET /api/admin/users — list users (SUPER_ADMIN + MFA)
export const GET = wrapRoute(async (req: NextRequest, _ctx, requestId) => {
  try {
    await requireSuperAdminWithMfa();
    const params = req.nextUrl.searchParams;
    const limit = Math.min(Number(params.get("limit") ?? "50") || 50, 100);
    const offset = Math.max(Number(params.get("offset") ?? "0") || 0, 0);

    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, name: true, role: true,
        clinicianType: true, credentials: true, isActive: true,
        lastLoginAt: true, createdAt: true, mustChangePassword: true, mfaEnabled: true,
        organizationId: true,
        organization: { select: { id: true, name: true } },
        _count: { select: { visits: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return ok({ users }, undefined, requestId);
  } catch (error) {
    if (isAuthzError(error)) {
      return fail(error.code, error.message, requestId, error.status);
    }
    appLog("error", "AdminUsersRoute", "GET admin users failed", { error: scrubError(error) });
    return fail("INTERNAL_ERROR", "Internal server error", requestId, 500);
  }
});

// PATCH /api/admin/users — update user role or active flag (SUPER_ADMIN + MFA)
export const PATCH = wrapRoute(async (req: NextRequest, _ctx, requestId) => {
  try {
    const actor = await requireSuperAdminWithMfa();
    const data = await req.json() as {
      id?: string;
      role?: Role;
      isActive?: boolean;
    };

    if (!data.id) {
      throw validationError("id is required");
    }

    if (data.role === undefined && data.isActive === undefined) {
      throw validationError("Provide role and/or isActive");
    }

    if (data.role !== undefined && !ALLOWED_PATCH_ROLES.has(data.role)) {
      throw validationError("Invalid role");
    }

    const existing = await prisma.user.findUnique({
      where: { id: data.id },
      select: { id: true, role: true, isActive: true },
    });
    if (!existing) {
      throw new AppError("NOT_FOUND", "User not found", 404);
    }

    const updateData: { role?: Role; isActive?: boolean } = {};
    if (data.role !== undefined) updateData.role = data.role;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const updated = await prisma.user.update({
      where: { id: data.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        mfaEnabled: true,
        organizationId: true,
      },
    });

    const action =
      data.role !== undefined
        ? "USER_ROLE_UPDATED"
        : data.isActive === false
          ? "USER_SUSPENDED"
          : "USER_REACTIVATED";

    await logAdminAuditSafe({
      adminId: actor.id,
      action,
      targetType: "User",
      targetId: updated.id,
      metadata: {
        oldRole: existing.role,
        newRole: updated.role,
        oldIsActive: existing.isActive,
        newIsActive: updated.isActive,
      },
      ip: getRequestIp(req),
      userAgent: req.headers.get("user-agent") ?? undefined,
    });

    return ok({ user: updated }, undefined, requestId);
  } catch (error) {
    if (isAuthzError(error)) {
      return fail(error.code, error.message, requestId, error.status);
    }
    if (error instanceof AppError) {
      return fail(error.code, error.message, requestId, error.status);
    }
    appLog("error", "AdminUsersRoute", "PATCH admin user failed", { error: scrubError(error) });
    return fail("INTERNAL_ERROR", "Internal server error", requestId, 500);
  }
});

// POST /api/admin/users — create user (SUPER_ADMIN + MFA)
export const POST = wrapRoute(async (req: NextRequest, _ctx, requestId) => {
  try {
    const actor = await requireSuperAdminWithMfa();
    const data = await req.json();
    const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    const password = typeof data.password === "string" ? data.password : "";
    if (!email || !password) {
      throw validationError("Email and password required");
    }

    const existing = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      select: { id: true },
    });
    if (existing) {
      throw new AppError("CONFLICT", "Email already in use", 409);
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        name: data.name || null,
        role: (data.role && ALLOWED_PATCH_ROLES.has(data.role) ? data.role : Role.CLINICIAN),
        clinicianType: data.clinicianType || null,
        credentials: data.credentials || null,
        organizationId: data.organizationId || null,
        mustChangePassword: true,
      },
    });

    await logAdminAuditSafe({
      adminId: actor.id,
      action: "USER_CREATED",
      targetType: "User",
      targetId: user.id,
      metadata: {
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
      ip: getRequestIp(req),
      userAgent: req.headers.get("user-agent") ?? undefined,
    });

    return ok(
      {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
      { status: 201 },
      requestId,
    );
  } catch (error) {
    if (isAuthzError(error)) {
      return fail(error.code, error.message, requestId, error.status);
    }
    if (error instanceof AppError) {
      return fail(error.code, error.message, requestId, error.status);
    }
    appLog("error", "AdminUsersRoute", "POST admin user failed", { error: scrubError(error) });
    return fail("INTERNAL_ERROR", "Internal server error", requestId, 500);
  }
});
