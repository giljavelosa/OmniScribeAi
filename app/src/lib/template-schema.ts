/**
 * Template Structure Schema — zod validation for clinician-customizable note templates.
 *
 * Validates the `structureJson` field stored on NoteTemplate records.
 * Provides conversion utilities between TemplateStructure and the
 * FrameworkSection[] format used by the existing pipeline.
 */

import { z } from 'zod';
import { safeJsonKey } from './prompt-sanitizer';

// ─── ID/Key Regex (validated, never mutated) ──────────────────

/** Alphanumeric, hyphens, underscores only. Never sanitized/rewritten. */
const ID_REGEX = /^[a-zA-Z0-9_-]+$/;
const KEY_REGEX = /^[a-zA-Z0-9_]+$/;

// ─── Zod Schemas ──────────────────────────────────────────────

export const TemplateItemSchema = z.object({
  id: z.string().min(1).max(64).regex(ID_REGEX, 'ID must be alphanumeric/hyphens/underscores'),
  key: z.string().min(1).max(100).regex(KEY_REGEX, 'Key must be alphanumeric/underscores'),
  label: z.string().min(1).max(200),
  labelOverride: z.string().max(200).optional(),
  order: z.number().int().min(0).max(199),
  required: z.boolean().default(false),
  hidden: z.boolean().default(false),
  guidanceText: z.string().max(2000).optional(),
  styleHints: z.string().max(500).optional(),
});

export const TemplateSectionSchema = z.object({
  id: z.string().min(1).max(64).regex(ID_REGEX, 'ID must be alphanumeric/hyphens/underscores'),
  key: z.string().min(1).max(50).regex(KEY_REGEX, 'Key must be alphanumeric/underscores'),
  label: z.string().min(1).max(200),
  order: z.number().int().min(0).max(99),
  required: z.boolean(),
  hidden: z.boolean().default(false),
  items: z.array(TemplateItemSchema).min(0).max(100),
});

const VALID_FORMATS = ['SOAP', 'DAP', 'narrative', 'H&P', 'eval', 'custom'] as const;
const VALID_DISCIPLINES = ['medical', 'rehabilitation', 'behavioral_health'] as const;

export const TemplateStructureSchema = z.object({
  formatType: z.enum(VALID_FORMATS),
  discipline: z.enum(VALID_DISCIPLINES),
  sections: z.array(TemplateSectionSchema).min(1).max(30),
});

// ─── Derived Types ────────────────────────────────────────────

export type TemplateItem = z.infer<typeof TemplateItemSchema>;
export type TemplateSection = z.infer<typeof TemplateSectionSchema>;
export type TemplateStructure = z.infer<typeof TemplateStructureSchema>;

export type NoteFormat = (typeof VALID_FORMATS)[number];
export type Discipline = (typeof VALID_DISCIPLINES)[number];

// ─── Template Snapshot (frozen at generation time) ────────────

export interface TemplateSnapshot {
  templateId: string | null;     // null for system templates
  sourceFrameworkId: string | null;
  version: number;
  structure: TemplateStructure;
  resolvedAt: string;            // ISO 8601 timestamp
}

// ─── Deep Validation ──────────────────────────────────────────

export interface TemplateValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Deep validation beyond zod shape checks.
 *
 * Rules:
 * 1. All section IDs unique within template
 * 2. All item IDs unique globally within template
 * 3. Section keys unique (case-insensitive)
 * 4. Item keys unique within each section (case-insensitive)
 * 5. Section labels unique (case-insensitive)
 * 6. Item labels unique within each section (case-insensitive)
 * 7. Total items across all sections <= 200
 */
