import { describe, it, expect } from 'vitest';
import {
  TemplateStructureSchema,
  validateTemplateStructure,
  templateStructureToFrameworkSections,
  frameworkSectionsToTemplateStructure,
  countTemplateItems,
  type TemplateStructure,
} from '../../src/lib/template-schema';

// ─── Helpers ──────────────────────────────────────────────

function validStructure(overrides?: Partial<TemplateStructure>): TemplateStructure {
  return {
    formatType: 'SOAP',
    discipline: 'medical',
    sections: [
      {
        id: 'section-subjective',
        key: 'subjective',
        label: 'Subjective',
        order: 0,
        required: true,
        hidden: false,
        items: [
          { id: 'item-cc', key: 'chief_complaint', label: 'Chief Complaint', order: 0, required: true, hidden: false },
          { id: 'item-hpi', key: 'hpi', label: 'History of Present Illness', order: 1, required: false, hidden: false },
        ],
      },
      {
        id: 'section-objective',
        key: 'objective',
        label: 'Objective',
        order: 1,
        required: true,
        hidden: false,
        items: [
          { id: 'item-vitals', key: 'vitals', label: 'Vital Signs', order: 0, required: false, hidden: false },
        ],
      },
    ],
    ...overrides,
  };
}

// ─── Zod Schema Tests ────────────────────────────────────

