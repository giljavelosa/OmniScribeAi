import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const {
  mockAuth,
  mockGetEntitlementSnapshot,
  mockEnforceFeature,
  mockEnforceQuota,
} = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockGetEntitlementSnapshot: vi.fn(),
  mockEnforceFeature: vi.fn(),
  mockEnforceQuota: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: mockAuth,
}));

vi.mock("@/lib/billing/entitlements", () => ({
  getEntitlementSnapshot: mockGetEntitlementSnapshot,
  enforceFeature: mockEnforceFeature,
  enforceQuota: mockEnforceQuota,
}));

import { POST as transcribePost } from "@/app/api/transcribe/route";

describe("billing route enforcement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("blocks transcribe when feature is not in plan", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: "user_1", role: "CLINICIAN", organizationId: null },
    });
    mockGetEntitlementSnapshot.mockResolvedValueOnce({});
    mockEnforceFeature.mockReturnValueOnce({
      allowed: false,
      message: "This feature requires a higher tier.",
      code: "FEATURE_NOT_IN_PLAN",
      requiredPlan: "professional",
    });

    const response = await transcribePost(
      new NextRequest("http://localhost/api/transcribe", { method: "POST" }),
    );
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.code).toBe("FEATURE_NOT_IN_PLAN");
  });

  it("blocks transcribe when monthly audio quota is exceeded", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: "user_1", role: "CLINICIAN", organizationId: null },
    });
    mockGetEntitlementSnapshot.mockResolvedValueOnce({});
    mockEnforceFeature.mockReturnValueOnce({ allowed: true });
    mockEnforceQuota.mockReturnValueOnce({
      allowed: false,
      message: "Quota exceeded",
      code: "PLAN_QUOTA_EXCEEDED",
      key: "monthly_audio_minutes",
      current: 600,
      limit: 600,
    });

    const response = await transcribePost(
      new NextRequest("http://localhost/api/transcribe", { method: "POST" }),
    );
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body.success).toBe(false);
    expect(body.code).toBe("PLAN_QUOTA_EXCEEDED");
    expect(body.quota).toMatchObject({
      key: "monthly_audio_minutes",
      current: 600,
      limit: 600,
    });
  });
});