export function validateTemplateStructure(structure: TemplateStructure): TemplateValidationResult {
  const errors: string[] = [];

  // Rule 1: Unique section IDs
  const sectionIds = new Set<string>();
  for (const section of structure.sections) {
    if (sectionIds.has(section.id)) {
      errors.push(`Duplicate section ID: "${section.id}"`);
    }
    sectionIds.add(section.id);
  }

  // Rule 2: Unique item IDs globally
  const allItemIds = new Set<string>();
  for (const section of structure.sections) {
    for (const item of section.items) {
      if (allItemIds.has(item.id)) {
        errors.push(`Duplicate item ID: "${item.id}" in section "${section.label}"`);
      }
      allItemIds.add(item.id);
    }
  }

  // Rule 3: Unique section keys (case-insensitive)
  const sectionKeys = new Set<string>();
  for (const section of structure.sections) {
    const lower = section.key.toLowerCase();
    if (sectionKeys.has(lower)) {
      errors.push(`Duplicate section key: "${section.key}"`);
    }
    sectionKeys.add(lower);
  }

  // Rule 4: Unique item keys within each section (case-insensitive)
  for (const section of structure.sections) {
    const keys = new Set<string>();
    for (const item of section.items) {
      const lower = item.key.toLowerCase();
      if (keys.has(lower)) {
        errors.push(`Duplicate item key "${item.key}" in section "${section.label}"`);
      }
      keys.add(lower);
    }
  }

  // Rule 5: Unique section labels (case-insensitive)
  const sectionLabels = new Set<string>();
  for (const section of structure.sections) {
    const lower = section.label.toLowerCase();
    if (sectionLabels.has(lower)) {
      errors.push(`Duplicate section label: "${section.label}"`);
    }
    sectionLabels.add(lower);
  }

  // Rule 6: Unique item labels within each section (case-insensitive)
  for (const section of structure.sections) {
    const labels = new Set<string>();
    for (const item of section.items) {
      const lower = item.label.toLowerCase();
      if (labels.has(lower)) {
        errors.push(`Duplicate item label "${item.label}" in section "${section.label}"`);
      }
      labels.add(lower);
    }
  }

  // Rule 7: Total items <= 200
  const totalItems = structure.sections.reduce((sum, s) => sum + s.items.length, 0);
  if (totalItems > 200) {
    errors.push(`Total items (${totalItems}) exceeds maximum of 200`);
  }

  return { valid: errors.length === 0, errors };
}

// ─── Conversion: TemplateStructure → FrameworkSection[] ───────

/**
 * Convert a TemplateStructure to the FrameworkSection[] format
 * consumed by the existing pipeline (encounter-state, extract-chunk, etc.).
 *
 * - Filters out hidden sections and hidden items
 * - Sorts by order field
 * - Uses labelOverride when present, otherwise label
 */
export function templateStructureToFrameworkSections(
  structure: TemplateStructure,
): Array<{ id: string; title: string; items: string[]; required: boolean }> {
  return structure.sections
    .filter(s => !s.hidden)
    .sort((a, b) => a.order - b.order)
    .map(section => ({
      id: section.id,
      title: section.label,
      items: section.items
        .filter(item => !item.hidden)
        .sort((a, b) => a.order - b.order)
        .map(item => item.labelOverride || item.label),
      required: section.required,
    }));
}

// ─── Conversion: FrameworkSection[] → TemplateStructure ───────

/**
 * Convert a system Framework's sections to TemplateStructure format.
 * Used when cloning a built-in framework into a user template.
 *
 * Generates deterministic stable IDs for items since built-in frameworks
 * don't have item-level UUIDs. IDs are derived from sectionId + index.
 */
export function frameworkSectionsToTemplateStructure(
  sections: Array<{ id: string; title: string; items: string[]; required: boolean }>,
  formatType: NoteFormat,
  discipline: Discipline,
): TemplateStructure {
  return {
    formatType,
    discipline,
    sections: sections.map((section, sIdx) => ({
      id: section.id,
      key: safeJsonKey(section.title).substring(0, 50),
      label: section.title,
      order: sIdx,
      required: section.required,
      hidden: false,
      items: section.items.map((itemName, iIdx) => ({
        id: `${section.id}-item-${iIdx}`,
        key: safeJsonKey(itemName).substring(0, 100),
        label: itemName,
        order: iIdx,
        required: false,
        hidden: false,
      })),
    })),
  };
}

/**
 * Count total non-hidden items across all non-hidden sections.
 */
export function countTemplateItems(structure: TemplateStructure): number {
  return structure.sections
    .filter(s => !s.hidden)
    .reduce((sum, s) => sum + s.items.filter(i => !i.hidden).length, 0);
}
