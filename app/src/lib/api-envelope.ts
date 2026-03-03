import { NextResponse } from "next/server";
import { AppError, internalError } from "@/lib/errors";
import { isAuthzError } from "@/lib/auth/errors";
import { REQUEST_ID_HEADER } from "@/lib/request-id";

type ApiEnvelope<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string; requestId: string } };

function withRequestIdInit(init: ResponseInit | undefined, requestId: string): ResponseInit {
  const headers = new Headers(init?.headers);
  headers.set(REQUEST_ID_HEADER, requestId);
  return { ...init, headers };
}

export function ok<T>(data: T, init?: ResponseInit, requestId?: string): NextResponse<ApiEnvelope<T>> {
  const headers = new Headers(init?.headers);
  if (requestId) headers.set(REQUEST_ID_HEADER, requestId);
  return NextResponse.json({ success: true, data }, { ...init, headers });
}

export function fail(
  code: string,
  message: string,
  requestId: string,
  status = 500,
  init?: ResponseInit,
): NextResponse<ApiEnvelope> {
  return NextResponse.json(
    { success: false, error: { code, message, requestId } },
    { ...withRequestIdInit(init, requestId), status },
  );
}

export function fromError(error: unknown, requestId: string): NextResponse<ApiEnvelope> {
  if (error instanceof AppError) {
    return fail(error.code, error.message, requestId, error.status);
  }
  if (isAuthzError(error)) {
    return fail(error.code, error.message, requestId, error.status);
  }
  const normalized = internalError();
  return fail(normalized.code, normalized.message, requestId, normalized.status);
}
