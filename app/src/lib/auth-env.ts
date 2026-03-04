/**
 * Auth runtime environment validation.
 * Stub — validates that required auth env vars exist.
 * For now this is a no-op; the real implementation would
 * check NEXTAUTH_SECRET, NEXTAUTH_URL, etc.
 */

interface AuthEnvOptions {
  trustHostConfigured?: boolean;
}

export function validateAuthRuntimeEnv(_opts?: AuthEnvOptions): void {
  // No-op stub. In production this would verify:
  // - NEXTAUTH_SECRET is set and sufficiently long
  // - NEXTAUTH_URL or AUTH_TRUST_HOST is configured
  // - DATABASE_URL is reachable
}
