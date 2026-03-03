import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { appLog, scrubError } from "./logger";
import { validateAuthRuntimeEnv } from "./auth-env";

validateAuthRuntimeEnv({ trustHostConfigured: true });

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // No adapter — Credentials-only auth with JWT sessions.
  // PrismaAdapter is for OAuth account linking and DB sessions, neither used here.
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.isActive) return null;

          const valid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );
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
      },
    }),
  ],
});
