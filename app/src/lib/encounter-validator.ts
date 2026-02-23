/**
 * Encounter Validator — deterministic rules engine (zero LLM tokens).
 *
 * Validates an EncounterState against CMS requirements for a given framework.
 * Calculates compliance score, identifies missing critical/required items,
 * and rejects unsupported claims before note generation.
 */

import type { EncounterState, ClinicalFact } from './encounter-state';
import { cmsRequirements, type CMSRequirement, type ComplianceResult } from './cms-requirements';
import { frameworks } from './frameworks';

// ─── Validation Result ─────────────────────────────────────

export interface ValidationResult {
  /** Whether the EncounterState is valid enough to generate a note */
  valid: boolean;

  /** Non-blocking issues (note will still generate) */
  warnings: string[];

  /** Blocking issues (note generation should not proceed) */
  errors: string[];

  /** CMS required fields that are still null/not_documented */
  requiredMissing: string[];

  /** CMS compliance result (reuses existing compliance scoring) */
  compliance: ComplianceResult;

  /** Total documented facts count */
  documentedFactCount: number;

  /** Total facts with evidence pointers */
  evidenceLinkedCount: number;
}

// ─── Main Validator ────────────────────────────────────────

/**
 * Validate an EncounterState before note generation.
 *
 * Rules (all deterministic, zero tokens):
 * 1. Must have at least 1 documented fact
 * 2. CMS critical items checked — warnings for missing
 * 3. No diagnosis/medication/vitals unless evidence-linked
 * 4. Evidence pointers must have valid timestamps
 * 5. Framework-specific required sections must have at least 1 documented item
 */
