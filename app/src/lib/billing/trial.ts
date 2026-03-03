import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";
import type { PlanCode } from "./plans";
import { isPlanCode } from "./plans";

export const TRIAL_DAYS = 15;

const DEFAULT_TRIAL_PLAN: PlanCode = "professional";

export function getTrialPlanCode(): PlanCode {
  const configured = (process.env.TRIAL_PLAN_CODE || DEFAULT_TRIAL_PLAN).toLowerCase();
  return isPlanCode(configured) ? configured : DEFAULT_TRIAL_PLAN;
}

export function isTrialActive(sub: {
  status: string;
  trialEndsAt: Date | null;
}): boolean {
  if (sub.status !== "trialing") return false;
  if (!sub.trialEndsAt) return false;
  return sub.trialEndsAt > new Date();
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export async function createTrialSubscription(
  userId: string,
  planCode?: PlanCode,
): Promise<{ id: string }> {
  const trialPlan = planCode ?? getTrialPlanCode();
  const trialEndsAt = addDays(new Date(), TRIAL_DAYS);

  const existingTrialing = await prisma.subscription.findFirst({
    where: { userId, status: "trialing" },
  });
  if (existingTrialing) return { id: existingTrialing.id };

  const anySubscription = await prisma.subscription.findFirst({
    where: { userId },
  });
  if (anySubscription) {
    return { id: anySubscription.id };
  }

  const subscription = await prisma.subscription.create({
    data: {
      userId,
      planCode: trialPlan,
      status: "trialing",
      billingInterval: "monthly",
      trialEndsAt,
      trialPlanCode: trialPlan,
      seatsIncluded: 1,
      seatsUsed: 1,
      periodStart: new Date(),
      periodEnd: trialEndsAt,
    },
    select: { id: true },
  });

  appLog("info", "Trial", "Created trial subscription", {
    subscriptionId: subscription.id,
    userId,
    trialPlan,
    trialEndsAt: trialEndsAt.toISOString(),
  });

  return subscription;
}

export async function createTrialSubscriptionForOrg(
  organizationId: string,
  planCode?: PlanCode,
): Promise<{ id: string }> {
  const trialPlan = planCode ?? getTrialPlanCode();
  const trialEndsAt = addDays(new Date(), TRIAL_DAYS);

  const existingTrialing = await prisma.subscription.findFirst({
    where: { organizationId, status: "trialing" },
  });
  if (existingTrialing) return { id: existingTrialing.id };

  const anySubscription = await prisma.subscription.findFirst({
    where: { organizationId },
  });
  if (anySubscription) {
    return { id: anySubscription.id };
  }

  const subscription = await prisma.subscription.create({
    data: {
      organizationId,
      planCode: trialPlan,
      status: "trialing",
      billingInterval: "monthly",
      trialEndsAt,
      trialPlanCode: trialPlan,
      seatsIncluded: 1,
      seatsUsed: 1,
      periodStart: new Date(),
      periodEnd: trialEndsAt,
    },
    select: { id: true },
  });

  appLog("info", "Trial", "Created org trial subscription", {
    subscriptionId: subscription.id,
    organizationId,
    trialPlan,
    trialEndsAt: trialEndsAt.toISOString(),
  });

  return subscription;
}
