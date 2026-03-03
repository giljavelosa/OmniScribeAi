import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";
import { isPlanCode, type PlanCode } from "@/lib/billing/plans";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function normalizeStatus(
  status: Stripe.Subscription.Status,
): "trialing" | "active" | "past_due" | "canceled" | "paused" {
  if (
    status === "active" ||
    status === "past_due" ||
    status === "canceled" ||
    status === "paused"
  ) {
    return status;
  }
  return "trialing";
}

function normalizePlanCode(value: string | undefined): PlanCode {
  if (value && isPlanCode(value)) return value;
  return "professional";
}

function getBillingInterval(
  interval: string | undefined,
): "monthly" | "annual" {
  return interval === "year" ? "annual" : "monthly";
}

async function syncSubscriptionFromStripe(
  subscription: Stripe.Subscription,
): Promise<{ id: string }> {
  const externalSubscriptionId = subscription.id;
  const externalCustomerId = subscription.customer as string;
  const status = normalizeStatus(subscription.status);

  const metadata = (subscription.metadata || {}) as Record<string, string>;
  const planCode = normalizePlanCode(metadata.planCode);
  const billingInterval = getBillingInterval(
    subscription.items.data[0]?.plan?.interval,
  );
  const userId = metadata.userId || null;
  const organizationId = metadata.organizationId || null;

  const periodStart = subscription.current_period_start
    ? new Date(subscription.current_period_start * 1000)
    : null;
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end ?? false;
  const cancelledAt = subscription.canceled_at
    ? new Date(subscription.canceled_at * 1000)
    : null;

  const upserted = await prisma.subscription.upsert({
    where: { externalSubscriptionId },
    create: {
      externalSubscriptionId,
      externalCustomerId,
      provider: "stripe",
      planCode,
      status,
      billingInterval,
      organizationId,
      userId,
      seatsIncluded: 1,
      seatsUsed: 1,
      periodStart,
      periodEnd,
      cancelAtPeriodEnd,
      cancelledAt,
    },
    update: {
      externalCustomerId,
      provider: "stripe",
      planCode,
      status,
      billingInterval,
      organizationId: organizationId ?? undefined,
      userId: userId ?? undefined,
      periodStart: periodStart ?? undefined,
      periodEnd: periodEnd ?? undefined,
      cancelAtPeriodEnd,
      cancelledAt: cancelledAt ?? undefined,
    },
  });

  await auditLog({
    action: "BILLING_SUBSCRIPTION_SYNCED",
    targetType: "subscription",
    targetId: upserted.id,
    metadata: {
      eventSource: "stripe",
      externalSubscriptionId,
      planCode: upserted.planCode,
      status: upserted.status,
    },
  });

  return { id: upserted.id };
}

async function incrementDiscountRedemptionIfEligible(code: string): Promise<void> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return;
  const row = await prisma.discountCode.findUnique({
    where: { code: normalized },
    select: { id: true, maxRedemptions: true, redemptionCount: true },
  });
  if (!row) return;
  if (row.maxRedemptions != null && row.redemptionCount >= row.maxRedemptions) return;

  await prisma.discountCode.update({
    where: { code: normalized },
    data: { redemptionCount: { increment: 1 } },
  });
}

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    appLog("error", "StripeWebhookRoute", "STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { success: false, error: "Webhook not configured", code: "WEBHOOK_DISABLED" },
      { status: 503 },
    );
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing stripe-signature", code: "INVALID_SIGNATURE" },
        { status: 400 },
      );
    }
    event = getStripeClient().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    appLog("warn", "StripeWebhookRoute", "Signature verification failed", {
      error: scrubError(err),
    });
    return NextResponse.json(
      { success: false, error: `Webhook Error: ${msg}`, code: "INVALID_SIGNATURE" },
      { status: 400 },
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string | null;
      if (!subscriptionId) {
        appLog("warn", "StripeWebhookRoute", "Checkout completed without subscription", {
          sessionId: session.id,
        });
        return NextResponse.json({ received: true });
      }

      const existing = await prisma.subscription.findUnique({
        where: { externalSubscriptionId: subscriptionId },
        select: { id: true },
      });

      const stripe = getStripeClient();
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      await syncSubscriptionFromStripe(subscription);

      const discountCode = session.metadata?.discountCode;
      if (!existing && session.payment_status === "paid" && discountCode) {
        await incrementDiscountRedemptionIfEligible(discountCode);
      }
      return NextResponse.json({ received: true });
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      await syncSubscriptionFromStripe(subscription);
      return NextResponse.json({ received: true });
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const externalSubscriptionId =
        typeof invoice.subscription === "string" ? invoice.subscription : null;
      if (externalSubscriptionId) {
        await prisma.subscription.updateMany({
          where: { externalSubscriptionId },
          data: { status: "past_due" },
        });
      }
      return NextResponse.json({ received: true });
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      const externalSubscriptionId =
        typeof invoice.subscription === "string" ? invoice.subscription : null;
      if (externalSubscriptionId) {
        await prisma.subscription.updateMany({
          where: { externalSubscriptionId },
          data: { status: "active" },
        });
      }
      return NextResponse.json({ received: true });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const externalSubscriptionId = subscription.id;

      await prisma.subscription.updateMany({
        where: { externalSubscriptionId },
        data: {
          status: "canceled",
          cancelledAt: new Date(),
        },
      });

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    appLog("error", "StripeWebhookRoute", "Webhook processing failed", {
      eventType: event.type,
      eventId: event.id,
      error: scrubError(error),
    });
    return NextResponse.json(
      { success: false, error: "Webhook processing failed", code: "PROCESSING_FAILED" },
      { status: 500 },
    );
  }
}
