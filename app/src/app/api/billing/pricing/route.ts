import { NextResponse } from "next/server";
import {
  getAnnualPriceCents,
  getMonthlyPriceCents,
} from "@/lib/billing/pricing";
import { appLog, scrubError } from "@/lib/logger";
import type { PlanCode } from "@/lib/billing/plans";
import { PLAN_DEFINITIONS } from "@/lib/billing/plans";

const PLANS: PlanCode[] = ["starter", "professional", "practice"];

export async function GET() {
  try {
    const plans: Record<
      string,
      { monthlyCents: number; annualCents: number; label: string }
    > = {};

    for (const code of PLANS) {
      const [monthlyCents, annualCents] = await Promise.all([
        getMonthlyPriceCents(code),
        getAnnualPriceCents(code),
      ]);
      plans[code] = {
        monthlyCents,
        annualCents,
        label: PLAN_DEFINITIONS[code].label,
      };
    }

    return NextResponse.json(
      { success: true, plans },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch (error) {
    appLog("error", "BillingPricingRoute", "Failed to fetch pricing", {
      error: scrubError(error),
    });
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
