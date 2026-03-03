import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  getMonthlyPriceCents,
  getAnnualPriceCents,
  getAnnualDiscountPercent,
  validateDiscountCode,
} from "@/lib/billing/pricing";

vi.mock("@/lib/db", () => ({
  prisma: {
    priceConfig: {
      findUnique: vi.fn(),
    },
    billingConfig: {
      findUnique: vi.fn(),
    },
    discountCode: {
      findUnique: vi.fn(),
    },
  },
}));

const { prisma } = await import("@/lib/db");

describe("pricing", () => {
  beforeEach(() => {
    vi.mocked(prisma.priceConfig.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.billingConfig.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.discountCode.findUnique).mockResolvedValue(null);
  });

  describe("getMonthlyPriceCents", () => {
    it("returns 0 for free plan", async () => {
      expect(await getMonthlyPriceCents("free")).toBe(0);
    });

    it("returns 0 for enterprise plan", async () => {
      expect(await getMonthlyPriceCents("enterprise")).toBe(0);
    });

    it("returns default for starter when no DB row", async () => {
      expect(await getMonthlyPriceCents("starter")).toBe(4900);
    });

    it("returns DB value when row exists", async () => {
      vi.mocked(prisma.priceConfig.findUnique).mockResolvedValue({
        id: "1",
        planCode: "starter",
        billingInterval: "monthly",
        amountCents: 3900,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(await getMonthlyPriceCents("starter")).toBe(3900);
    });
  });

  describe("getAnnualPriceCents", () => {
    it("returns 0 for free plan", async () => {
      expect(await getAnnualPriceCents("free")).toBe(0);
    });

    it("computes from monthly when no annual row and 17% discount", async () => {
      vi.mocked(prisma.billingConfig.findUnique).mockResolvedValue({
        id: "1",
        key: "annual_discount_percent",
        value: "17",
        updatedAt: new Date(),
      });
      expect(await getAnnualPriceCents("starter")).toBe(
        Math.round(4900 * 12 * (1 - 17 / 100)),
      );
    });
  });

  describe("getAnnualDiscountPercent", () => {
    it("returns default 17 when no config", async () => {
      expect(await getAnnualDiscountPercent()).toBe(17);
    });

    it("returns DB value when config exists", async () => {
      vi.mocked(prisma.billingConfig.findUnique).mockResolvedValue({
        id: "1",
        key: "annual_discount_percent",
        value: "20",
        updatedAt: new Date(),
      });
      expect(await getAnnualDiscountPercent()).toBe(20);
    });
  });

  describe("validateDiscountCode", () => {
    it("returns invalid for empty code", async () => {
      const r = await validateDiscountCode("");
      expect(r.valid).toBe(false);
    });

    it("returns invalid when code not found", async () => {
      const r = await validateDiscountCode("UNKNOWN");
      expect(r.valid).toBe(false);
    });

    it("returns valid when code exists and is in range", async () => {
      vi.mocked(prisma.discountCode.findUnique).mockResolvedValue({
        id: "1",
        code: "LAUNCH10",
        type: "percent",
        value: 10,
        validFrom: new Date(Date.now() - 86400000),
        validTo: new Date(Date.now() + 86400000),
        maxRedemptions: 100,
        redemptionCount: 5,
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const r = await validateDiscountCode("launch10");
      expect(r.valid).toBe(true);
      if (r.valid) {
        expect(r.type).toBe("percent");
        expect(r.value).toBe(10);
      }
    });
  });
});
