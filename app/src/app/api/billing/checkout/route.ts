import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCurrentUserOrThrow } from "@/lib/auth/current-user";
import { isAuthzError } from "@/lib/auth/errors";
import { getStripeClient, isStripeConfigured } from "@/lib/stripe";
import { getPriceForPlan, validateDiscountCode } from "@/lib/billing/pricing";
import { appLog, scrubError } from "@/lib/logger";
import { PLAN_DEFINITIONS } from "@/lib/billing/plans";
import { z } from "zod";

const CheckoutSchema = z.object({
  planCode: z.enum(["starter", "professional", "practice"]),
  billingInterval: z.enum(["monthly", "annual"]),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
  discountCode: z.string().max(64).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

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

    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.flatten().formErrors.join("; ") || "Validation failed";
      return NextResponse.json(
        { success: false, error: msg, code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const { planCode, billingInterval, successUrl, cancelUrl, discountCode } = parsed.data;
    const user = await getCurrentUserOrThrow();

    const amountCents = await getPriceForPlan(planCode, billingInterval);
    if (amountCents <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid plan", code: "INVALID_PLAN" },
        { status: 400 },
      );
    }

    let finalAmountCents = amountCents;
    let appliedDiscountCode: string | undefined;

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
      appliedDiscountCode = discountCode.trim().toUpperCase();
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const success = successUrl || `${baseUrl}/account/billing?success=1`;
    const cancel = cancelUrl || `${baseUrl}/pricing`;

    const stripe = getStripeClient();
    const interval = (billingInterval === "annual" ? "year" : "month") as "month" | "year";
    const planLabel = PLAN_DEFINITIONS[planCode].label;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      metadata: {
        userId: user.id,
        planCode,
        billingInterval,
        discountCode: appliedDiscountCode || "",
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planCode,
          billingInterval,
          discountCode: appliedDiscountCode || "",
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
            recurring: { interval },
          },
          quantity: 1,
        },
      ],
      success_url: success,
      cancel_url: cancel,
    });

    if (!checkoutSession.url) {
      appLog("error", "BillingCheckoutRoute", "Stripe session created without URL", {
        sessionId: checkoutSession.id,
      });
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
    appLog("error", "BillingCheckoutRoute", "Checkout failed", {
      error: scrubError(error),
    });
    return NextResponse.json(
      { success: false, error: "Checkout failed. Please try again.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
