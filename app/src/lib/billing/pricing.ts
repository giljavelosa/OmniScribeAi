import { prisma } from "@/lib/db";
import type { PlanCode } from "./plans";

const DEFAULT_MONTHLY_CENTS: Record<string, number> = {
  free: 0,
  starter: 4900,
  professional: 7900,
  practice: 14900,
  enterprise: 0,
};

const DEFAULT_ANNUAL_DISCOUNT_PERCENT = 17;

export async function getAnnualDiscountPercent(): Promise<number> {
  try {
    const row = await prisma.billingConfig.findUnique({
      where: { key: "annual_discount_percent" },
    });
    if (!row) return DEFAULT_ANNUAL_DISCOUNT_PERCENT;
    const parsed = parseInt(row.value, 10);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
      return DEFAULT_ANNUAL_DISCOUNT_PERCENT;
    }
    return parsed;
  } catch {
    return DEFAULT_ANNUAL_DISCOUNT_PERCENT;
  }
}

export async function getMonthlyPriceCents(planCode: PlanCode): Promise<number> {
  if (planCode === "free" || planCode === "enterprise") {
    return 0;
  }
  try {
    const row = await prisma.priceConfig.findUnique({
      where: {
        planCode_billingInterval: { planCode, billingInterval: "monthly" },
      },
    });
    if (row && row.amountCents >= 0) return row.amountCents;
  } catch {
    // fall through to default
  }
  return DEFAULT_MONTHLY_CENTS[planCode] ?? 0;
}

export async function getAnnualPriceCents(planCode: PlanCode): Promise<number> {
  if (planCode === "free" || planCode === "enterprise") {
    return 0;
  }
  try {
    const row = await prisma.priceConfig.findUnique({
      where: {
        planCode_billingInterval: { planCode, billingInterval: "annual" },
      },
    });
    if (row && row.amountCents >= 0) return row.amountCents;
  } catch {
    // fall through to computed
  }

  const monthly = await getMonthlyPriceCents(planCode);
  const discount = await getAnnualDiscountPercent();
  const annual = Math.round(monthly * 12 * (1 - discount / 100));
  return Math.max(0, annual);
}

export async function getPriceForPlan(
  planCode: PlanCode,
  billingInterval: "monthly" | "annual",
): Promise<number> {
  if (billingInterval === "monthly") {
    return getMonthlyPriceCents(planCode);
  }
  return getAnnualPriceCents(planCode);
}

export type DiscountValidation =
  | { valid: true; type: "percent" | "fixed_cents"; value: number }
  | { valid: false; reason: string };

export async function validateDiscountCode(code: string): Promise<DiscountValidation> {
  if (!code || typeof code !== "string") {
    return { valid: false, reason: "Invalid code" };
  }
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, reason: "Invalid code" };
  }

  try {
    const row = await prisma.discountCode.findUnique({
      where: { code: normalized },
    });
    if (!row) {
      return { valid: false, reason: "Code not found" };
    }
    const now = new Date();
    if (row.validFrom > now) {
      return { valid: false, reason: "Code not yet valid" };
    }
    if (row.validTo && row.validTo < now) {
      return { valid: false, reason: "Code expired" };
    }
    if (row.maxRedemptions != null && row.redemptionCount >= row.maxRedemptions) {
      return { valid: false, reason: "Code redemption limit reached" };
    }
    if (row.type !== "percent" && row.type !== "fixed_cents") {
      return { valid: false, reason: "Invalid discount type" };
    }
    if (row.type === "percent" && (row.value < 1 || row.value > 100)) {
      return { valid: false, reason: "Invalid percent value" };
    }
    return {
      valid: true,
      type: row.type as "percent" | "fixed_cents",
      value: row.value,
    };
  } catch {
    return { valid: false, reason: "Unable to validate code" };
  }
}
