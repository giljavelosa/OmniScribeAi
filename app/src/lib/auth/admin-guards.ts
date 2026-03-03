import { Role } from "@prisma/client";
import { ForbiddenError } from "./errors";

export function assertSuperAdminWithMfa(user: {
  role: Role;
  mfaEnabled: boolean;
}): void {
  if (user.role !== Role.SUPER_ADMIN) {
    throw new ForbiddenError("Insufficient permissions", "INSUFFICIENT_ROLE");
  }
  if (!user.mfaEnabled) {
    throw new ForbiddenError(
      "MFA is required for SUPER_ADMIN access",
      "MFA_REQUIRED",
    );
  }
}
