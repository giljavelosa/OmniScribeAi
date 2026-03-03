export type PlanCode = "free" | "starter" | "professional" | "practice" | "enterprise";

export type FeatureKey =
  | "transcribe_audio"
  | "generate_note"
  | "regenerate_note"
  | "custom_templates"
  | "organization_sharing"
  | "fhir_export"
  | "admin_org_controls"
  | "priority_support";

export type QuotaKey =
  | "monthly_notes"
  | "monthly_audio_minutes"
  | "max_seats";

export interface PlanDefinition {
  code: PlanCode;
  label: string;
  features: Record<FeatureKey, boolean>;
  quotas: Record<QuotaKey, number | null>;
}

export const PLAN_DEFINITIONS: Record<PlanCode, PlanDefinition> = {
  free: {
    code: "free",
    label: "Free",
    features: {
      transcribe_audio: true,
      generate_note: true,
      regenerate_note: false,
      custom_templates: false,
      organization_sharing: false,
      fhir_export: false,
      admin_org_controls: false,
      priority_support: false,
    },
    quotas: {
      monthly_notes: 10,
      monthly_audio_minutes: 60,
      max_seats: 1,
    },
  },
  starter: {
    code: "starter",
    label: "Starter",
    features: {
      transcribe_audio: true,
      generate_note: true,
      regenerate_note: true,
      custom_templates: false,
      organization_sharing: false,
      fhir_export: false,
      admin_org_controls: false,
      priority_support: false,
    },
    quotas: {
      monthly_notes: 120,
      monthly_audio_minutes: 600,
      max_seats: 1,
    },
  },
  professional: {
    code: "professional",
    label: "Professional",
    features: {
      transcribe_audio: true,
      generate_note: true,
      regenerate_note: true,
      custom_templates: true,
      organization_sharing: false,
      fhir_export: false,
      admin_org_controls: false,
      priority_support: true,
    },
    quotas: {
      monthly_notes: 500,
      monthly_audio_minutes: 3_000,
      max_seats: 1,
    },
  },
  practice: {
    code: "practice",
    label: "Practice",
    features: {
      transcribe_audio: true,
      generate_note: true,
      regenerate_note: true,
      custom_templates: true,
      organization_sharing: true,
      fhir_export: true,
      admin_org_controls: false,
      priority_support: true,
    },
    quotas: {
      monthly_notes: 3_000,
      monthly_audio_minutes: 12_000,
      max_seats: 50,
    },
  },
  enterprise: {
    code: "enterprise",
    label: "Enterprise",
    features: {
      transcribe_audio: true,
      generate_note: true,
      regenerate_note: true,
      custom_templates: true,
      organization_sharing: true,
      fhir_export: true,
      admin_org_controls: true,
      priority_support: true,
    },
    quotas: {
      monthly_notes: null,
      monthly_audio_minutes: null,
      max_seats: null,
    },
  },
};

export function isPlanCode(value: string): value is PlanCode {
  return value === "free" || value === "starter" || value === "professional" || value === "practice" || value === "enterprise";
}

export function getDefaultPlan(): PlanCode {
  const configured = (process.env.ENTITLEMENTS_DEFAULT_PLAN || "free").toLowerCase();
  return isPlanCode(configured) ? configured : "free";
}

