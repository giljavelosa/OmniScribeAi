import { z } from "zod";
import { AppError } from "@/shared/errors/AppError";
import { ERROR_CODES } from "@/shared/errors/codes";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  AUTH_SECRET: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  AUTH_TRUST_HOST: z.string().optional(),
  NEXTAUTH_TRUST_HOST: z.string().optional(),
  AUTH_URL: z.string().optional(),
  NEXTAUTH_URL: z.string().optional(),
  DATABASE_URL: z.string().optional(),
});

let validated = false;

export function validateEnv(): void {
  if (validated) return;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new AppError({
      code: ERROR_CODES.VALIDATION_FAILED,
      httpStatus: 500,
      safeMessage: "Environment validation failed",
      meta: { issueCount: parsed.error.issues.length },
    });
  }

  const env = parsed.data;
  if (env.NODE_ENV === "production") {
    const hasSecret = Boolean(env.AUTH_SECRET || env.NEXTAUTH_SECRET);
    const hasTrust = Boolean(env.AUTH_TRUST_HOST || env.NEXTAUTH_TRUST_HOST || env.AUTH_URL || env.NEXTAUTH_URL);
    if (!hasSecret || !hasTrust || !env.DATABASE_URL) {
      throw new AppError({
        code: ERROR_CODES.VALIDATION_FAILED,
        httpStatus: 500,
        safeMessage: "Missing required production environment variables",
        meta: {
          hasSecret,
          hasTrust,
          hasDatabaseUrl: Boolean(env.DATABASE_URL),
        },
      });
    }
  }

  validated = true;
}
