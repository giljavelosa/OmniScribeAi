import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("OmniScribe2026!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@omniscribe.ai" },
    update: {},
    create: {
      email: "admin@omniscribe.ai",
      name: "Admin",
      passwordHash,
      role: Role.ADMIN,
      clinicianType: "Admin",
    },
  });

  console.log("Seeded admin user:", admin.email);

  // Demo clinician
  const demoHash = await bcrypt.hash("Demo2026!", 12);
  const demo = await prisma.user.upsert({
    where: { email: "demo@omniscribe.ai" },
    update: {},
    create: {
      email: "demo@omniscribe.ai",
      name: "Dr. Sarah Chen",
      passwordHash: demoHash,
      role: Role.CLINICIAN,
      clinicianType: "MD",
      credentials: "MD, FACP",
    },
  });

  console.log("Seeded demo clinician:", demo.email);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
