import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { prisma } from '../../src/lib/db';
import { createTestUser, cleanupTestUsers } from '../helpers/auth';
import { createTestPatient, cleanupTestData } from '../helpers/db';

describe('Patients Integration Tests', () => {
  const testEmail = 'test-patients@omniscribe.test';

  beforeEach(async () => {
    await createTestUser({ email: testEmail, password: 'TestPassword123!' });
  });

  afterEach(async () => {
    await cleanupTestData();
    await cleanupTestUsers([testEmail]);
  });

  it('should create a patient with required identifier', async () => {
    const patient = await prisma.patient.create({
      data: {
        identifier: 'TEST-PT-001',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'FEMALE',
      },
    });

    expect(patient.id).toBeTruthy();
    expect(patient.identifier).toBe('TEST-PT-001');
    expect(patient.firstName).toBe('Jane');
    expect(patient.lastName).toBe('Smith');
  });

  it('should search patients by identifier', async () => {
    await createTestPatient('TEST-PT-SEARCH-001');
    await createTestPatient('TEST-PT-SEARCH-002');
    await createTestPatient('TEST-PT-OTHER-003');

    const results = await prisma.patient.findMany({
      where: { identifier: { contains: 'SEARCH', mode: 'insensitive' } },
    });

    expect(results).toHaveLength(2);
  });

  it('should search patients by name', async () => {
    await prisma.patient.create({
      data: { identifier: 'TEST-PT-NAME-001', firstName: 'Alice', lastName: 'Johnson' },
    });

    const results = await prisma.patient.findMany({
      where: {
        OR: [
          { firstName: { contains: 'alice', mode: 'insensitive' } },
          { lastName: { contains: 'alice', mode: 'insensitive' } },
        ],
      },
    });

    expect(results).toHaveLength(1);
    expect(results[0].firstName).toBe('Alice');
  });

  it('should update patient information', async () => {
    const patient = await createTestPatient('TEST-PT-UPDATE-001');

    const updated = await prisma.patient.update({
      where: { id: patient.id },
      data: { phone: '555-9999', email: 'newemail@example.com' },
    });

    expect(updated.phone).toBe('555-9999');
    expect(updated.email).toBe('newemail@example.com');
  });

  it('should include relations (coverages, visit count)', async () => {
    const patient = await createTestPatient('TEST-PT-REL-001');

    await prisma.coverage.create({
      data: {
        patientId: patient.id,
        rank: 1,
        payerName: 'Blue Cross',
        memberId: '12345',
        isActive: true,
      },
    });

    const fetched = await prisma.patient.findUnique({
      where: { id: patient.id },
      include: {
        coverages: { where: { isActive: true } },
        _count: { select: { visits: true } },
      },
    });

    expect(fetched!.coverages).toHaveLength(1);
    expect(fetched!.coverages[0].payerName).toBe('Blue Cross');
    expect(fetched!._count.visits).toBe(0);
  });

  it('should handle FHIR-aligned optional fields', async () => {
    const patient = await prisma.patient.create({
      data: { identifier: 'TEST-PT-FHIR-001' },
    });

    expect(patient.firstName).toBeNull();
    expect(patient.dateOfBirth).toBeNull();
    expect(patient.gender).toBeNull();
    expect(patient.phone).toBeNull();
    expect(patient.addressLine1).toBeNull();
  });
});
