import { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertSuperAdminWithMfa } from "./admin-guards";
import { ForbiddenError, UnauthorizedError } from "./errors";

export interface CurrentUser {
  id: string;
  email: string;
  role: Role;
  mfaEnabled: boolean;
  organizationId: string | null;
  isActive: boolean;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  const sessionUserId = session?.user?.id;
  if (!sessionUserId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUserId },
    select: {
      id: true,
      email: true,
      role: true,
      mfaEnabled: true,
      organizationId: true,
      isActive: true,
    },
  });

  if (!user) {
    return null;
  }

  return user;
}

export async function getCurrentUserOrThrow(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  if (!user.isActive) {
    throw new ForbiddenError("User account is inactive", "ACCOUNT_INACTIVE");
  }
  return user;
}

export async function requireRole(roles: Role[]): Promise<CurrentUser> {
  const user = await getCurrentUserOrThrow();
  if (!roles.includes(user.role)) {
    throw new ForbiddenError("Insufficient permissions", "INSUFFICIENT_ROLE");
  }
  return user;
}

export async function requireSuperAdmin(): Promise<CurrentUser> {
  return requireRole([Role.SUPER_ADMIN]);
}

export async function requireSuperAdminWithMfa(): Promise<CurrentUser> {
  const user = await requireSuperAdmin();
  assertSuperAdminWithMfa(user);
  return user;
}
