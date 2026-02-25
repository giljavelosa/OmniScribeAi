import { describe, it, expect, vi, beforeEach } from 'vitest';
import { frameworks } from '../../src/lib/frameworks';
import { effectiveFrameworkId, buildSnapshot } from '../../src/lib/template-resolver';
import type { ResolvedTemplate } from '../../src/lib/template-resolver';
import { frameworkSectionsToTemplateStructure } from '../../src/lib/template-schema';

// ─── Helpers ──────────────────────────────────────────────

function makeResolvedSystem(frameworkId: string): ResolvedTemplate {
  const fw = frameworks.find(f => f.id === frameworkId)!;
  const structure = frameworkSectionsToTemplateStructure(
    fw.sections, 'SOAP', fw.domain as 'medical' | 'rehabilitation' | 'behavioral_health',
  );
  return {
    id: fw.id,
    name: fw.name,
    domain: fw.domain,
    type: fw.type,
    subtype: fw.subtype,
    structure,
    frameworkSections: fw.sections,
    sourceType: 'system',
    sourceFrameworkId: fw.id,
    visibility: null,
    itemCount: fw.itemCount,
    version: 1,
  };
}

function makeResolvedUser(overrides?: Partial<ResolvedTemplate>): ResolvedTemplate {
  return {
    id: 'cltest123abc',
    name: 'My Custom Template',
    domain: 'rehabilitation',
    type: 'SOAP',
    subtype: 'Follow-up',
    structure: {
      formatType: 'SOAP',
      discipline: 'rehabilitation',
      sections: [{
        id: 'sec-s',
        key: 'subjective',
        label: 'Subjective',
        order: 0,
        required: true,
        hidden: false,
        items: [{
          id: 'item-cc',
          key: 'chief_complaint',
          label: 'Chief Complaint',
          order: 0,
          required: true,
          hidden: false,
        }],
      }],
    },
    frameworkSections: [{ id: 'sec-s', title: 'Subjective', items: ['Chief Complaint'], required: true }],
    sourceType: 'user',
    sourceFrameworkId: 'rehab-pt-eval',
    visibility: 'private',
    itemCount: 1,
    version: 3,
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────

describe('template-resolver utilities', () => {

  describe('effectiveFrameworkId', () => {
    it('should return framework ID for system templates', () => {
      const resolved = makeResolvedSystem('med-soap-followup');
      expect(effectiveFrameworkId(resolved)).toBe('med-soap-followup');
    });

    it('should return sourceFrameworkId for cloned user templates', () => {
      const resolved = makeResolvedUser({ sourceFrameworkId: 'rehab-pt-eval' });
      expect(effectiveFrameworkId(resolved)).toBe('rehab-pt-eval');
    });

    it('should return "custom" for user templates without sourceFrameworkId', () => {
      const resolved = makeResolvedUser({ sourceFrameworkId: null });
      expect(effectiveFrameworkId(resolved)).toBe('custom');
    });
  });

  describe('buildSnapshot', () => {
    it('should build snapshot for system template', () => {
      const resolved = makeResolvedSystem('med-soap-followup');
      const snapshot = buildSnapshot(resolved);

      expect(snapshot.templateId).toBeNull();
      expect(snapshot.sourceFrameworkId).toBe('med-soap-followup');
      expect(snapshot.version).toBe(1);
      expect(snapshot.structure).toBe(resolved.structure);
      expect(snapshot.resolvedAt).toBeTruthy();
      expect(new Date(snapshot.resolvedAt).getTime()).not.toBeNaN();
    });

    it('should build snapshot for user template', () => {
      const resolved = makeResolvedUser();
      const snapshot = buildSnapshot(resolved);

      expect(snapshot.templateId).toBe('cltest123abc');
      expect(snapshot.sourceFrameworkId).toBe('rehab-pt-eval');
      expect(snapshot.version).toBe(3);
    });

    it('should include ISO timestamp', () => {
      const before = new Date().toISOString();
      const snapshot = buildSnapshot(makeResolvedUser());
      const after = new Date().toISOString();

      expect(snapshot.resolvedAt >= before).toBe(true);
      expect(snapshot.resolvedAt <= after).toBe(true);
    });
  });

  describe('system framework coverage', () => {
    it('should have at least one system framework available', () => {
      expect(frameworks.length).toBeGreaterThan(0);
    });

    it('all system frameworks should have unique IDs', () => {
      const ids = frameworks.map(f => f.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('system frameworks should have non-empty sections', () => {
      for (const fw of frameworks) {
        expect(fw.sections.length, `${fw.id} should have sections`).toBeGreaterThan(0);
      }
    });
  });
});
