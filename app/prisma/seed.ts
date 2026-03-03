import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const PRIVILEGED_ROLES = new Set<Role>([Role.SUPER_ADMIN, Role.ADMIN, Role.ENTERPRISE_ADMIN]);

type SeedUserInput = {
  email: string;
  passwordEnv: string;
  name: string;
  role: Role;
  clinicianType?: string | null;
  credentials?: string | null;
  organizationId?: string | null;
  mustChangePassword?: boolean;
  mfaEnabled?: boolean;
};

function getSeedPassword(envName: string): string {
  const specific = process.env[envName];
  if (specific && specific.trim().length > 0) return specific.trim();

  const shared = process.env.SEED_DEFAULT_PASSWORD;
  if (shared && shared.trim().length >= 12) return shared.trim();

  throw new Error(
    `Missing ${envName} (or SEED_DEFAULT_PASSWORD with at least 12 chars) for secure seed credentials`,
  );
}

async function upsertSeedUser(input: SeedUserInput) {
  const passwordHash = await bcrypt.hash(getSeedPassword(input.passwordEnv), 12);
  const defaultMustChangePassword = PRIVILEGED_ROLES.has(input.role);
  const defaultMfaEnabled = input.role === Role.SUPER_ADMIN;

  return prisma.user.upsert({
    where: { email: input.email.toLowerCase() },
    update: {
      name: input.name,
      role: input.role,
      clinicianType: input.clinicianType ?? null,
      credentials: input.credentials ?? null,
      organizationId: input.organizationId ?? null,
      passwordHash,
      mustChangePassword: input.mustChangePassword ?? defaultMustChangePassword,
      mfaEnabled: input.mfaEnabled ?? defaultMfaEnabled,
    },
    create: {
      email: input.email.toLowerCase(),
      name: input.name,
      role: input.role,
      clinicianType: input.clinicianType ?? null,
      credentials: input.credentials ?? null,
      organizationId: input.organizationId ?? null,
      passwordHash,
      mustChangePassword: input.mustChangePassword ?? defaultMustChangePassword,
      mfaEnabled: input.mfaEnabled ?? defaultMfaEnabled,
      isActive: true,
    },
  });
}

async function main() {
  const org = await prisma.organization.upsert({
    where: { npi: "9999999999" },
    update: {
      name: "Local Test Clinic",
      city: "San Diego",
      state: "CA",
      zip: "92101",
      phone: "5550001000",
    },
    create: {
      name: "Local Test Clinic",
      npi: "9999999999",
      city: "San Diego",
      state: "CA",
      zip: "92101",
      phone: "5550001000",
    },
  });

  const users: SeedUserInput[] = [
    {
      email: "superadmin@omniscribe.ai",
      passwordEnv: "SEED_SUPER_ADMIN_PASSWORD",
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      clinicianType: "Admin",
      mfaEnabled: true,
      mustChangePassword: true,
    },
    {
      email: "admin@omniscribe.ai",
      passwordEnv: "SEED_PLATFORM_ADMIN_PASSWORD",
      name: "Platform Admin",
      role: Role.ADMIN,
      clinicianType: "Admin",
      mustChangePassword: true,
    },
    {
      email: "enterprise.admin@omniscribe.ai",
      passwordEnv: "SEED_ENTERPRISE_ADMIN_PASSWORD",
      name: "Enterprise Admin",
      role: Role.ENTERPRISE_ADMIN,
      clinicianType: "Admin",
      organizationId: org.id,
      mustChangePassword: true,
    },
    {
      email: "supervisor@omniscribe.ai",
      passwordEnv: "SEED_SUPERVISOR_PASSWORD",
      name: "Clinical Supervisor",
      role: Role.SUPERVISOR,
      clinicianType: "MD",
      organizationId: org.id,
    },
    {
      email: "demo@omniscribe.ai",
      passwordEnv: "SEED_DEMO_MD_PASSWORD",
      name: "Dr. Sarah Chen",
      role: Role.CLINICIAN,
      clinicianType: "MD",
      credentials: "MD, FACP",
      organizationId: org.id,
    },
    {
      email: "pt.demo@omniscribe.ai",
      passwordEnv: "SEED_DEMO_PT_PASSWORD",
      name: "Alex Rivera",
      role: Role.CLINICIAN,
      clinicianType: "PT",
      credentials: "DPT",
      organizationId: org.id,
    },
    {
      email: "ot.demo@omniscribe.ai",
      passwordEnv: "SEED_DEMO_OT_PASSWORD",
      name: "Jordan Lee",
      role: Role.CLINICIAN,
      clinicianType: "OT",
      credentials: "OTR/L",
      organizationId: org.id,
    },
    {
      email: "office.staff@omniscribe.ai",
      passwordEnv: "SEED_OFFICE_STAFF_PASSWORD",
      name: "Taylor Office Staff",
      role: "OFFICE_STAFF" as Role,
      clinicianType: "Office Staff",
      organizationId: org.id,
      mustChangePassword: false,
    },
  ];

  for (const user of users) {
    const saved = await upsertSeedUser(user);
    process.stdout.write(`Seeded: ${saved.email} (${saved.role})\n`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    process.stderr.write(`Seed failed: ${e instanceof Error ? e.message : String(e)}\n`);
    prisma.$disconnect();
    process.exit(1);
  });
