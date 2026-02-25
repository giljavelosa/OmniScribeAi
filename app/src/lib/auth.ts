import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

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
          console.log("[AUTH] authorize called, has email:", !!credentials?.email, "has password:", !!credentials?.password);
          if (!credentials?.email || !credentials?.password) return null;

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });
          console.log("[AUTH] user found:", !!user, "isActive:", user?.isActive);
          console.log("[AUTH] hash prefix:", user?.passwordHash?.substring(0, 10), "hash length:", user?.passwordHash?.length);
          console.log("[AUTH] password length:", (credentials.password as string)?.length, "password type:", typeof credentials.password);

          if (!user || !user.isActive) return null;

          const valid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );
          console.log("[AUTH] bcrypt valid:", valid);
          if (!valid) return null;

          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          console.log("[AUTH] returning user object, role:", user.role);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            clinicianType: user.clinicianType,
            mustChangePassword: user.mustChangePassword,
            extendedSessionAcknowledged: user.extendedSessionAcknowledgedVersion === "1.0",
          };
        } catch (error) {
          console.error("[AUTH] authorize error:", error);
          return null;
        }
      },
    }),
  ],
});
