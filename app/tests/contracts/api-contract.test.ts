import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const {
  mockAuth,
  mockGetEntitlementSnapshot,
  mockEnforceFeature,
  mockEnforceQuota,
  mockCallAI,
  mockResolveTemplate,
  mockEffectiveFrameworkId,
  mockBuildSnapshot,
} = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockGetEntitlementSnapshot: vi.fn(),
  mockEnforceFeature: vi.fn(),
  mockEnforceQuota: vi.fn(),
  mockCallAI: vi.fn(),
  mockResolveTemplate: vi.fn(),
  mockEffectiveFrameworkId: vi.fn(),
  mockBuildSnapshot: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ auth: mockAuth }));

vi.mock("@/lib/billing/entitlements", () => ({
  getEntitlementSnapshot: mockGetEntitlementSnapshot,
  enforceFeature: mockEnforceFeature,
  enforceQuota: mockEnforceQuota,
}));

vi.mock("@/lib/ai-provider", () => ({
  callAI: mockCallAI,
}));

vi.mock("@/lib/template-resolver", () => ({
  resolveTemplate: mockResolveTemplate,
  effectiveFrameworkId: mockEffectiveFrameworkId,
  buildSnapshot: mockBuildSnapshot,
  TemplateResolutionError: class TemplateResolutionError extends Error {
    code = "TEMPLATE_INVALID";
  },
}));

vi.mock("@/lib/ai-budget", () => ({
  checkAIBudget: () => ({ allowed: true, error: "", code: "" }),
  recordAICallStart: vi.fn(),
  recordAITokenUsage: vi.fn(),
}));

vi.mock("@/lib/idempotency", () => ({
  beginIdempotentRequest: () => ({ allowed: true }),
  completeIdempotentRequest: vi.fn(),
  failIdempotentRequest: vi.fn(),
}));

vi.mock("@/lib/audit", () => ({
  auditLog: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn().mockResolvedValue({ organizationId: null }),
    },
    visit: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { GET as templatesGet, POST as templatesPost } from "@/app/api/templates/route";
import { GET as billingEntitlementsGet } from "@/app/api/billing/entitlements/route";
import { POST as regeneratePost } from "@/app/api/regenerate-note/route";

describe("API contract envelope", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnforceFeature.mockReturnValue({ allowed: true });
    mockEnforceQuota.mockReturnValue({ allowed: true });
  });

  it("unauthorized returns success:false with code and requestId", async () => {
    mockAuth.mockResolvedValueOnce(null);

    const response = await templatesGet(new NextRequest("http://localhost/api/templates"), undefined);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
    expect(typeof body.error.requestId).toBe("string");
    expect(response.headers.get("x-request-id")).toBeTruthy();
  });

  it("validation errors return success:false and typed code", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: "user_1", role: "CLINICIAN", organizationId: null },
    });
    mockGetEntitlementSnapshot.mockResolvedValueOnce({});

    const request = new NextRequest("http://localhost/api/templates", {
      method: "POST",
      body: JSON.stringify({ domain: "medical", noteFormat: "SOAP" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await templatesPost(request, undefined);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("TEMPLATE_VALIDATION_FAILED");
    expect(typeof body.error.requestId).toBe("string");
  });

  it("forced parse error never returns success:true", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: "user_1", email: "u@example.com", name: "U", role: "CLINICIAN", organizationId: null },
    });
    mockGetEntitlementSnapshot.mockResolvedValueOnce({});
    mockResolveTemplate.mockResolvedValueOnce({
      id: "tmpl_1",
      name: "SOAP",
      domain: "medical",
      type: "SOAP",
      subtype: "Follow-up",
      frameworkSections: [{ id: "s1", title: "Assessment", items: ["A"], required: true }],
      itemCount: 1,
    });
    mockEffectiveFrameworkId.mockReturnValue("soap-followup");
    mockBuildSnapshot.mockReturnValue({ version: 1 });
    mockCallAI.mockResolvedValueOnce({
      content: "{not json",
      usage: { input_tokens: 1, output_tokens: 1 },
      truncated: false,
    });

    const request = new NextRequest("http://localhost/api/regenerate-note", {
      method: "POST",
      body: JSON.stringify({
        parsedData: [{ title: "Assessment", content: "x" }],
        clinicalSynthesis: "synthesis",
        frameworkId: "soap-followup",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await regeneratePost(request, undefined);
    const body = await response.json();

    expect(body.success).toBe(false);
    expect(body.error.code).toBeTruthy();
    expect(typeof body.error.requestId).toBe("string");
  });

  it("no-swallow: thrown stage returns success:false", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user_1" } });
    mockGetEntitlementSnapshot.mockRejectedValueOnce(new Error("db down"));

    const response = await billingEntitlementsGet(new NextRequest("http://localhost/api/billing/entitlements"), undefined);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("INTERNAL_ERROR");
  });
});
