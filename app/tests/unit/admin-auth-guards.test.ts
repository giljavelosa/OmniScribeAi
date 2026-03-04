import { Role } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { assertSuperAdminWithMfa } from "@/lib/auth/admin-guards";
import { ForbiddenError } from "@/lib/auth/errors";

describe("admin auth guards", () => {
  it("blocks SUPER_ADMIN without MFA", () => {
    expect(() =>
      assertSuperAdminWithMfa({ role: Role.SUPER_ADMIN, mfaEnabled: false }),
    ).toThrowError(ForbiddenError);
  });

  it("blocks CLINICIAN even with MFA", () => {
    expect(() =>
      assertSuperAdminWithMfa({ role: Role.CLINICIAN, mfaEnabled: true }),
    ).toThrowError(ForbiddenError);
  });

  it("allows SUPER_ADMIN with MFA", () => {
    expect(() =>
      assertSuperAdminWithMfa({ role: Role.SUPER_ADMIN, mfaEnabled: true }),
    ).not.toThrow();
  });
});
