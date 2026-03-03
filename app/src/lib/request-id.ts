import { NextRequest } from "next/server";
import {
  REQUEST_ID_HEADER,
  createRequestId,
  getRequestIdFromHeaders,
} from "@/shared/observability/requestId";

export { REQUEST_ID_HEADER, createRequestId };

export function getOrCreateRequestId(headers: Headers): string {
  const existing = headers.get(REQUEST_ID_HEADER)?.trim();
  if (existing) return existing;
  return createRequestId();
}

export function getRequestIdFromRequest(req: NextRequest | { headers?: Headers } | undefined): string {
  return getRequestIdFromHeaders(req as NextRequest | undefined);
}

export function withRequestIdHeader(response: Response, requestId: string): Response {
  response.headers.set(REQUEST_ID_HEADER, requestId);
  return response;
}
