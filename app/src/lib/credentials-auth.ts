import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { appLog, scrubError } from "./logger";

type CredentialInputs = {
  email?: unknown;
  password?: unknown;
};

type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  organizationId: string | null;
  clinicianType: string | null;
  mustChangePassword: boolean;
  extendedSessionAcknowledged: boolean;
};

export async function authenticateCredentials(credentials: CredentialInputs): Promise<AuthUser | null> {
  try {
    if (typeof credentials.email !== "string" || typeof credentials.password !== "string") return null;

    const email = credentials.email.trim();
    const password = credentials.password;
    if (!email || password.length === 0) return null;

    const select = {
      id: true,
      email: true,
      name: true,
      role: true,
      organizationId: true,
      clinicianType: true,
      mustChangePassword: true,
      extendedSessionAcknowledgedVersion: true,
      passwordHash: true,
      isActive: true,
    } as const;

    // Fast path: exact match for current canonical emails.
    let user = await prisma.user.findUnique({
      where: { email },
      select,
    });

    // Compatibility path: legacy mixed-case records.
    if (!user) {
      const users = await prisma.user.findMany({
        where: {
          email: {
            equals: email,
            mode: "insensitive",
          },
        },
        select,
        orderBy: { createdAt: "asc" },
        take: 2,
      });

      // Safety: prevent ambiguous account matches if case-colliding emails exist.
      if (users.length !== 1) {
        if (users.length > 1) {
          appLog("error", "Auth", "Ambiguous case-insensitive email match", {
            emailDomain: email.includes("@") ? email.split("@")[1] : null,
            matchCount: users.length,
          });
        }
        return null;
      }

      user = users[0];
    }

    if (!user.isActive) return null;

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
      clinicianType: user.clinicianType,
      mustChangePassword: user.mustChangePassword,
      extendedSessionAcknowledged: user.extendedSessionAcknowledgedVersion === "1.0",
    };
  } catch (error) {
    appLog("error", "Auth", "Credentials authorize failed", { error: scrubError(error) });
    return null;
  }
}
