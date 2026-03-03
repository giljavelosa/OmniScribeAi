import { describe, it, expect } from "vitest";
import { PLAN_DEFINITIONS } from "@/lib/billing/plans";
import { enforceFeature, enforceQuota, type EntitlementSnapshot } from "@/lib/billing/entitlements";

function makeSnapshot(plan: keyof typeof PLAN_DEFINITIONS): EntitlementSnapshot {
  const def = PLAN_DEFINITIONS[plan];
  return {
    plan,
    planLabel: def.label,
    source: "default",
    subscriptionId: null,
    organizationId: null,
    userId: "user_123",
    features: { ...def.features },
    quotas: { ...def.quotas },
    usage: {
      monthly_notes: 0,
      monthly_audio_minutes: 0,
      max_seats: 1,
    },
    periodStart: new Date("2026-03-01T00:00:00.000Z").toISOString(),
    periodEnd: new Date("2026-04-01T00:00:00.000Z").toISOString(),
  };
}

describe("billing entitlements", () => {
  it("blocks sharing for professional tier", () => {
    const snapshot = makeSnapshot("professional");
    const result = enforceFeature(snapshot, "organization_sharing");
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.requiredPlan).toBe("practice");
      expect(result.code).toBe("FEATURE_NOT_IN_PLAN");
    }
  });

  it("allows sharing for practice tier", () => {
    const snapshot = makeSnapshot("practice");
    const result = enforceFeature(snapshot, "organization_sharing");
    expect(result.allowed).toBe(true);
  });

  it("enforces finite note quota", () => {
    const snapshot = makeSnapshot("starter");
    snapshot.usage.monthly_notes = 120;
    const result = enforceQuota(snapshot, "monthly_notes", 1);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.limit).toBe(120);
      expect(result.current).toBe(120);
      expect(result.code).toBe("PLAN_QUOTA_EXCEEDED");
    }
  });

  it("does not block enterprise unlimited quota", () => {
    const snapshot = makeSnapshot("enterprise");
    snapshot.usage.monthly_notes = 999_999;
    const result = enforceQuota(snapshot, "monthly_notes", 100);
    expect(result.allowed).toBe(true);
  });

  it("allows quota request exactly at limit boundary", () => {
    const snapshot = makeSnapshot("starter");
    snapshot.usage.monthly_audio_minutes = 599;
    const result = enforceQuota(snapshot, "monthly_audio_minutes", 1);
    expect(result.allowed).toBe(true);
  });

  it("blocks quota request above limit boundary", () => {
    const snapshot = makeSnapshot("starter");
    snapshot.usage.monthly_audio_minutes = 599;
    const result = enforceQuota(snapshot, "monthly_audio_minutes", 2);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.limit).toBe(600);
      expect(result.current).toBe(599);
      expect(result.key).toBe("monthly_audio_minutes");
    }
  });

  it("does not increase usage projection for negative increment", () => {
    const snapshot = makeSnapshot("professional");
    snapshot.usage.monthly_notes = 500;
    const result = enforceQuota(snapshot, "monthly_notes", -5);
    expect(result.allowed).toBe(true);
  });

  it("maps higher-tier feature requirements deterministically", () => {
    const snapshot = makeSnapshot("practice");
    const result = enforceFeature(snapshot, "admin_org_controls");
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.requiredPlan).toBe("enterprise");
    }
  });
});

