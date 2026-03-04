import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
  const originalGroqKey = process.env.GROQ_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GROQ_API_KEY = originalGroqKey;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env.GROQ_API_KEY = originalGroqKey;
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

  it("returns actionable error when transcription provider is unconfigured", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: "user_1", role: "CLINICIAN", organizationId: null },
    });
    mockGetEntitlementSnapshot.mockResolvedValueOnce({});
    mockEnforceFeature.mockReturnValueOnce({ allowed: true });
    mockEnforceQuota.mockReturnValueOnce({ allowed: true });
    delete process.env.GROQ_API_KEY;

    const form = new FormData();
    form.append("audio", new File([new Uint8Array(2048)], "clip.wav", { type: "audio/wav" }));
    form.append("frameworkId", "rehab-pt-eval");

    const response = await transcribePost(
      new NextRequest("http://localhost/api/transcribe", { method: "POST", body: form }),
    );
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.success).toBe(false);
    expect(body.code).toBe("TRANSCRIBE_PROVIDER_UNCONFIGURED");
  });

  it("returns provider auth failure code when upstream rejects credentials", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: "user_1", role: "CLINICIAN", organizationId: null },
    });
    mockGetEntitlementSnapshot.mockResolvedValueOnce({});
    mockEnforceFeature.mockReturnValueOnce({ allowed: true });
    mockEnforceQuota.mockReturnValueOnce({ allowed: true });
    process.env.GROQ_API_KEY = "test-key";

    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response("forbidden", { status: 403 }),
    );

    const form = new FormData();
    form.append("audio", new File([new Uint8Array(2048)], "clip.wav", { type: "audio/wav" }));
    form.append("frameworkId", "rehab-pt-eval");

    const response = await transcribePost(
      new NextRequest("http://localhost/api/transcribe", { method: "POST", body: form }),
    );
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.success).toBe(false);
    expect(body.code).toBe("TRANSCRIBE_PROVIDER_AUTH_FAILED");

    fetchSpy.mockRestore();
  });
});
