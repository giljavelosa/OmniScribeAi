export class UnauthorizedError extends Error {
  readonly status = 401;
  readonly code = "UNAUTHORIZED";

  constructor(message = "Authentication required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  readonly status = 403;
  readonly code: string;

  constructor(message = "Forbidden", code = "FORBIDDEN") {
    super(message);
    this.name = "ForbiddenError";
    this.code = code;
  }
}

export type AuthzError = UnauthorizedError | ForbiddenError;

export function isAuthzError(error: unknown): error is AuthzError {
  return error instanceof UnauthorizedError || error instanceof ForbiddenError;
}
