import { useEffect, useState } from "react";
import type { FeatureKey, PlanCode, QuotaKey } from "./plans";

export interface BillingEntitlementSnapshot {
  plan: PlanCode;
  planLabel: string;
  source: "subscription" | "default";
  features: Record<FeatureKey, boolean>;
  quotas: Record<QuotaKey, number | null>;
  usage: Record<QuotaKey, number>;
  periodStart: string;
  periodEnd: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

export function parseBillingEntitlementResponse(payload: unknown): BillingEntitlementSnapshot | null {
  if (!isRecord(payload) || payload.success !== true) return null;

  const source = isRecord(payload.data) ? payload.data : payload;
  if (!isRecord(source)) return null;

  const plan = source.plan;
  const planLabel = source.planLabel;
  const snapshotSource = source.source;
  const features = source.features;
  const quotas = source.quotas;
  const usage = source.usage;
  const periodStart = source.periodStart;
  const periodEnd = source.periodEnd;

  if (
    typeof plan !== "string" ||
    typeof planLabel !== "string" ||
    (snapshotSource !== "subscription" && snapshotSource !== "default") ||
    !isRecord(features) ||
    !isRecord(quotas) ||
    !isRecord(usage) ||
    typeof periodStart !== "string" ||
    typeof periodEnd !== "string"
  ) {
    return null;
  }

  return {
    plan: plan as PlanCode,
    planLabel,
    source: snapshotSource,
    features: features as Record<FeatureKey, boolean>,
    quotas: quotas as Record<QuotaKey, number | null>,
    usage: usage as Record<QuotaKey, number>,
    periodStart,
    periodEnd,
  };
}

export function useBillingEntitlements() {
  const [snapshot, setSnapshot] = useState<BillingEntitlementSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/billing/entitlements")
      .then(async (res) => {
        if (!res.ok) return null;
        return parseBillingEntitlementResponse(await res.json());
      })
      .then((data) => {
        if (cancelled || !data) return;
        setSnapshot(data);
      })
      .catch(() => {
        // UI falls back gracefully when entitlement snapshot is unavailable.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { snapshot, loading };
}

