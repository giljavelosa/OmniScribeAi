import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";
import { SubscriptionStatus } from "@prisma/client";
import {
  PLAN_DEFINITIONS,
  type FeatureKey,
  type PlanCode,
  type PlanDefinition,
  type QuotaKey,
  getDefaultPlan,
  isPlanCode,
} from "./plans";
import { createTrialSubscription, isTrialActive } from "./trial";

type UserContext = {
  id: string;
  organizationId: string | null;
};

type ActiveSubscription = {
  id: string;
  planCode: PlanCode;
  seatsIncluded: number;
  seatsUsed: number;
  quotaOverrides?: Record<string, unknown> | null;
  featureOverrides?: Record<string, unknown> | null;
  periodStart?: Date | null;
  periodEnd?: Date | null;
  organizationId: string | null;
  userId: string | null;
  status: string;
  trialEndsAt?: Date | null;
  trialPlanCode?: PlanCode | null;
};

export type EntitlementSnapshot = {
  plan: PlanCode;
  planLabel: string;
  source: "subscription" | "default";
  subscriptionId: string | null;
  organizationId: string | null;
  userId: string;
  features: Record<FeatureKey, boolean>;
  quotas: Record<QuotaKey, number | null>;
  usage: Record<QuotaKey, number>;
  periodStart: string;
  periodEnd: string;
};

type FeatureCheckResult =
  | { allowed: true }
  | { allowed: false; code: "FEATURE_NOT_IN_PLAN"; message: string; requiredPlan: PlanCode };

type QuotaCheckResult =
  | { allowed: true }
  | { allowed: false; code: "PLAN_QUOTA_EXCEEDED"; message: string; limit: number; current: number; key: QuotaKey };

function startOfMonthUtc(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 1, 0, 0, 0, 0));
}

function endOfMonthUtc(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth() + 1, 1, 0, 0, 0, 0));
}

function parseBoolOverride(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  return null;
}

function parseNumberOverride(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value < 0) return 0;
  return Math.floor(value);
}

function mergePlanWithOverrides(
  basePlan: PlanDefinition,
  subscription: ActiveSubscription | null,
): { features: Record<FeatureKey, boolean>; quotas: Record<QuotaKey, number | null> } {
  const features: Record<FeatureKey, boolean> = { ...basePlan.features };
  const quotas: Record<QuotaKey, number | null> = { ...basePlan.quotas };

  if (!subscription) return { features, quotas };

  const featureOverrides = subscription.featureOverrides ?? {};
  const quotaOverrides = subscription.quotaOverrides ?? {};

  (Object.keys(features) as FeatureKey[]).forEach((featureKey) => {
    const parsed = parseBoolOverride(featureOverrides[featureKey]);
    if (parsed !== null) features[featureKey] = parsed;
  });

  (Object.keys(quotas) as QuotaKey[]).forEach((quotaKey) => {
    const overrideValue = quotaOverrides[quotaKey];
    if (overrideValue === null) {
      quotas[quotaKey] = null;
      return;
    }
    const parsed = parseNumberOverride(overrideValue);
    if (parsed !== null) quotas[quotaKey] = parsed;
  });

  if (quotas.max_seats !== null) {
    quotas.max_seats = Math.max(quotas.max_seats, subscription.seatsIncluded || 1);
  }

  return { features, quotas };
}

async function resolveUserContext(userId: string): Promise<UserContext | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, organizationId: true },
  });
  if (!user) return null;
  return { id: user.id, organizationId: user.organizationId ?? null };
}

function buildSubscriptionWhere(user: UserContext) {
  const activeStatuses = [SubscriptionStatus.trialing, SubscriptionStatus.active, SubscriptionStatus.past_due];
  if (user.organizationId) {
    return {
      status: { in: activeStatuses },
      organizationId: user.organizationId,
    };
  }

  return {
    status: { in: activeStatuses },
    userId: user.id,
  };
}

async function getActiveSubscription(user: UserContext): Promise<ActiveSubscription | null> {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: buildSubscriptionWhere(user),
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        planCode: true,
        seatsIncluded: true,
        seatsUsed: true,
        quotaOverrides: true,
        featureOverrides: true,
        periodStart: true,
        periodEnd: true,
        organizationId: true,
        userId: true,
        status: true,
        trialEndsAt: true,
        trialPlanCode: true,
      },
    });
    if (!subscription) return null;
    if (!isPlanCode(String(subscription.planCode))) return null;
    if (subscription.status === "trialing" && !isTrialActive(subscription)) {
      return null;
    }
    const effectivePlan =
      subscription.status === "trialing" && subscription.trialPlanCode && isPlanCode(String(subscription.trialPlanCode))
        ? (subscription.trialPlanCode as PlanCode)
        : (subscription.planCode as PlanCode);
    return {
      ...subscription,
      planCode: effectivePlan,
      organizationId: subscription.organizationId ?? null,
      userId: subscription.userId ?? null,
      quotaOverrides: (subscription.quotaOverrides as Record<string, unknown> | null) ?? null,
      featureOverrides: (subscription.featureOverrides as Record<string, unknown> | null) ?? null,
      trialEndsAt: subscription.trialEndsAt ?? null,
      trialPlanCode: subscription.trialPlanCode ?? null,
    };
  } catch (error) {
    // Keep app routes available if DB is not migrated yet.
    appLog("warn", "Entitlements", "Subscription lookup failed, using default plan", {
      error: scrubError(error),
      userId: user.id,
    });
    return null;
  }
}