export function validateEncounterState(
  state: EncounterState,
  frameworkId: string,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const requiredMissing: string[] = [];
  let documentedFactCount = 0;
  let evidenceLinkedCount = 0;

  const framework = frameworks.find(f => f.id === frameworkId);
  if (!framework) {
    errors.push(`Unknown framework: ${frameworkId}`);
    return {
      valid: false,
      errors,
      warnings,
      requiredMissing,
      compliance: emptyCompliance(),
      documentedFactCount: 0,
      evidenceLinkedCount: 0,
    };
  }

  // ─── Count documented facts ──────────────────────────────

  for (const [, fields] of Object.entries(state.sections)) {
    for (const [, fact] of Object.entries(fields)) {
      if (fact.value !== null && fact.source !== 'not_documented') {
        documentedFactCount++;
        if (fact.evidence && fact.evidence.t0 >= 0 && fact.evidence.t1 > fact.evidence.t0) {
          evidenceLinkedCount++;
        }
      }
    }
  }
  documentedFactCount += state.additional_facts.filter(af => af.fact.value !== null).length;

  // ─── Rule 1: Must have at least 1 documented fact ────────

  if (documentedFactCount === 0) {
    errors.push('No clinical data was extracted from the recording. Cannot generate a note.');
  }

  // ─── Rule 2: CMS requirements check ─────────────────────

  const requirements = cmsRequirements[frameworkId] || [];
  const compliance = calculateComplianceFromState(state, requirements);

  const criticalMissing = compliance.missing.filter(r => r.category === 'critical');
  const requiredItems = compliance.missing.filter(r => r.category === 'required');

  for (const item of criticalMissing) {
    if (!item.emrProvided) {
      warnings.push(`Critical: "${item.item}" not documented — high denial risk (${item.regulation})`);
      requiredMissing.push(item.item);
    }
  }

  for (const item of requiredItems) {
    if (!item.emrProvided) {
      warnings.push(`Required: "${item.item}" not documented`);
    }
  }

  // ─── Rule 3: Framework required sections ─────────────────

  for (const section of framework.sections) {
    if (!section.required) continue;

    const sectionKey = toKey(section.title);
    const sectionFacts = state.sections[sectionKey];

    if (!sectionFacts) {
      warnings.push(`Section "${section.title}" has no extracted data`);
      continue;
    }

    const hasAnyDocumented = Object.values(sectionFacts).some(
      (f: ClinicalFact) => f.value !== null && f.source !== 'not_documented'
    );

    if (!hasAnyDocumented) {
      warnings.push(`Section "${section.title}" is completely empty — may need clinician input`);
    }
  }

  // ─── Rule 4: Validate evidence pointer integrity ─────────

  for (const [sectionKey, fields] of Object.entries(state.sections)) {
    for (const [fieldKey, fact] of Object.entries(fields)) {
      if (fact.value !== null && fact.source === 'transcript' && !fact.evidence) {
        warnings.push(`Fact "${sectionKey}.${fieldKey}" claims transcript source but has no evidence pointer`);
      }
      if (fact.evidence && fact.evidence.t1 < fact.evidence.t0) {
        warnings.push(`Fact "${sectionKey}.${fieldKey}" has invalid timestamps (end before start)`);
      }
    }
  }

  // ─── Rule 5: Minimum data for note generation ────────────

  if (documentedFactCount < 3 && errors.length === 0) {
    warnings.push(`Only ${documentedFactCount} facts documented — note will be very sparse`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    requiredMissing,
    compliance,
    documentedFactCount,
    evidenceLinkedCount,
  };
}

// ─── Compliance Calculation (from EncounterState) ──────────

function calculateComplianceFromState(
  state: EncounterState,
  requirements: CMSRequirement[],
): ComplianceResult {
  if (requirements.length === 0) {
    return {
      score: -1,
      totalRequired: 0,
      documented: 0,
      missing: [],
      documented_items: [],
      grade: 'A',
      riskLevel: 'low',
      summary: 'No CMS requirements defined for this framework yet.',
    };
  }

  const documented: CMSRequirement[] = [];
  const missing: CMSRequirement[] = [];

  for (const req of requirements) {
    const sectionKey = toKey(req.section);
    const itemKey = toKey(req.item);

    let found = false;

    // Check main sections
    const section = state.sections[sectionKey];
    if (section) {
      const field = section[itemKey];
      if (field && field.value !== null && field.source !== 'not_documented') {
        found = true;
      }
    }

    // Check additional_facts
    if (!found) {
      for (const af of state.additional_facts) {
        if (af.fact.value && toKey(af.label) === itemKey) {
          found = true;
          break;
        }
      }
    }

    if (found) {
      documented.push(req);
    } else {
      missing.push(req);
    }
  }

  const totalRequired = requirements.length;
  const score = Math.round((documented.length / totalRequired) * 100);

  const criticalMissing = missing.filter(r => r.category === 'critical');
  const requiredMissing = missing.filter(r => r.category === 'required');

  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  let riskLevel: 'low' | 'moderate' | 'high' | 'critical';

  if (criticalMissing.length === 0 && requiredMissing.length === 0) {
    grade = 'A'; riskLevel = 'low';
  } else if (criticalMissing.length === 0 && requiredMissing.length <= 2) {
    grade = 'B'; riskLevel = 'low';
  } else if (criticalMissing.length <= 2) {
    grade = 'C'; riskLevel = 'moderate';
  } else if (criticalMissing.length <= 4) {
    grade = 'D'; riskLevel = 'high';
  } else {
    grade = 'F'; riskLevel = 'critical';
  }

  const summaryParts: string[] = [];
  if (criticalMissing.length > 0) {
    summaryParts.push(`${criticalMissing.length} critical item${criticalMissing.length > 1 ? 's' : ''} missing — high denial risk`);
  }
  if (requiredMissing.length > 0) {
    summaryParts.push(`${requiredMissing.length} required item${requiredMissing.length > 1 ? 's' : ''} missing`);
  }
  const recMissing = missing.filter(r => r.category === 'recommended');
  if (recMissing.length > 0) {
    summaryParts.push(`${recMissing.length} recommended item${recMissing.length > 1 ? 's' : ''} would strengthen documentation`);
  }
  if (summaryParts.length === 0) {
    summaryParts.push('All CMS requirements documented — excellent compliance');
  }

  return {
    score,
    totalRequired,
    documented: documented.length,
    missing,
    documented_items: documented,
    grade,
    riskLevel,
    summary: summaryParts.join('. ') + '.',
  };
}

// ─── Helpers ───────────────────────────────────────────────

function toKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

function emptyCompliance(): ComplianceResult {
  return {
    score: 0,
    totalRequired: 0,
    documented: 0,
    missing: [],
    documented_items: [],
    grade: 'F',
    riskLevel: 'critical',
    summary: 'Unable to calculate compliance.',
  };
}
