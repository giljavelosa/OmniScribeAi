import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { validateAuthRuntimeEnv } from "./auth-env";
import { authenticateCredentials } from "./credentials-auth";

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
        return authenticateCredentials({
          email: credentials?.email,
          password: credentials?.password,
        });
      },
    }),
  ],
});
