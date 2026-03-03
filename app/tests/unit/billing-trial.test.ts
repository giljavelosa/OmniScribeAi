import { describe, expect, it, vi } from "vitest";
import { isTrialActive, TRIAL_DAYS, getTrialPlanCode } from "@/lib/billing/trial";

describe("trial", () => {
  describe("isTrialActive", () => {
    it("returns false when status is not trialing", () => {
      expect(
        isTrialActive({
          status: "active",
          trialEndsAt: new Date(Date.now() + 86400000),
        }),
      ).toBe(false);
    });

    it("returns false when trialEndsAt is null", () => {
      expect(
        isTrialActive({
          status: "trialing",
          trialEndsAt: null,
        }),
      ).toBe(false);
    });

    it("returns false when trial has ended", () => {
      expect(
        isTrialActive({
          status: "trialing",
          trialEndsAt: new Date(Date.now() - 1000),
        }),
      ).toBe(false);
    });

    it("returns true when trialing and trialEndsAt is in future", () => {
      expect(
        isTrialActive({
          status: "trialing",
          trialEndsAt: new Date(Date.now() + 86400000),
        }),
      ).toBe(true);
    });
  });

  describe("TRIAL_DAYS", () => {
    it("is 15", () => {
      expect(TRIAL_DAYS).toBe(15);
    });
  });

  describe("getTrialPlanCode", () => {
    it("returns professional by default", () => {
      const original = process.env.TRIAL_PLAN_CODE;
      delete process.env.TRIAL_PLAN_CODE;
      expect(getTrialPlanCode()).toBe("professional");
      if (original !== undefined) process.env.TRIAL_PLAN_CODE = original;
    });
  });
});
