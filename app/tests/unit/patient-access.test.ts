import { describe, expect, it } from "vitest";
import { canAccessPatient } from "@/lib/patient-access";

describe("patient access policy", () => {
  it("allows office staff in same organization", () => {
    const decision = canAccessPatient(
      {
        id: "patient-1",
        organizationId: "org-1",
      },
      {
        id: "user-1",
        role: "OFFICE_STAFF",
        organizationId: "org-1",
      },
    );

    expect(decision.allowed).toBe(true);
    expect(decision.reason).toBe("organization");
  });

  it("blocks office staff outside organization", () => {
    const decision = canAccessPatient(
      {
        id: "patient-1",
        organizationId: "org-1",
      },
      {
        id: "user-1",
        role: "OFFICE_STAFF",
        organizationId: "org-2",
      },
    );

    expect(decision.allowed).toBe(false);
  });
});
