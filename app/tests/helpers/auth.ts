import bcrypt from 'bcryptjs';
import { prisma } from '../../src/lib/db';
import type { Role } from '@prisma/client';

export async function createTestUser(options: {
  email: string;
  password: string;
  role?: Role;
  mustChangePassword?: boolean;
  name?: string;
  organizationId?: string | null;
}) {
  const passwordHash = await bcrypt.hash(options.password, 12);

  const user = await prisma.user.create({
    data: {
      email: options.email,
      passwordHash,
      role: options.role ?? 'CLINICIAN',
      mustChangePassword: options.mustChangePassword ?? false,
      name: options.name ?? `Test User (${options.email})`,
      clinicianType: 'MD',
      organizationId: options.organizationId ?? null,
    },
  });

  return { user, password: options.password };
}

export async function cleanupTestUsers(emails: string[]) {
  const users = await prisma.user.findMany({
    where: { email: { in: emails } },
    select: { id: true },
  });
  const userIds = users.map((user) => user.id);

  if (userIds.length > 0) {
    await prisma.auditLog.deleteMany({
      where: {
        OR: [
          { adminId: { in: userIds } },
          { userId: { in: userIds } },
        ],
      },
    });
  }

  await prisma.user.deleteMany({ where: { email: { in: emails } } });
}
