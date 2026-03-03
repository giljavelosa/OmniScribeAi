import { validateAuthRuntimeEnv } from "@/lib/auth-env";
import { validateEnv } from "@/shared/validation/env";

let validated = false;

function requireEnv(name: string): void {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

export function validateRuntimeEnv(): void {
  if (validated) return;

  validateEnv();
  validateAuthRuntimeEnv();

  if (process.env.NODE_ENV === "production") {
    requireEnv("DATABASE_URL");
  }

  validated = true;
}
