import type { ErrorCode } from "@/shared/errors/codes";
import { ERROR_CODES } from "@/shared/errors/codes";

type SafeMetaValue = string | number | boolean | null | undefined;
export type SafeMeta = Record<string, SafeMetaValue>;

export class AppError extends Error {
  readonly code: string;
  readonly httpStatus: number;
  readonly safeMessage: string;
  readonly cause?: unknown;
  readonly meta?: SafeMeta;

  constructor(params: {
    code: ErrorCode | string;
    httpStatus: number;
    safeMessage: string;
    cause?: unknown;
    meta?: SafeMeta;
  }) {
    super(params.safeMessage);
    this.name = "AppError";
    this.code = params.code;
    this.httpStatus = params.httpStatus;
    this.safeMessage = params.safeMessage;
    this.cause = params.cause;
    this.meta = params.meta;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) return error;
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    "status" in error &&
    "message" in error
  ) {
    const legacy = error as { code: string; status: number; message: string };
    return new AppError({
      code: legacy.code,
      httpStatus: legacy.status,
      safeMessage: legacy.message,
      cause: error,
    });
  }
  return new AppError({
    code: ERROR_CODES.UNKNOWN,
    httpStatus: 500,
    safeMessage: "Internal server error",
    cause: error,
  });
}
