import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) {
    throw new Error("SUPER_ADMIN_EMAIL is required");
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true, mfaEnabled: true },
  });

  if (!existing) {
    throw new Error(`User not found for email: ${email}`);
  }

  const updated = await prisma.user.update({
    where: { id: existing.id },
    data: { role: "SUPER_ADMIN" },
    select: { id: true, email: true, role: true, mfaEnabled: true },
  });

  process.stdout.write(
    JSON.stringify(
      {
        success: true,
        user: updated,
      },
      null,
      2,
    ) + "\n",
  );
}

main()
  .catch((error) => {
    process.stderr.write(
      JSON.stringify(
        {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        null,
        2,
      ) + "\n",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
