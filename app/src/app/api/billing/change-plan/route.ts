import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserOrThrow } from "@/lib/auth/current-user";
import { isAuthzError } from "@/lib/auth/errors";
import { getStripeClient, isStripeConfigured } from "@/lib/stripe";
import { getPriceForPlan, validateDiscountCode } from "@/lib/billing/pricing";
import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";
import { PLAN_DEFINITIONS } from "@/lib/billing/plans";
import { z } from "zod";

const ChangePlanSchema = z.object({
  planCode: z.enum(["starter", "professional", "practice"]),
  billingInterval: z.enum(["monthly", "annual"]),
  discountCode: z.string().max(64).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserOrThrow();

    if (!isStripeConfigured()) {
      return NextResponse.json(
        { success: false, error: "Billing is not configured", code: "BILLING_DISABLED" },
        { status: 503 },
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body", code: "INVALID_JSON" },
        { status: 400 },
      );
    }

    const parsed = ChangePlanSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.flatten().formErrors.join("; ") || "Validation failed";
      return NextResponse.json(
        { success: false, error: msg, code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const { planCode, billingInterval, discountCode } = parsed.data;
    const amountCents = await getPriceForPlan(planCode, billingInterval);
    if (amountCents <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid plan", code: "INVALID_PLAN" },
        { status: 400 },
      );
    }

    let finalAmountCents = amountCents;
    if (discountCode) {
      const validation = await validateDiscountCode(discountCode);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.reason, code: "INVALID_DISCOUNT" },
          { status: 400 },
        );
      }
      if (validation.type === "percent") {
        finalAmountCents = Math.round(amountCents * (1 - validation.value / 100));
      } else {
        finalAmountCents = Math.max(0, amountCents - validation.value);
      }
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        OR: [{ userId: user.id }, { organizationId: user.organizationId }],
        externalCustomerId: { not: null },
      },
      orderBy: { createdAt: "desc" },
    });
    const customerId = subscription?.externalCustomerId;

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const returnUrl = `${baseUrl}/account/billing`;

    const stripe = getStripeClient();
    const interval = billingInterval === "annual" ? "year" : "month";
    const planLabel = PLAN_DEFINITIONS[planCode].label;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      metadata: {
        userId: user.id,
        planCode,
        billingInterval,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planCode,
          billingInterval,
        },
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.max(0, finalAmountCents),
            product_data: {
              name: `OmniScribe ${planLabel}`,
              description: `${billingInterval === "annual" ? "Annual" : "Monthly"} subscription`,
            },
            recurring: { interval: interval as "month" | "year" },
          },
          quantity: 1,
        },
      ],
      success_url: returnUrl + "?success=1",
      cancel_url: returnUrl,
      ...(customerId && typeof customerId === "string"
        ? { customer: customerId }
        : { customer_email: user.email }),
    });

    if (!checkoutSession.url) {
      appLog("error", "BillingChangePlanRoute", "Stripe session created without URL");
      return NextResponse.json(
        { success: false, error: "Checkout session creation failed", code: "INTERNAL_ERROR" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, url: checkoutSession.url },
      { status: 200 },
    );
  } catch (error) {
    if (isAuthzError(error)) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.status },
      );
    }
    appLog("error", "BillingChangePlanRoute", "Change plan failed", {
      error: scrubError(error),
    });
    return NextResponse.json(
      { success: false, error: "Failed to change plan. Please try again.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
