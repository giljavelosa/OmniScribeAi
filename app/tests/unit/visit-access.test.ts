import { describe, expect, it } from "vitest";
import { canCommentVisit, canEditVisit, canViewVisit } from "@/lib/visit-access";

describe("visit access policy", () => {
  it("allows office staff to view organization-shared visits", () => {
    const decision = canViewVisit(
      {
        userId: "clinician-1",
        organizationId: "org-1",
        visibility: "organization",
      },
      {
        id: "office-1",
        role: "OFFICE_STAFF",
        organizationId: "org-1",
      },
    );

    expect(decision.allowed).toBe(true);
    expect(decision.reason).toBe("organization_visibility");
  });

  it("blocks office staff edit attempts", () => {
    const decision = canEditVisit(
      {
        userId: "office-1",
        organizationId: "org-1",
      },
      {
        id: "office-1",
        role: "OFFICE_STAFF",
        organizationId: "org-1",
      },
    );

    expect(decision.allowed).toBe(false);
  });

  it("blocks office staff comment permissions for restricted grants", () => {
    const decision = canCommentVisit(
      {
        userId: "clinician-1",
        organizationId: "org-1",
        visibility: "restricted",
      },
      {
        id: "office-1",
        role: "OFFICE_STAFF",
        organizationId: "org-1",
      },
      [
        {
          granteeUserId: "office-1",
          revokedAt: null,
          permission: "comment",
        },
      ],
    );

    expect(decision.allowed).toBe(false);
  });
});
