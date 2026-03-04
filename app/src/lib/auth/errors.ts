/**
 * Auth error types for authorization failures.
 * Used by admin routes to return structured error envelopes.
 */

export class AuthzError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "AuthzError";
    this.code = code;
    this.status = status;
  }
}

export class UnauthorizedError extends AuthzError {
  constructor(message = "Authentication required") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AuthzError {
  constructor(message = "Forbidden", code = "FORBIDDEN") {
    super(message, code, 403);
    this.name = "ForbiddenError";
  }
}

/**
 * Type guard: checks whether an error is an AuthzError
 * (has code and status properties matching our error hierarchy).
 */
export function isAuthzError(
  error: unknown,
): error is AuthzError {
  if (error instanceof AuthzError) return true;
  if (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    "status" in error &&
    "message" in error &&
    typeof (error as Record<string, unknown>).code === "string" &&
    typeof (error as Record<string, unknown>).status === "number"
  ) {
    return true;
  }
  return false;
}
