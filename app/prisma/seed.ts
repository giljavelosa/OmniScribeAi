import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash("OmniScribe2026!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@omniscribe.ai" },
    update: { mustChangePassword: true },
    create: {
      email: "admin@omniscribe.ai",
      name: "Admin",
      passwordHash: adminHash,
      role: Role.ADMIN,
      clinicianType: "Admin",
      mustChangePassword: true,
    },
  });
  console.log("Admin:", admin.email);

  const demoHash = await bcrypt.hash("Demo2026!", 12);
  const demo = await prisma.user.upsert({
    where: { email: "demo@omniscribe.ai" },
    update: { mustChangePassword: true },
    create: {
      email: "demo@omniscribe.ai",
      name: "Dr. Sarah Chen",
      passwordHash: demoHash,
      role: Role.CLINICIAN,
      clinicianType: "MD",
      credentials: "MD, FACP",
      mustChangePassword: true,
    },
  });
  console.log("Demo:", demo.email);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
