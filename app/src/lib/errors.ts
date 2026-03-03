export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR"
  | "LLM_JSON_INVALID"
  | "LLM_OUTPUT_TRUNCATED"
  | "NOTE_AUDIT_STAGE_FAILED"
  | "PREPIPELINE_ERROR";

export class AppError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

export function unauthorized(message = "Unauthorized"): AppError {
  return new AppError("UNAUTHORIZED", message, 401);
}

export function forbidden(message = "Forbidden"): AppError {
  return new AppError("FORBIDDEN", message, 403);
}

export function validationError(message: string): AppError {
  return new AppError("VALIDATION_ERROR", message, 400);
}

export function internalError(message = "Internal server error"): AppError {
  return new AppError("INTERNAL_ERROR", message, 500);
}
