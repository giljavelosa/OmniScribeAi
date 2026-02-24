import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { prisma } from '../../src/lib/db';
import { createTestUser, cleanupTestUsers } from '../helpers/auth';
import { createTestPatient, cleanupTestData } from '../helpers/db';

describe('Visits Integration Tests', () => {
  const testEmail = 'test-visits@omniscribe.test';
  let userId: string;
  let patientId: string;

  beforeEach(async () => {
    const { user } = await createTestUser({ email: testEmail, password: 'TestPassword123!' });
    userId = user.id;
    const patient = await createTestPatient('TEST-PT-VISIT-001');
    patientId = patient.id;
  });

  afterEach(async () => {
    await cleanupTestData();
    await cleanupTestUsers([testEmail]);
  });

  it('should create a visit with required fields', async () => {
    const visit = await prisma.visit.create({
      data: {
        patientId,
        userId,
        frameworkId: 'soap-md-general',
        domain: 'medical',
        status: 'RECORDING',
      },
    });

    expect(visit.id).toBeTruthy();
    expect(visit.frameworkId).toBe('soap-md-general');
    expect(visit.status).toBe('RECORDING');
  });

  it('should update visit status through lifecycle', async () => {
    const visit = await prisma.visit.create({
      data: { patientId, userId, frameworkId: 'soap-md-general', domain: 'medical', status: 'RECORDING' },
    });

    for (const status of ['TRANSCRIBING', 'GENERATING', 'COMPLETE'] as const) {
      const updated = await prisma.visit.update({ where: { id: visit.id }, data: { status } });
      expect(updated.status).toBe(status);
    }
  });

  it('should finalize a visit', async () => {
    const visit = await prisma.visit.create({
      data: { patientId, userId, frameworkId: 'soap-md-general', domain: 'medical', status: 'COMPLETE', transcript: 'Test transcript' },
    });

    const finalized = await prisma.visit.update({
      where: { id: visit.id },
      data: { status: 'FINALIZED', finalizedAt: new Date(), finalizedBy: userId },
    });

    expect(finalized.status).toBe('FINALIZED');
    expect(finalized.finalizedAt).toBeTruthy();
    expect(finalized.finalizedBy).toBe(userId);
  });

  it('should store and retrieve JSON noteData', async () => {
    const noteData = {
      sections: [
        { id: 'subjective', title: 'Subjective', content: 'Patient reports knee pain...' },
        { id: 'objective', title: 'Objective', content: 'VS: BP 120/80, HR 72...' },
      ],
    };

    const visit = await prisma.visit.create({
      data: { patientId, userId, frameworkId: 'soap-md-general', domain: 'medical', noteData },
    });

    const fetched = await prisma.visit.findUnique({ where: { id: visit.id } });
    expect(fetched!.noteData).toEqual(noteData);
  });

  it('should list visits for a patient ordered by date', async () => {
    await prisma.visit.createMany({
      data: [
        { patientId, userId, frameworkId: 'soap-md-general', domain: 'medical', date: new Date('2026-02-01') },
        { patientId, userId, frameworkId: 'soap-md-general', domain: 'medical', date: new Date('2026-02-15') },
      ],
    });

    const visits = await prisma.visit.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
    });

    expect(visits).toHaveLength(2);
    expect(visits[0].date!.getTime()).toBeGreaterThan(visits[1].date!.getTime());
  });

  it('should include patient and user relations', async () => {
    const visit = await prisma.visit.create({
      data: { patientId, userId, frameworkId: 'soap-md-general', domain: 'medical' },
    });

    const withRelations = await prisma.visit.findUnique({
      where: { id: visit.id },
      include: {
        patient: { select: { identifier: true, firstName: true, lastName: true } },
        user: { select: { name: true, clinicianType: true } },
      },
    });

    expect(withRelations!.patient.identifier).toBe('TEST-PT-VISIT-001');
    expect(withRelations!.user.name).toContain('Test User');
  });
});