async function getUsageSnapshot(
  user: UserContext,
  periodStart: Date,
  periodEnd: Date,
): Promise<Record<QuotaKey, number>> {
  const periodFilter = {
    gte: periodStart,
    lt: periodEnd,
  };

  if (user.organizationId) {
    const [noteCount, durationAggregate, activeSeats] = await Promise.all([
      prisma.visit.count({
        where: {
          organizationId: user.organizationId,
          createdAt: periodFilter,
        },
      }),
      prisma.visit.aggregate({
        where: {
          organizationId: user.organizationId,
          createdAt: periodFilter,
        },
        _sum: { duration: true },
      }),
      prisma.user.count({
        where: {
          organizationId: user.organizationId,
          isActive: true,
        },
      }),
    ]);

    const totalSeconds = durationAggregate._sum.duration ?? 0;
    return {
      monthly_notes: noteCount,
      monthly_audio_minutes: Math.ceil(totalSeconds / 60),
      max_seats: activeSeats,
    };
  }

  const [noteCount, durationAggregate] = await Promise.all([
    prisma.visit.count({
      where: {
        userId: user.id,
        createdAt: periodFilter,
      },
    }),
    prisma.visit.aggregate({
      where: {
        userId: user.id,
        createdAt: periodFilter,
      },
      _sum: { duration: true },
    }),
  ]);

  const totalSeconds = durationAggregate._sum.duration ?? 0;
  return {
    monthly_notes: noteCount,
    monthly_audio_minutes: Math.ceil(totalSeconds / 60),
    max_seats: 1,
  };
}

export async function getEntitlementSnapshot(userId: string): Promise<EntitlementSnapshot> {
  const user = await resolveUserContext(userId);
  if (!user) {
    const fallbackPlan = getDefaultPlan();
    const base = PLAN_DEFINITIONS[fallbackPlan];
    const now = new Date();
    return {
      plan: fallbackPlan,
      planLabel: base.label,
      source: "default",
      subscriptionId: null,
      organizationId: null,
      userId,
      features: { ...base.features },
      quotas: { ...base.quotas },
      usage: { monthly_notes: 0, monthly_audio_minutes: 0, max_seats: 1 },
      periodStart: startOfMonthUtc(now).toISOString(),
      periodEnd: endOfMonthUtc(now).toISOString(),
    };
  }

  let subscription = await getActiveSubscription(user);
  if (!subscription) {
    const hasAny = await prisma.subscription.findFirst({ where: { userId: user.id } });
    if (!hasAny) {
      try {
        await createTrialSubscription(user.id);
        subscription = await getActiveSubscription(user);
      } catch (err) {
        appLog("warn", "Entitlements", "Trial creation failed, using default plan", {
          userId: user.id,
          error: scrubError(err),
        });
      }
    }
  }
  const planCode = subscription?.planCode ?? getDefaultPlan();
  const basePlan = PLAN_DEFINITIONS[planCode];
  const merged = mergePlanWithOverrides(basePlan, subscription);

  const now = new Date();
  const periodStart = subscription?.periodStart ?? startOfMonthUtc(now);
  const periodEnd = subscription?.periodEnd ?? endOfMonthUtc(now);

  const usage = await getUsageSnapshot(user, periodStart, periodEnd);

  return {
    plan: planCode,
    planLabel: basePlan.label,
    source: subscription ? "subscription" : "default",
    subscriptionId: subscription?.id ?? null,
    organizationId: user.organizationId,
    userId: user.id,
    features: merged.features,
    quotas: merged.quotas,
    usage,
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
  };
}

function minimumPlanForFeature(featureKey: FeatureKey): PlanCode {
  const order: PlanCode[] = ["free", "starter", "professional", "practice", "enterprise"];
  for (const plan of order) {
    if (PLAN_DEFINITIONS[plan].features[featureKey]) {
      return plan;
    }
  }
  return "enterprise";
}

export function hasFeature(snapshot: EntitlementSnapshot, featureKey: FeatureKey): boolean {
  return snapshot.features[featureKey] === true;
}

export function enforceFeature(snapshot: EntitlementSnapshot, featureKey: FeatureKey): FeatureCheckResult {
  if (hasFeature(snapshot, featureKey)) {
    return { allowed: true };
  }
  const requiredPlan = minimumPlanForFeature(featureKey);
  return {
    allowed: false,
    code: "FEATURE_NOT_IN_PLAN",
    requiredPlan,
    message: `This feature requires the ${PLAN_DEFINITIONS[requiredPlan].label} tier or higher.`,
  };
}

export function enforceQuota(
  snapshot: EntitlementSnapshot,
  quotaKey: QuotaKey,
  requestedIncrement: number = 0,
): QuotaCheckResult {
  const limit = snapshot.quotas[quotaKey];
  if (limit === null) {
    return { allowed: true };
  }

  const current = snapshot.usage[quotaKey] ?? 0;
  const projected = current + Math.max(0, Math.floor(requestedIncrement));
  if (projected <= limit) {
    return { allowed: true };
  }

  return {
    allowed: false,
    code: "PLAN_QUOTA_EXCEEDED",
    message: `Quota exceeded for ${quotaKey.replace(/_/g, " ")} (${current}/${limit}).`,
    limit,
    current,
    key: quotaKey,
  };
}

