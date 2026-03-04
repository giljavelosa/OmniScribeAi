'use client';

export type BillingSnapshot = {
  plan: string;
  planLabel: string;
  periodStart: string;
  periodEnd: string;
  features: Record<string, boolean>;
  quotas: Record<string, number | null>;
  usage: Record<string, number>;
};

export type BillingEntitlements = {
  plan: string;
  planLabel: string;
  loading: boolean;
  error: null | string;
  snapshot: BillingSnapshot | null;
  canUseFeature: (feature: string) => boolean;
  canUseQuota: (resource: string) => boolean;
};

const now = new Date();
const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

const defaultSnapshot: BillingSnapshot = {
  plan: 'professional',
  planLabel: 'Professional',
  periodStart,
  periodEnd,
  features: {
    generate_note: true,
    regenerate_note: true,
    transcribe_audio: true,
    organization_sharing: true,
    custom_templates: true,
    style_learning: true,
    fhir_export: true,
  },
  quotas: {
    monthly_notes: null,
    monthly_audio_minutes: null,
    max_seats: null,
  },
  usage: {
    monthly_notes: 0,
    monthly_audio_minutes: 0,
    max_seats: 1,
  },
};

export function useBillingEntitlements(): BillingEntitlements {
  return {
    plan: 'professional',
    planLabel: 'Professional',
    loading: false,
    error: null,
    snapshot: defaultSnapshot,
    canUseFeature: () => true,
    canUseQuota: () => true,
  };
}
