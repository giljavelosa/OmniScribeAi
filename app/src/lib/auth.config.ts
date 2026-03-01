/**
 * NextAuth v5 Edge-compatible auth config.
 *
 * This file contains ONLY the config that can run in Edge Runtime (middleware).
 * No database imports, no Node.js crypto, no bcrypt.
 *
 * The full auth config in auth.ts extends this with the PrismaAdapter
 * and Credentials provider (which need Node.js runtime).
 */
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt", maxAge: 4 * 60 * 60 }, // 4 hours absolute max
  pages: { signIn: "/login" },
  providers: [], // Credentials provider added in auth.ts (needs Node.js)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role ?? "CLINICIAN";
        token.organizationId = user.organizationId ?? null;
        token.clinicianType = user.clinicianType ?? null;
        token.mustChangePassword = user.mustChangePassword ?? false;
        token.extendedSessionAcknowledged = user.extendedSessionAcknowledged ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.organizationId = token.organizationId;
        session.user.clinicianType = token.clinicianType;
        session.user.mustChangePassword = token.mustChangePassword;
        session.user.extendedSessionAcknowledged = token.extendedSessionAcknowledged;
      }
      return session;
    },
  },
};
