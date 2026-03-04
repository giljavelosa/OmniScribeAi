/**
 * Synchronous admin role assertions.
 * Used by server components and route handlers that already
 * have the user object and need to verify role + MFA.
 */
import { ForbiddenError } from "./errors";

interface AdminGuardUser {
  role: string;
  mfaEnabled: boolean;
}

/**
 * Asserts that the given user is SUPER_ADMIN with MFA enabled.
 * Throws ForbiddenError if either condition is not met.
 */
export function assertSuperAdminWithMfa(user: AdminGuardUser): void {
  if (user.role !== "SUPER_ADMIN") {
    throw new ForbiddenError(
      "Super admin access required",
      "INSUFFICIENT_ROLE",
    );
  }

  if (!user.mfaEnabled) {
    throw new ForbiddenError(
      "MFA is required for this action",
      "MFA_REQUIRED",
    );
  }
}
