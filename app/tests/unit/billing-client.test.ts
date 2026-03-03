import { describe, expect, it } from "vitest";
import { parseBillingEntitlementResponse } from "@/lib/billing/client";

describe("parseBillingEntitlementResponse", () => {
  const snapshot = {
    plan: "starter",
    planLabel: "Starter",
    source: "default",
    features: {
      generate_note: true,
    },
    quotas: {
      monthly_notes: 120,
    },
    usage: {
      monthly_notes: 4,
    },
    periodStart: "2026-03-01T00:00:00.000Z",
    periodEnd: "2026-04-01T00:00:00.000Z",
  };

  it("parses wrapped envelope payloads", () => {
    const parsed = parseBillingEntitlementResponse({
      success: true,
      data: snapshot,
    });
    expect(parsed).toBeTruthy();
    expect(parsed?.usage.monthly_notes).toBe(4);
  });

  it("parses legacy flat success payloads", () => {
    const parsed = parseBillingEntitlementResponse({
      success: true,
      ...snapshot,
    });
    expect(parsed).toBeTruthy();
    expect(parsed?.quotas.monthly_notes).toBe(120);
  });

  it("returns null for invalid payload", () => {
    const parsed = parseBillingEntitlementResponse({
      success: true,
      data: { plan: "starter" },
    });
    expect(parsed).toBeNull();
  });
});
