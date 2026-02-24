import { prisma } from '../../src/lib/db';

export async function createTestPatient(identifier = 'TEST-PT-001') {
  return prisma.patient.create({
    data: {
      identifier,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1980-01-01'),
      gender: 'MALE',
      phone: '555-0100',
    },
  });
}

export async function cleanupTestData() {
  // Delete in FK-safe order
  await prisma.auditLog.deleteMany({});
  await prisma.visit.deleteMany({});
  await prisma.patientDocument.deleteMany({});
  await prisma.condition.deleteMany({});
  await prisma.medication.deleteMany({});
  await prisma.allergy.deleteMany({});
  await prisma.coverage.deleteMany({});
  await prisma.patient.deleteMany({});
}
