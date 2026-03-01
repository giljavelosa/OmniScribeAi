import { beforeAll, afterAll } from 'vitest';
import { prisma } from '../src/lib/db';

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

beforeAll(async () => {
  if (hasDatabaseUrl) {
    await prisma.$connect();
  }
});

afterAll(async () => {
  if (hasDatabaseUrl) {
    await prisma.$disconnect();
  }
});