describe('template-schema', () => {
  describe('TemplateStructureSchema (zod)', () => {
    it('should accept a valid structure', () => {
      const result = TemplateStructureSchema.safeParse(validStructure());
      expect(result.success).toBe(true);
    });

    it('should reject empty sections array', () => {
      const result = TemplateStructureSchema.safeParse({
        formatType: 'SOAP',
        discipline: 'medical',
        sections: [],
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid formatType', () => {
      const result = TemplateStructureSchema.safeParse(validStructure({ formatType: 'INVALID' as never }));
      expect(result.success).toBe(false);
    });

    it('should reject invalid discipline', () => {
      const result = TemplateStructureSchema.safeParse(validStructure({ discipline: 'dentistry' as never }));
      expect(result.success).toBe(false);
    });

    it('should reject empty section ID', () => {
      const s = validStructure();
      s.sections[0].id = '';
      const result = TemplateStructureSchema.safeParse(s);
      expect(result.success).toBe(false);
    });

    it('should reject ID with special characters', () => {
      const s = validStructure();
      s.sections[0].id = 'section with spaces';
      const result = TemplateStructureSchema.safeParse(s);
      expect(result.success).toBe(false);
    });

    it('should reject key with hyphens', () => {
      const s = validStructure();
      s.sections[0].key = 'key-with-hyphens';
      const result = TemplateStructureSchema.safeParse(s);
      expect(result.success).toBe(false);
    });

    it('should allow ID with hyphens', () => {
      const s = validStructure();
      s.sections[0].id = 'section-with-hyphens';
      const result = TemplateStructureSchema.safeParse(s);
      expect(result.success).toBe(true);
    });

    it('should reject empty label', () => {
      const s = validStructure();
      s.sections[0].label = '';
      const result = TemplateStructureSchema.safeParse(s);
      expect(result.success).toBe(false);
    });

    it('should reject negative order', () => {
      const s = validStructure();
      s.sections[0].order = -1;
      const result = TemplateStructureSchema.safeParse(s);
      expect(result.success).toBe(false);
    });

    it('should reject item order > 199', () => {
      const s = validStructure();
      s.sections[0].items[0].order = 200;
      const result = TemplateStructureSchema.safeParse(s);
      expect(result.success).toBe(false);
    });

    it('should reject guidanceText over 2000 chars', () => {
      const s = validStructure();
      s.sections[0].items[0].guidanceText = 'a'.repeat(2001);
      const result = TemplateStructureSchema.safeParse(s);
      expect(result.success).toBe(false);
    });

    it('should accept guidanceText at 2000 chars', () => {
      const s = validStructure();
      s.sections[0].items[0].guidanceText = 'a'.repeat(2000);
      const result = TemplateStructureSchema.safeParse(s);
      expect(result.success).toBe(true);
    });

    it('should reject styleHints over 500 chars', () => {
      const s = validStructure();
      s.sections[0].items[0].styleHints = 'a'.repeat(501);
      const result = TemplateStructureSchema.safeParse(s);
      expect(result.success).toBe(false);
    });

    it('should accept all valid formatTypes', () => {
      for (const fmt of ['SOAP', 'DAP', 'narrative', 'H&P', 'eval', 'custom'] as const) {
        const result = TemplateStructureSchema.safeParse(validStructure({ formatType: fmt }));
        expect(result.success, `format ${fmt} should be valid`).toBe(true);
      }
    });

    it('should accept all valid disciplines', () => {
      for (const disc of ['medical', 'rehabilitation', 'behavioral_health'] as const) {
        const result = TemplateStructureSchema.safeParse(validStructure({ discipline: disc }));
        expect(result.success, `discipline ${disc} should be valid`).toBe(true);
      }
    });
  });

  // ─── Deep Validation Tests ────────────────────────────────

  describe('validateTemplateStructure (deep)', () => {
    it('should pass for a valid structure', () => {
      const result = validateTemplateStructure(validStructure());
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect duplicate section IDs', () => {
      const s = validStructure();
      s.sections[1].id = s.sections[0].id; // duplicate
      const result = validateTemplateStructure(s);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Duplicate section ID'))).toBe(true);
    });

    it('should detect duplicate item IDs globally', () => {
      const s = validStructure();
      s.sections[1].items[0].id = s.sections[0].items[0].id; // same ID across sections
      const result = validateTemplateStructure(s);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Duplicate item ID'))).toBe(true);
    });

    it('should detect duplicate section keys (case-insensitive)', () => {
      const s = validStructure();
      s.sections[1].key = s.sections[0].key.toUpperCase();
      const result = validateTemplateStructure(s);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Duplicate section key'))).toBe(true);
    });

    it('should detect duplicate item keys within section (case-insensitive)', () => {
      const s = validStructure();
      s.sections[0].items[1].key = s.sections[0].items[0].key.toUpperCase();
      const result = validateTemplateStructure(s);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Duplicate item key'))).toBe(true);
    });

    it('should detect duplicate section labels (case-insensitive)', () => {
      const s = validStructure();
      s.sections[1].label = s.sections[0].label.toLowerCase();
      const result = validateTemplateStructure(s);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Duplicate section label'))).toBe(true);
    });

    it('should detect duplicate item labels within section (case-insensitive)', () => {
      const s = validStructure();
      s.sections[0].items[1].label = s.sections[0].items[0].label.toLowerCase();
      const result = validateTemplateStructure(s);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Duplicate item label'))).toBe(true);
    });

    it('should reject total items exceeding 200', () => {
      const s = validStructure();
      // Create a section with 201 items
      s.sections = [{
        id: 'big-section',
        key: 'big',
        label: 'Big Section',
        order: 0,
        required: true,
        hidden: false,
        items: Array.from({ length: 100 }, (_, i) => ({
          id: `item-${i}`,
          key: `item_${i}`,
          label: `Item ${i}`,
          order: i,
          required: false,
          hidden: false,
        })),
      }, {
        id: 'big-section-2',
        key: 'big2',
        label: 'Big Section 2',
        order: 1,
        required: true,
        hidden: false,
        items: Array.from({ length: 100 }, (_, i) => ({
          id: `item-b-${i}`,
          key: `item_b_${i}`,
          label: `Item B ${i}`,
          order: i,
          required: false,
          hidden: false,
        })),
      }, {
        id: 'overflow-section',
        key: 'overflow',
        label: 'Overflow',
        order: 2,
        required: false,
        hidden: false,
        items: [{ id: 'overflow-item', key: 'overflow_item', label: 'Overflow Item', order: 0, required: false, hidden: false }],
      }];
      const result = validateTemplateStructure(s);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('exceeds maximum of 200'))).toBe(true);
    });

    it('should allow exactly 200 items', () => {
      const s = validStructure();
      s.sections = [{
        id: 'section-a',
        key: 'section_a',
        label: 'Section A',
        order: 0,
        required: true,
        hidden: false,
        items: Array.from({ length: 100 }, (_, i) => ({
          id: `a-item-${i}`,
          key: `a_item_${i}`,
          label: `A Item ${i}`,
          order: i,
          required: false,
          hidden: false,
        })),
      }, {
        id: 'section-b',
        key: 'section_b',
        label: 'Section B',
        order: 1,
        required: true,
        hidden: false,
        items: Array.from({ length: 100 }, (_, i) => ({
          id: `b-item-${i}`,
          key: `b_item_${i}`,
          label: `B Item ${i}`,
          order: i,
          required: false,
          hidden: false,
        })),
      }];
      const result = validateTemplateStructure(s);
      expect(result.valid).toBe(true);
    });
  });

  // ─── Conversion: TemplateStructure → FrameworkSections ────

  describe('templateStructureToFrameworkSections', () => {
    it('should convert basic structure to framework sections', () => {
      const result = templateStructureToFrameworkSections(validStructure());
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Subjective');
      expect(result[0].items).toEqual(['Chief Complaint', 'History of Present Illness']);
      expect(result[0].required).toBe(true);
      expect(result[1].title).toBe('Objective');
    });

    it('should filter out hidden sections', () => {
      const s = validStructure();
      s.sections[1].hidden = true;
      const result = templateStructureToFrameworkSections(s);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Subjective');
    });

    it('should filter out hidden items', () => {
      const s = validStructure();
      s.sections[0].items[1].hidden = true;
      const result = templateStructureToFrameworkSections(s);
      expect(result[0].items).toEqual(['Chief Complaint']);
    });

    it('should sort sections by order', () => {
      const s = validStructure();
      s.sections[0].order = 5;
      s.sections[1].order = 1;
      const result = templateStructureToFrameworkSections(s);
      expect(result[0].title).toBe('Objective');
      expect(result[1].title).toBe('Subjective');
    });

    it('should sort items by order', () => {
      const s = validStructure();
      s.sections[0].items[0].order = 10;
      s.sections[0].items[1].order = 0;
      const result = templateStructureToFrameworkSections(s);
      expect(result[0].items[0]).toBe('History of Present Illness');
      expect(result[0].items[1]).toBe('Chief Complaint');
    });

    it('should use labelOverride when present', () => {
      const s = validStructure();
      s.sections[0].items[0].labelOverride = 'CC';
      const result = templateStructureToFrameworkSections(s);
      expect(result[0].items[0]).toBe('CC');
    });
  });

  // ─── Conversion: FrameworkSections → TemplateStructure ────

  describe('frameworkSectionsToTemplateStructure', () => {
    it('should convert framework sections to valid template structure', () => {
      const sections = [
        { id: 'subjective', title: 'Subjective', items: ['Chief Complaint', 'HPI'], required: true },
        { id: 'objective', title: 'Objective', items: ['Vitals', 'Exam'], required: true },
      ];
      const result = frameworkSectionsToTemplateStructure(sections, 'SOAP', 'medical');

      expect(result.formatType).toBe('SOAP');
      expect(result.discipline).toBe('medical');
      expect(result.sections).toHaveLength(2);
      expect(result.sections[0].id).toBe('subjective');
      expect(result.sections[0].items).toHaveLength(2);
      expect(result.sections[0].items[0].id).toBe('subjective-item-0');
    });

    it('should produce a structure that passes zod + deep validation', () => {
      const sections = [
        { id: 'assessment', title: 'Assessment', items: ['Diagnosis', 'Prognosis'], required: true },
        { id: 'plan', title: 'Plan', items: ['Treatment', 'Follow-up'], required: false },
      ];
      const structure = frameworkSectionsToTemplateStructure(sections, 'SOAP', 'rehabilitation');
      const zodResult = TemplateStructureSchema.safeParse(structure);
      expect(zodResult.success).toBe(true);

      const deepResult = validateTemplateStructure(structure);
      expect(deepResult.valid).toBe(true);
    });

    it('should round-trip preserve section/item counts', () => {
      const sections = [
        { id: 'sec-a', title: 'Section A', items: ['Item 1', 'Item 2', 'Item 3'], required: true },
        { id: 'sec-b', title: 'Section B', items: ['Item 4'], required: false },
      ];
      const structure = frameworkSectionsToTemplateStructure(sections, 'custom', 'medical');
      const roundTripped = templateStructureToFrameworkSections(structure);

      expect(roundTripped).toHaveLength(2);
      expect(roundTripped[0].items).toHaveLength(3);
      expect(roundTripped[1].items).toHaveLength(1);
    });
  });

  // ─── countTemplateItems ──────────────────────────────────

  describe('countTemplateItems', () => {
    it('should count non-hidden items in non-hidden sections', () => {
      expect(countTemplateItems(validStructure())).toBe(3);
    });

    it('should exclude hidden items', () => {
      const s = validStructure();
      s.sections[0].items[0].hidden = true;
      expect(countTemplateItems(s)).toBe(2);
    });

    it('should exclude items in hidden sections', () => {
      const s = validStructure();
      s.sections[0].hidden = true;
      expect(countTemplateItems(s)).toBe(1);
    });
  });
});
