type AuthEnvValidationOptions = {
  trustHostConfigured?: boolean;
};

let validated = false;

function isTruthy(value: string | undefined): boolean {
  return value?.toLowerCase() === "true";
}

export function validateAuthRuntimeEnv(options: AuthEnvValidationOptions = {}): void {
  if (validated) return;

  if (process.env.NODE_ENV !== "production") {
    validated = true;
    return;
  }

  const hasSecret = Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);
  if (!hasSecret) {
    throw new Error(
      "Auth configuration error: AUTH_SECRET (or NEXTAUTH_SECRET) must be set in production.",
    );
  }

  const hasHostTrust =
    options.trustHostConfigured === true ||
    isTruthy(process.env.AUTH_TRUST_HOST) ||
    isTruthy(process.env.NEXTAUTH_TRUST_HOST);
  const hasCanonicalAuthUrl = Boolean(process.env.AUTH_URL || process.env.NEXTAUTH_URL);

  if (!hasHostTrust && !hasCanonicalAuthUrl) {
    throw new Error(
      "Auth configuration error: set AUTH_TRUST_HOST=true (or NEXTAUTH_TRUST_HOST=true) or configure AUTH_URL/NEXTAUTH_URL in production.",
    );
  }

  validated = true;
}

