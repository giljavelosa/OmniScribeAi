import { describe, it, expect, afterEach } from 'vitest';
import { prisma } from '../../src/lib/db';
import bcrypt from 'bcryptjs';
import { createTestUser, cleanupTestUsers } from '../helpers/auth';

describe('Auth Integration Tests', () => {
  const testEmail = 'test-auth@omniscribe.test';

  afterEach(async () => {
    await cleanupTestUsers([testEmail]);
  });

  it('should verify correct password with bcrypt', async () => {
    await createTestUser({ email: testEmail, password: 'CorrectPassword123!' });

    const user = await prisma.user.findUnique({ where: { email: testEmail } });
    expect(user).toBeTruthy();

    const valid = await bcrypt.compare('CorrectPassword123!', user!.passwordHash);
    expect(valid).toBe(true);
  });

  it('should reject incorrect password', async () => {
    await createTestUser({ email: testEmail, password: 'CorrectPassword123!' });

    const user = await prisma.user.findUnique({ where: { email: testEmail } });
    const valid = await bcrypt.compare('WrongPassword', user!.passwordHash);
    expect(valid).toBe(false);
  });

  it('should enforce mustChangePassword flag on seeded users', async () => {
    const admin = await prisma.user.findUnique({ where: { email: 'admin@omniscribe.ai' } });
    expect(admin).toBeTruthy();
    expect(admin!.mustChangePassword).toBe(true);

    const demo = await prisma.user.findUnique({ where: { email: 'demo@omniscribe.ai' } });
    expect(demo).toBeTruthy();
    expect(demo!.mustChangePassword).toBe(true);
  });

  it('should change password and clear mustChangePassword flag', async () => {
    const { user } = await createTestUser({
      email: testEmail,
      password: 'InitialPassword123!',
      mustChangePassword: true,
    });

    expect(user.mustChangePassword).toBe(true);

    // Simulate password change
    const newHash = await bcrypt.hash('NewSecurePassword123!', 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash, mustChangePassword: false },
    });

    const updated = await prisma.user.findUnique({ where: { id: user.id } });
    expect(updated!.mustChangePassword).toBe(false);
    expect(await bcrypt.compare('NewSecurePassword123!', updated!.passwordHash)).toBe(true);
    expect(await bcrypt.compare('InitialPassword123!', updated!.passwordHash)).toBe(false);
  });
});
