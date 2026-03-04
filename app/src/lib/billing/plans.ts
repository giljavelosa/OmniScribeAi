/**
 * Billing plan definitions.
 *
 * Each plan specifies feature flags and quota limits.
 * Quota values of Infinity mean unlimited.
 */

export interface PlanFeatures {
  note_generation: boolean;
  generate_note: boolean;
  regenerate_note: boolean;
  audio_transcription: boolean;
  transcribe_audio: boolean;
  custom_templates: boolean;
  organization_sharing: boolean;
  admin_org_controls: boolean;
  priority_support: boolean;
  sso: boolean;
  audit_logs: boolean;
  api_access: boolean;
}

export interface PlanQuotas {
  monthly_notes: number;
  monthly_audio_minutes: number;
  max_templates: number;
  max_seats: number;
}

export interface PlanDefinition {
  label: string;
  features: PlanFeatures;
  quotas: PlanQuotas;
}

export type PlanId = "starter" | "professional" | "practice" | "enterprise";

function allFeatures(overrides: Partial<PlanFeatures> = {}): PlanFeatures {
  return {
    note_generation: true,
    generate_note: true,
    regenerate_note: true,
    audio_transcription: true,
    transcribe_audio: true,
    custom_templates: false,
    organization_sharing: false,
    admin_org_controls: false,
    priority_support: false,
    sso: false,
    audit_logs: false,
    api_access: false,
    ...overrides,
  };
}

export const PLAN_DEFINITIONS: Record<PlanId, PlanDefinition> = {
  starter: {
    label: "Starter",
    features: allFeatures(),
    quotas: {
      monthly_notes: 120,
      monthly_audio_minutes: 600,
      max_templates: 5,
      max_seats: 1,
    },
  },
  professional: {
    label: "Professional",
    features: allFeatures({
      custom_templates: true,
      api_access: true,
    }),
    quotas: {
      monthly_notes: Infinity,
      monthly_audio_minutes: Infinity,
      max_templates: 50,
      max_seats: 1,
    },
  },
  practice: {
    label: "Practice",
    features: allFeatures({
      custom_templates: true,
      organization_sharing: true,
      priority_support: true,
      audit_logs: true,
      api_access: true,
    }),
    quotas: {
      monthly_notes: Infinity,
      monthly_audio_minutes: Infinity,
      max_templates: Infinity,
      max_seats: 10,
    },
  },
  enterprise: {
    label: "Enterprise",
    features: allFeatures({
      custom_templates: true,
      organization_sharing: true,
      admin_org_controls: true,
      priority_support: true,
      sso: true,
      audit_logs: true,
      api_access: true,
    }),
    quotas: {
      monthly_notes: Infinity,
      monthly_audio_minutes: Infinity,
      max_templates: Infinity,
      max_seats: Infinity,
    },
  },
};

/**
 * Feature-to-minimum-plan mapping.
 * Used by enforceFeature to tell the user which plan they need.
 */
export const FEATURE_REQUIRED_PLAN: Record<keyof PlanFeatures, PlanId> = {
  note_generation: "starter",
  generate_note: "starter",
  regenerate_note: "starter",
  audio_transcription: "starter",
  transcribe_audio: "starter",
  custom_templates: "professional",
  organization_sharing: "practice",
  admin_org_controls: "enterprise",
  priority_support: "practice",
  sso: "enterprise",
  audit_logs: "practice",
  api_access: "professional",
};
