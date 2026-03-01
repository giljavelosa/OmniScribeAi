import { beforeAll, afterAll } from 'vitest';
import { prisma } from '../src/lib/db';

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
