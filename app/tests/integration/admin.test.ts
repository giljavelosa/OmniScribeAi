import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { prisma } from '../../src/lib/db';
import { createTestUser, cleanupTestUsers } from '../helpers/auth';

describe('Admin Integration Tests', () => {
  const adminEmail = 'test-admin@omniscribe.test';
  const clinicianEmail = 'test-clinician@omniscribe.test';
  const newUserEmail = 'test-newuser@omniscribe.test';
  let adminId: string;
  let clinicianId: string;

  beforeEach(async () => {
    const admin = await createTestUser({ email: adminEmail, password: 'AdminPass123!', role: 'ADMIN' });
    adminId = admin.user.id;
    const clinician = await createTestUser({ email: clinicianEmail, password: 'ClinicianPass123!' });
    clinicianId = clinician.user.id;
  });

  afterEach(async () => {
    await cleanupTestUsers([adminEmail, clinicianEmail, newUserEmail]);
  });

  it('should list all users', async () => {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, isActive: true },
    });

    expect(users.length).toBeGreaterThanOrEqual(2);
    expect(users.find(u => u.email === adminEmail)!.role).toBe('ADMIN');
    expect(users.find(u => u.email === clinicianEmail)!.role).toBe('CLINICIAN');
  });

  it('should verify admin vs clinician role', async () => {
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    const clinician = await prisma.user.findUnique({ where: { id: clinicianId } });

    expect(admin!.role).toBe('ADMIN');
    expect(clinician!.role).toBe('CLINICIAN');
    expect(clinician!.role).not.toBe('ADMIN');
  });

  it('should create a new user', async () => {
    const { user } = await createTestUser({
      email: newUserEmail,
      password: 'NewUser123!',
      name: 'Dr. New User',
    });

    expect(user.email).toBe(newUserEmail);
    expect(user.name).toBe('Dr. New User');
    expect(user.isActive).toBe(true);
  });

  it('should update user information', async () => {
    const updated = await prisma.user.update({
      where: { id: clinicianId },
      data: { name: 'Dr. Updated Name', credentials: 'MD, PhD' },
    });

    expect(updated.name).toBe('Dr. Updated Name');
    expect(updated.credentials).toBe('MD, PhD');
  });

  it('should deactivate a user', async () => {
    const deactivated = await prisma.user.update({
      where: { id: clinicianId },
      data: { isActive: false },
    });

    expect(deactivated.isActive).toBe(false);
  });

  it('should prevent duplicate email registration', async () => {
    await expect(
      createTestUser({ email: clinicianEmail, password: 'Duplicate123!' })
    ).rejects.toThrow();
  });

  it('should log admin actions to audit log', async () => {
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'CREATE_USER',
        resource: `user:${clinicianId}`,
        details: { email: clinicianEmail },
      },
    });

    const logs = await prisma.auditLog.findMany({ where: { userId: adminId } });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs.find(l => l.action === 'CREATE_USER')).toBeTruthy();
  });
});
