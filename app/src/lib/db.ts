import { PrismaClient } from "@prisma/client";
import {
  isEncryptionConfigured,
  encryptFields,
  decryptFields,
  PATIENT_ENCRYPTED_FIELDS,
  VISIT_ENCRYPTED_FIELDS,
} from "./phi-crypto";

function createPrismaClient() {
  const base = new PrismaClient();

  // If PHI encryption is not configured, return the base client as-is.
  // This allows the app to run in development without PHI_ENCRYPTION_KEY
  // while production MUST have it set.
  if (!isEncryptionConfigured()) {
    return base;
  }

  return base.$extends({
    query: {
      patient: {
        async create({ args, query }) {
          if (args.data) encryptFields(args.data as Record<string, unknown>, [...PATIENT_ENCRYPTED_FIELDS]);
          const result = await query(args);
          return decryptFields(result as Record<string, unknown>, [...PATIENT_ENCRYPTED_FIELDS]) as typeof result;
        },
        async createMany({ args, query }) {
          const items = Array.isArray(args.data) ? args.data : [args.data];
          for (const item of items) encryptFields(item as Record<string, unknown>, [...PATIENT_ENCRYPTED_FIELDS]);
          return query(args);
        },
        async update({ args, query }) {
          if (args.data) encryptFields(args.data as Record<string, unknown>, [...PATIENT_ENCRYPTED_FIELDS]);
          const result = await query(args);
          return decryptFields(result as Record<string, unknown>, [...PATIENT_ENCRYPTED_FIELDS]) as typeof result;
        },
        async updateMany({ args, query }) {
          if (args.data) encryptFields(args.data as Record<string, unknown>, [...PATIENT_ENCRYPTED_FIELDS]);
          return query(args);
        },
        async upsert({ args, query }) {
          if (args.create) encryptFields(args.create as Record<string, unknown>, [...PATIENT_ENCRYPTED_FIELDS]);
          if (args.update) encryptFields(args.update as Record<string, unknown>, [...PATIENT_ENCRYPTED_FIELDS]);
          const result = await query(args);
          return decryptFields(result as Record<string, unknown>, [...PATIENT_ENCRYPTED_FIELDS]) as typeof result;
        },
        async findFirst({ args, query }) {
          const result = await query(args);
          if (result) decryptFields(result as Record<string, unknown>, [...PATIENT_ENCRYPTED_FIELDS]);
          return result;
        },
        async findUnique({ args, query }) {
          const result = await query(args);
          if (result) decryptFields(result as Record<string, unknown>, [...PATIENT_ENCRYPTED_FIELDS]);
          return result;
        },
        async findMany({ args, query }) {
          const results = await query(args);
          for (const r of results) decryptFields(r as Record<string, unknown>, [...PATIENT_ENCRYPTED_FIELDS]);
          return results;
        },
      },
      visit: {
        async create({ args, query }) {
          if (args.data) encryptFields(args.data as Record<string, unknown>, [...VISIT_ENCRYPTED_FIELDS]);
          const result = await query(args);
          return decryptFields(result as Record<string, unknown>, [...VISIT_ENCRYPTED_FIELDS]) as typeof result;
        },
        async update({ args, query }) {
          if (args.data) encryptFields(args.data as Record<string, unknown>, [...VISIT_ENCRYPTED_FIELDS]);
          const result = await query(args);
          return decryptFields(result as Record<string, unknown>, [...VISIT_ENCRYPTED_FIELDS]) as typeof result;
        },
        async findFirst({ args, query }) {
          const result = await query(args);
          if (result) decryptFields(result as Record<string, unknown>, [...VISIT_ENCRYPTED_FIELDS]);
          return result;
        },
        async findUnique({ args, query }) {
          const result = await query(args);
          if (result) decryptFields(result as Record<string, unknown>, [...VISIT_ENCRYPTED_FIELDS]);
          return result;
        },
        async findMany({ args, query }) {
          const results = await query(args);
          for (const r of results) decryptFields(r as Record<string, unknown>, [...VISIT_ENCRYPTED_FIELDS]);
          return results;
        },
      },
    },
  });
}

const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof createPrismaClient> };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
