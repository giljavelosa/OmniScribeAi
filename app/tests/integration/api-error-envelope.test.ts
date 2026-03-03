import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { UnauthorizedError } from "@/lib/auth/errors";

const {
  mockAuth,
  mockRequireSuperAdminWithMfa,
  mockGetEntitlementSnapshot,
  mockEnforceFeature,
} = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockRequireSuperAdminWithMfa: vi.fn(),
  mockGetEntitlementSnapshot: vi.fn(),
  mockEnforceFeature: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: mockAuth,
}));

vi.mock("@/lib/auth/current-user", () => ({
  requireSuperAdminWithMfa: mockRequireSuperAdminWithMfa,
}));

vi.mock("@/lib/billing/entitlements", () => ({
  getEntitlementSnapshot: mockGetEntitlementSnapshot,
  enforceFeature: mockEnforceFeature,
}));

import { GET as adminUsersGet } from "@/app/api/admin/users/route";
import { GET as templatesGet, POST as templatesPost } from "@/app/api/templates/route";
import { GET as billingEntitlementsGet } from "@/app/api/billing/entitlements/route";
import { GET as visitShareGet } from "@/app/api/visits/[id]/share/route";

describe("API error envelope integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("admin users GET unauthorized returns envelope", async () => {
    mockRequireSuperAdminWithMfa.mockRejectedValueOnce(new UnauthorizedError("Authentication required"));

    const response = await adminUsersGet(new NextRequest("http://localhost/api/admin/users"), undefined);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toMatchObject({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
    expect(typeof body.error.requestId).toBe("string");
  });

  it("templates GET unauthorized returns AUTH_UNAUTHORIZED envelope", async () => {
    mockAuth.mockResolvedValueOnce(null);

    const response = await templatesGet(new NextRequest("http://localhost/api/templates"), undefined);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toMatchObject({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
    expect(typeof body.error.requestId).toBe("string");
  });

  it("templates POST validation failure returns TEMPLATE_VALIDATION_FAILED envelope", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: "user_1", role: "CLINICIAN", organizationId: null },
    });
    mockGetEntitlementSnapshot.mockResolvedValueOnce({});
    mockEnforceFeature.mockReturnValueOnce({ allowed: true });

    const request = new NextRequest("http://localhost/api/templates", {
      method: "POST",
      body: JSON.stringify({
        domain: "medical",
        noteFormat: "SOAP",
        structureJson: { formatType: "SOAP", discipline: "medical", sections: [] },
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await templatesPost(request, undefined);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toMatchObject({
      code: "TEMPLATE_VALIDATION_FAILED",
      message: "Name is required",
    });
    expect(typeof body.error.requestId).toBe("string");
  });

  it("billing entitlements GET unauthorized returns envelope", async () => {
    mockAuth.mockResolvedValueOnce(null);

    const response = await billingEntitlementsGet(
      new NextRequest("http://localhost/api/billing/entitlements"),
      undefined,
    );
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toMatchObject({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
    expect(typeof body.error.requestId).toBe("string");
  });

  it("visit sharing GET unauthorized returns envelope", async () => {
    mockAuth.mockResolvedValueOnce(null);

    const response = await visitShareGet(
      new NextRequest("http://localhost/api/visits/visit_1/share"),
      { params: Promise.resolve({ id: "visit_1" }) },
    );
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toMatchObject({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  });
});

