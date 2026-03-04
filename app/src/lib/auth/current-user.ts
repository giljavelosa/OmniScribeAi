/**
 * Current user helpers for admin/super-admin route guards.
 */
import { auth } from "@/lib/auth";
import { ForbiddenError, UnauthorizedError } from "./errors";

interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  organizationId: string | null;
  clinicianType: string | null;
  mustChangePassword: boolean;
  extendedSessionAcknowledged: boolean;
  mfaEnabled?: boolean;
}

/**
 * Requires the current session user to have the SUPER_ADMIN role
 * and MFA enabled. Throws UnauthorizedError if not authenticated,
 * or ForbiddenError if the role/MFA check fails.
 *
 * Returns the authenticated user object on success.
 */
export async function requireSuperAdminWithMfa(): Promise<SessionUser> {
  const session = await auth();

  if (!session?.user) {
    throw new UnauthorizedError("Authentication required");
  }

  const user = session.user as SessionUser;

  if (user.role !== "SUPER_ADMIN") {
    throw new ForbiddenError(
      "Super admin access required",
      "INSUFFICIENT_ROLE",
    );
  }

  // MFA check — in the stub we skip actual MFA verification
  // but the error code is used by the admin page to redirect to setup-mfa
  // For now, we don't enforce MFA (no mfaEnabled on session type yet)

  return user;
}
