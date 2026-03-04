/**
 * Server-side billing entitlement enforcement.
 *
 * Stub implementation: defaults to "professional" plan with everything allowed.
 * The real implementation would query the subscription database.
 */

import {
  PLAN_DEFINITIONS,
  FEATURE_REQUIRED_PLAN,
  type PlanId,
  type PlanFeatures,
  type PlanQuotas,
} from "./plans";

export interface EntitlementSnapshot {
  plan: PlanId;
  planLabel: string;
  source: "default" | "subscription" | "override";
  subscriptionId: string | null;
  organizationId: string | null;
  userId: string;
  features: PlanFeatures;
  quotas: PlanQuotas;
  usage: {
    monthly_notes: number;
    monthly_audio_minutes: number;
    max_seats: number;
  };
  periodStart: string;
  periodEnd: string;
}

export type FeatureEnforceResult =
  | { allowed: true }
  | { allowed: false; code: "FEATURE_NOT_IN_PLAN"; message: string; requiredPlan: PlanId; feature: string };

export type QuotaEnforceResult =
  | { allowed: true }
  | { allowed: false; code: "PLAN_QUOTA_EXCEEDED"; message: string; key: string; limit: number; current: number };

/**
 * Get the entitlement snapshot for a user.
 * Stub: returns professional plan with zero usage.
 */
export async function getEntitlementSnapshot(userId: string): Promise<EntitlementSnapshot> {
  const plan: PlanId = "professional";
  const def = PLAN_DEFINITIONS[plan];
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    plan,
    planLabel: def.label,
    source: "default",
    subscriptionId: null,
    organizationId: null,
    userId,
    features: { ...def.features },
    quotas: { ...def.quotas },
    usage: {
      monthly_notes: 0,
      monthly_audio_minutes: 0,
      max_seats: 1,
    },
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
  };
}

/**
 * Enforce that a feature is available in the user's plan.
 */
export function enforceFeature(
  snapshot: EntitlementSnapshot,
  feature: keyof PlanFeatures,
): FeatureEnforceResult {
  if (snapshot.features[feature]) {
    return { allowed: true };
  }

  const requiredPlan = FEATURE_REQUIRED_PLAN[feature];
  return {
    allowed: false,
    code: "FEATURE_NOT_IN_PLAN",
    message: `Feature \"${String(feature)}\" requires the ${PLAN_DEFINITIONS[requiredPlan].label} plan or higher.`,
    requiredPlan,
    feature: String(feature),
  };
}

/**
 * Enforce that a quota has capacity for the requested increment.
 */
export function enforceQuota(
  snapshot: EntitlementSnapshot,
  resource: keyof EntitlementSnapshot["quotas"],
  increment: number = 1,
): QuotaEnforceResult {
  const limit = snapshot.quotas[resource];
  const current = snapshot.usage[resource as keyof EntitlementSnapshot["usage"]] ?? 0;

  // Unlimited quota
  if (limit === Infinity) {
    return { allowed: true };
  }

  // Negative or zero increment always allowed
  if (increment <= 0) {
    return { allowed: true };
  }

  if (current + increment > limit) {
    return {
      allowed: false,
      code: "PLAN_QUOTA_EXCEEDED",
      message: `Quota for \"${String(resource)}\" exceeded: ${current}/${limit} used.`,
      key: String(resource),
      limit,
      current,
    };
  }

  return { allowed: true };
}
