import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserOrThrow } from "@/lib/auth/current-user";
import { isAuthzError } from "@/lib/auth/errors";
import { getStripeClient, isStripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserOrThrow();

    if (!isStripeConfigured()) {
      return NextResponse.json(
        { success: false, error: "Billing is not configured", code: "BILLING_DISABLED" },
        { status: 503 },
      );
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        externalCustomerId: { not: null },
        status: { in: ["active", "trialing", "past_due"] },
      },
      orderBy: { createdAt: "desc" },
    });

    const customerId = subscription?.externalCustomerId;
    if (!customerId || typeof customerId !== "string") {
      return NextResponse.json(
        { success: false, error: "No billing account found. Subscribe to a plan first.", code: "NO_CUSTOMER" },
        { status: 400 },
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const returnUrl = `${baseUrl}/account/billing`;

    const stripe = getStripeClient();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    if (!portalSession.url) {
      appLog("error", "BillingPortalRoute", "Portal session created without URL");
      return NextResponse.json(
        { success: false, error: "Failed to create portal session", code: "INTERNAL_ERROR" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, url: portalSession.url },
      { status: 200 },
    );
  } catch (error) {
    if (isAuthzError(error)) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.status },
      );
    }
    appLog("error", "BillingPortalRoute", "Portal creation failed", {
      error: scrubError(error),
    });
    return NextResponse.json(
      { success: false, error: "Failed to open billing portal. Please try again.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
