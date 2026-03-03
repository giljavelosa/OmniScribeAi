import { NextRequest } from "next/server";

export const REQUEST_ID_HEADER = "x-request-id";

export function createRequestId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // Fallback below.
  }
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getRequestIdFromHeaders(req: NextRequest | { headers?: Headers } | undefined): string {
  const incoming = req?.headers?.get(REQUEST_ID_HEADER)?.trim();
  if (incoming) return incoming;
  return createRequestId();
}
