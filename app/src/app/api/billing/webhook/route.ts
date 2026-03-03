import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";
import { isPlanCode, type PlanCode } from "@/lib/billing/plans";

type WebhookPayload = {
  type: string;
  data?: {
    subscriptionId?: string;
    customerId?: string;
    status?: string;
    planCode?: string;
    billingInterval?: "monthly" | "annual";
    periodStart?: string;
    periodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    cancelledAt?: string | null;
    seatsIncluded?: number;
    seatsUsed?: number;
    organizationId?: string | null;
    userId?: string | null;
    quotaOverrides?: Record<string, unknown> | null;
    featureOverrides?: Record<string, unknown> | null;
    provider?: string;
  };
};

function parseDate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function normalizeStatus(status: string | undefined): "trialing" | "active" | "past_due" | "canceled" | "paused" {
  if (status === "active" || status === "past_due" || status === "canceled" || status === "paused") {
    return status;
  }
  return "trialing";
}

function normalizePlanCode(value: string | undefined): PlanCode {
  if (value && isPlanCode(value)) return value;
  return "professional";
}

function toJsonValue(value: Record<string, unknown> | null | undefined): Prisma.InputJsonValue | undefined {
  if (value === undefined) return undefined;
  if (value === null) return undefined;
  return value as Prisma.InputJsonValue;
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.BILLING_WEBHOOK_SECRET;
  const providedSecret = request.headers.get("x-omniscribe-webhook-secret");
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json(
      { success: false, error: "Unauthorized", code: "WEBHOOK_UNAUTHORIZED" },
      { status: 401 },
    );
  }

  let payload: WebhookPayload;
  try {
    payload = (await request.json()) as WebhookPayload;
  } catch (error) {
    appLog("warn", "BillingWebhookRoute", "Invalid webhook JSON payload", {
      error: scrubError(error),
    });
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload", code: "INVALID_JSON" },
      { status: 400 },
    );
  }

  const eventType = payload.type;
  const data = payload.data ?? {};
  if (!eventType) {
    return NextResponse.json(
      { success: false, error: "Missing event type", code: "INVALID_EVENT" },
      { status: 400 },
    );
  }

  try {
    if (eventType === "subscription.created" || eventType === "subscription.updated" || eventType === "subscription.canceled") {
      const externalSubscriptionId = data.subscriptionId;
      if (!externalSubscriptionId) {
        return NextResponse.json(
          { success: false, error: "Missing subscriptionId", code: "INVALID_EVENT" },
          { status: 400 },
        );
      }

      const status =
        eventType === "subscription.canceled"
          ? "canceled"
          : normalizeStatus(data.status);

      const upserted = await prisma.subscription.upsert({
        where: { externalSubscriptionId },
        create: {
          externalSubscriptionId,
          externalCustomerId: data.customerId ?? null,
          provider: data.provider ?? "manual",
          planCode: normalizePlanCode(data.planCode),
          status,
          billingInterval: data.billingInterval ?? "monthly",
          organizationId: data.organizationId ?? null,
          userId: data.userId ?? null,
          seatsIncluded: Math.max(1, Math.floor(data.seatsIncluded ?? 1)),
          seatsUsed: Math.max(1, Math.floor(data.seatsUsed ?? 1)),
          periodStart: parseDate(data.periodStart),
          periodEnd: parseDate(data.periodEnd),
          cancelAtPeriodEnd: Boolean(data.cancelAtPeriodEnd),
          cancelledAt: parseDate(data.cancelledAt ?? null),
          quotaOverrides: toJsonValue(data.quotaOverrides),
          featureOverrides: toJsonValue(data.featureOverrides),
        },
        update: {
          externalCustomerId: data.customerId ?? undefined,
          provider: data.provider ?? undefined,
          planCode: normalizePlanCode(data.planCode),
          status,
          billingInterval: data.billingInterval ?? undefined,
          organizationId: data.organizationId ?? undefined,
          userId: data.userId ?? undefined,
          seatsIncluded: data.seatsIncluded != null ? Math.max(1, Math.floor(data.seatsIncluded)) : undefined,
          seatsUsed: data.seatsUsed != null ? Math.max(1, Math.floor(data.seatsUsed)) : undefined,
          periodStart: parseDate(data.periodStart) ?? undefined,
          periodEnd: parseDate(data.periodEnd) ?? undefined,
          cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? undefined,
          cancelledAt: data.cancelledAt !== undefined ? parseDate(data.cancelledAt) : undefined,
          quotaOverrides: toJsonValue(data.quotaOverrides),
          featureOverrides: toJsonValue(data.featureOverrides),
        },
      });

      await auditLog({
        action: "BILLING_SUBSCRIPTION_SYNCED",
        targetType: "subscription",
        targetId: upserted.id,
        metadata: {
          eventType,
          externalSubscriptionId,
          planCode: upserted.planCode,
          status: upserted.status,
        },
      });

      return NextResponse.json({ success: true, subscriptionId: upserted.id });
    }

    if (eventType === "seat.updated") {
      const externalSubscriptionId = data.subscriptionId;
      if (!externalSubscriptionId) {
        return NextResponse.json(
          { success: false, error: "Missing subscriptionId", code: "INVALID_EVENT" },
          { status: 400 },
        );
      }

      const updated = await prisma.subscription.update({
        where: { externalSubscriptionId },
        data: {
          seatsIncluded: Math.max(1, Math.floor(data.seatsIncluded ?? 1)),
          seatsUsed: Math.max(1, Math.floor(data.seatsUsed ?? 1)),
        },
      });

      await auditLog({
        action: "BILLING_SEAT_SYNCED",
        targetType: "subscription",
        targetId: updated.id,
        metadata: {
          eventType,
          externalSubscriptionId,
          seatsIncluded: updated.seatsIncluded,
          seatsUsed: updated.seatsUsed,
        },
      });

      return NextResponse.json({ success: true, subscriptionId: updated.id });
    }

    return NextResponse.json({ success: true, ignored: true, type: eventType });
  } catch (error) {
    appLog("error", "BillingWebhookRoute", "Webhook sync failed", {
      eventType,
      error: scrubError(error),
    });
    return NextResponse.json(
      { success: false, error: "Webhook processing failed", code: "WEBHOOK_PROCESSING_FAILED" },
      { status: 500 },
    );
  }
}

