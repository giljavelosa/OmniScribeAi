import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { prisma } from '../../src/lib/db';
import { createTestUser, cleanupTestUsers } from '../helpers/auth';
import { cleanupTestData } from '../helpers/db';
import { frameworks } from '../../src/lib/frameworks';
import {
  TemplateStructureSchema,
  validateTemplateStructure,
  frameworkSectionsToTemplateStructure,
  countTemplateItems,
} from '../../src/lib/template-schema';

describe('Templates Integration Tests', () => {
  const testEmail = 'test-templates@omniscribe.test';
  const testEmail2 = 'test-templates-2@omniscribe.test';
  let userId: string;
  let userId2: string;

  beforeEach(async () => {
    const { user } = await createTestUser({ email: testEmail, password: 'TestPassword123!' });
    userId = user.id;
    const { user: user2 } = await createTestUser({ email: testEmail2, password: 'TestPassword123!' });
    userId2 = user2.id;
  });

  afterEach(async () => {
    await prisma.noteTemplate.deleteMany({});
    await cleanupTestData();
    await cleanupTestUsers([testEmail, testEmail2]);
  });

  // ─── CRUD Lifecycle ─────────────────────────────────────

  describe('CRUD lifecycle', () => {
    it('should create a user template with valid structure', async () => {
      const structure = frameworkSectionsToTemplateStructure(
        [{ id: 'subjective', title: 'Subjective', items: ['Chief Complaint', 'HPI'], required: true }],
        'SOAP',
        'medical',
      );

      const template = await prisma.noteTemplate.create({
        data: {
          name: 'Test SOAP Template',
          description: 'A test template',
          domain: 'medical',
          noteFormat: 'SOAP',
          subtype: 'General',
          sourceType: 'user',
          visibility: 'private',
          ownerUserId: userId,
          structureJson: structure,
          itemCount: countTemplateItems(structure),
        },
      });

      expect(template.id).toBeTruthy();
      expect(template.name).toBe('Test SOAP Template');
      expect(template.version).toBe(1);
      expect(template.isArchived).toBe(false);
      expect(template.visibility).toBe('private');
    });

    it('should retrieve a created template with structureJson', async () => {
      const structure = frameworkSectionsToTemplateStructure(
        [{ id: 'assessment', title: 'Assessment', items: ['Diagnosis'], required: true }],
        'SOAP',
        'medical',
      );

      const created = await prisma.noteTemplate.create({
        data: {
          name: 'Fetch Test Template',
          domain: 'medical',
          noteFormat: 'SOAP',
          sourceType: 'user',
          visibility: 'private',
          ownerUserId: userId,
          structureJson: structure,
          itemCount: countTemplateItems(structure),
        },
      });

      const fetched = await prisma.noteTemplate.findUnique({ where: { id: created.id } });
      expect(fetched).not.toBeNull();
      expect(fetched!.name).toBe('Fetch Test Template');

      // Validate the stored structureJson can be parsed back
      const parseResult = TemplateStructureSchema.safeParse(fetched!.structureJson);
      expect(parseResult.success).toBe(true);
    });

    it('should update template and increment version on structure change', async () => {
      const structure = frameworkSectionsToTemplateStructure(
        [{ id: 'plan', title: 'Plan', items: ['Treatment'], required: true }],
        'SOAP',
        'medical',
      );

      const template = await prisma.noteTemplate.create({
        data: {
          name: 'Version Test',
          domain: 'medical',
          noteFormat: 'SOAP',
          sourceType: 'user',
          visibility: 'private',
          ownerUserId: userId,
          structureJson: structure,
          itemCount: 1,
        },
      });

      expect(template.version).toBe(1);

      // Update structure
      const newStructure = frameworkSectionsToTemplateStructure(
        [
          { id: 'plan', title: 'Plan', items: ['Treatment', 'Follow-up'], required: true },
        ],
        'SOAP',
        'medical',
      );

      const updated = await prisma.noteTemplate.update({
        where: { id: template.id },
        data: {
          structureJson: newStructure,
          itemCount: countTemplateItems(newStructure),
          version: template.version + 1,
        },
      });

      expect(updated.version).toBe(2);
      expect(updated.itemCount).toBe(2);
    });

    it('should archive and unarchive a template', async () => {
      const structure = frameworkSectionsToTemplateStructure(
        [{ id: 'sec', title: 'Section', items: ['Item'], required: true }],
        'custom',
        'medical',
      );

      const template = await prisma.noteTemplate.create({
        data: {
          name: 'Archive Test',
          domain: 'medical',
          noteFormat: 'custom',
          sourceType: 'user',
          visibility: 'private',
          ownerUserId: userId,
          structureJson: structure,
          itemCount: 1,
        },
      });

      expect(template.isArchived).toBe(false);

      const archived = await prisma.noteTemplate.update({
        where: { id: template.id },
        data: { isArchived: true },
      });
      expect(archived.isArchived).toBe(true);

      const unarchived = await prisma.noteTemplate.update({
        where: { id: template.id },
        data: { isArchived: false },
      });
      expect(unarchived.isArchived).toBe(false);
    });
  });

  // ─── Clone ──────────────────────────────────────────────

  describe('clone behavior', () => {
    it('should clone a user template with new owner', async () => {
      const structure = frameworkSectionsToTemplateStructure(
        [{ id: 'sec', title: 'Section', items: ['Item'], required: true }],
        'SOAP',
        'medical',
      );

      const original = await prisma.noteTemplate.create({
        data: {
          name: 'Original Template',
          domain: 'medical',
          noteFormat: 'SOAP',
          sourceType: 'user',
          visibility: 'private',
          ownerUserId: userId,
          structureJson: structure,
          itemCount: 1,
        },
      });

      const clone = await prisma.noteTemplate.create({
        data: {
          name: `Copy of ${original.name}`,
          description: original.description,
          domain: original.domain,
          noteFormat: original.noteFormat,
          subtype: original.subtype,
          sourceType: 'user',
          sourceFrameworkId: original.sourceFrameworkId,
          visibility: 'private',
          ownerUserId: userId2,
          structureJson: original.structureJson!,
          itemCount: original.itemCount,
        },
      });

      expect(clone.id).not.toBe(original.id);
      expect(clone.ownerUserId).toBe(userId2);
      expect(clone.visibility).toBe('private');
      expect(clone.name).toBe('Copy of Original Template');
      expect(clone.version).toBe(1);
    });
  });

  // ─── System Template Structure Validation ───────────────

  describe('system framework conversion', () => {
    it('should convert all system frameworks to valid template structures', () => {
      for (const fw of frameworks) {
        const formatType = inferFormatType(fw.type);
        const discipline = fw.domain as 'medical' | 'rehabilitation' | 'behavioral_health';
        const structure = frameworkSectionsToTemplateStructure(fw.sections, formatType, discipline);

        const zodResult = TemplateStructureSchema.safeParse(structure);
        expect(zodResult.success, `Framework ${fw.id} should produce valid structure: ${!zodResult.success ? JSON.stringify((zodResult as { error: { issues: unknown[] } }).error.issues.slice(0, 2)) : ''}`).toBe(true);

        if (zodResult.success) {
          const deepResult = validateTemplateStructure(zodResult.data);
          expect(deepResult.valid, `Framework ${fw.id} deep validation: ${deepResult.errors.join('; ')}`).toBe(true);
        }
      }
    });
  });

  // ─── Visit + Template Integration ───────────────────────

  describe('visit-template relationship', () => {
    it('should create a visit with templateId', async () => {
      const structure = frameworkSectionsToTemplateStructure(
        [{ id: 'sec', title: 'Section', items: ['Item'], required: true }],
        'SOAP',
        'rehabilitation',
      );

      const template = await prisma.noteTemplate.create({
        data: {
          name: 'Visit Test Template',
          domain: 'rehabilitation',
          noteFormat: 'SOAP',
          sourceType: 'user',
          sourceFrameworkId: 'rehab-pt-eval',
          visibility: 'private',
          ownerUserId: userId,
          structureJson: structure,
          itemCount: 1,
        },
      });

      const patient = await prisma.patient.create({
        data: {
          identifier: 'TMPL-PT-001',
          firstName: 'Jane',
          lastName: 'Doe',
          dateOfBirth: new Date('1990-01-01'),
          gender: 'FEMALE',
        },
      });

      const visit = await prisma.visit.create({
        data: {
          patientId: patient.id,
          userId,
          frameworkId: 'rehab-pt-eval',
          domain: 'rehabilitation',
          status: 'RECORDING',
          templateId: template.id,
        },
      });

      expect(visit.templateId).toBe(template.id);
      expect(visit.frameworkId).toBe('rehab-pt-eval');

      // Query with template relation
      const visitWithTemplate = await prisma.visit.findUnique({
        where: { id: visit.id },
        include: { template: true },
      });
      expect(visitWithTemplate!.template!.id).toBe(template.id);
      expect(visitWithTemplate!.template!.name).toBe('Visit Test Template');
    });

    it('should store and retrieve templateSnapshotJson', async () => {
      const structure = frameworkSectionsToTemplateStructure(
        [{ id: 'sec', title: 'Section', items: ['Item'], required: true }],
        'SOAP',
        'medical',
      );

      const patient = await prisma.patient.create({
        data: {
          identifier: 'TMPL-PT-002',
          firstName: 'Bob',
          lastName: 'Smith',
          dateOfBirth: new Date('1985-06-15'),
          gender: 'MALE',
        },
      });

      const snapshot = {
        templateId: 'cltest123',
        sourceFrameworkId: 'med-soap-followup',
        version: 2,
        structure,
        resolvedAt: new Date().toISOString(),
      };

      const visit = await prisma.visit.create({
        data: {
          patientId: patient.id,
          userId,
          frameworkId: 'med-soap-followup',
          domain: 'medical',
          status: 'COMPLETE',
          templateSnapshotJson: JSON.parse(JSON.stringify(snapshot)),
        },
      });

      const fetched = await prisma.visit.findUnique({ where: { id: visit.id } });
      expect(fetched!.templateSnapshotJson).not.toBeNull();
      const stored = fetched!.templateSnapshotJson as Record<string, unknown>;
      expect(stored.templateId).toBe('cltest123');
      expect(stored.version).toBe(2);
    });

    it('should allow visit with frameworkId=custom and templateId', async () => {
      const structure = frameworkSectionsToTemplateStructure(
        [{ id: 'sec', title: 'Section', items: ['Item'], required: true }],
        'custom',
        'medical',
      );

      const template = await prisma.noteTemplate.create({
        data: {
          name: 'Fully Custom Template',
          domain: 'medical',
          noteFormat: 'custom',
          sourceType: 'user',
          visibility: 'private',
          ownerUserId: userId,
          structureJson: structure,
          itemCount: 1,
        },
      });

      const patient = await prisma.patient.create({
        data: {
          identifier: 'TMPL-PT-003',
          firstName: 'Custom',
          lastName: 'Patient',
          dateOfBirth: new Date('1975-03-20'),
          gender: 'OTHER',
        },
      });

      const visit = await prisma.visit.create({
        data: {
          patientId: patient.id,
          userId,
          frameworkId: 'custom',
          domain: 'medical',
          status: 'RECORDING',
          templateId: template.id,
        },
      });

      expect(visit.frameworkId).toBe('custom');
      expect(visit.templateId).toBe(template.id);

      // Verify the visit can be fetched without errors
      const fetched = await prisma.visit.findUnique({ where: { id: visit.id } });
      expect(fetched!.frameworkId).toBe('custom');
    });

    it('existing visits without templateId should still work', async () => {
      const patient = await prisma.patient.create({
        data: {
          identifier: 'TMPL-PT-004',
          firstName: 'Legacy',
          lastName: 'Patient',
          dateOfBirth: new Date('1960-12-25'),
          gender: 'MALE',
        },
      });

      const visit = await prisma.visit.create({
        data: {
          patientId: patient.id,
          userId,
          frameworkId: 'med-soap-followup',
          domain: 'medical',
          status: 'COMPLETE',
        },
      });

      expect(visit.templateId).toBeNull();
      expect(visit.templateSnapshotJson).toBeNull();
      expect(visit.frameworkId).toBe('med-soap-followup');
    });
  });

  // ─── Visibility Model ──────────────────────────────────

  describe('visibility model', () => {
    it('should default to private visibility', async () => {
      const structure = frameworkSectionsToTemplateStructure(
        [{ id: 'sec', title: 'Section', items: ['Item'], required: true }],
        'SOAP',
        'medical',
      );

      const template = await prisma.noteTemplate.create({
        data: {
          name: 'Default Visibility',
          domain: 'medical',
          noteFormat: 'SOAP',
          sourceType: 'user',
          ownerUserId: userId,
          structureJson: structure,
          itemCount: 1,
        },
      });

      expect(template.visibility).toBe('private');
    });

    it('should store organization visibility', async () => {
      const structure = frameworkSectionsToTemplateStructure(
        [{ id: 'sec', title: 'Section', items: ['Item'], required: true }],
        'SOAP',
        'medical',
      );

      const template = await prisma.noteTemplate.create({
        data: {
          name: 'Org Template',
          domain: 'medical',
          noteFormat: 'SOAP',
          sourceType: 'user',
          visibility: 'organization',
          ownerUserId: userId,
          structureJson: structure,
          itemCount: 1,
        },
      });

      expect(template.visibility).toBe('organization');
    });
  });
});

// ─── Helper ──────────────────────────────────────────────

function inferFormatType(frameworkType: string): 'SOAP' | 'DAP' | 'narrative' | 'H&P' | 'eval' | 'custom' {
  const lower = frameworkType.toLowerCase();
  if (lower.includes('soap')) return 'SOAP';
  if (lower.includes('dap')) return 'DAP';
  if (lower.includes('h&p') || lower.includes('history')) return 'H&P';
  if (lower.includes('evaluation') || lower.includes('eval') || lower.includes('intake')) return 'eval';
  if (lower.includes('narrative') || lower.includes('discharge') || lower.includes('progress')) return 'narrative';
  return 'custom';
}
