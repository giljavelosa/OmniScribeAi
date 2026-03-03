import { checkRateLimit, getTierForPath, type RateLimitResult } from "@/lib/rate-limiter";
import { isOfficeStaffRole } from "@/lib/auth/role-permissions";

type CsrfInput = {
  pathname: string;
  method: string;
  origin: string | null;
  referer: string | null;
  host: string | null;
};

type CsrfDecision =
  | { allowed: true }
  | { allowed: false; reason: "missing_headers" | "cross_origin" };

export function evaluateCsrf(input: CsrfInput): CsrfDecision {
  if (!input.pathname.startsWith("/api/")) {
    return { allowed: true };
  }

  if (!["POST", "PUT", "PATCH", "DELETE"].includes(input.method)) {
    return { allowed: true };
  }

  if (!input.host) {
    return { allowed: false, reason: "cross_origin" };
  }

  if (!input.origin && !input.referer) {
    return { allowed: false, reason: "missing_headers" };
  }

  if (input.origin) {
    try {
      const originHost = new URL(input.origin).host;
      return originHost === input.host
        ? { allowed: true }
        : { allowed: false, reason: "cross_origin" };
    } catch {
      return { allowed: false, reason: "cross_origin" };
    }
  }

  if (input.referer) {
    try {
      const refererHost = new URL(input.referer).host;
      return refererHost === input.host
        ? { allowed: true }
        : { allowed: false, reason: "cross_origin" };
    } catch {
      return { allowed: false, reason: "cross_origin" };
    }
  }

  return { allowed: false, reason: "cross_origin" };
}

export function enforceApiRateLimit(pathname: string, identifier: string): RateLimitResult {
  const tier = getTierForPath(pathname);
  return checkRateLimit(tier, identifier);
}

type OfficeStaffDecision =
  | { allowed: true }
  | { allowed: false; reason: "restricted_route" };

const OFFICE_STAFF_BLOCKED_API_PREFIXES = [
  "/api/generate-note",
  "/api/regenerate-note",
  "/api/transcribe",
  "/api/transcribe-chunk",
  "/api/extract-chunk",
  "/api/ocr",
];

const OFFICE_STAFF_BLOCKED_PAGE_PREFIXES = [
  "/visit/new",
  "/admin",
  "/account/billing",
  "/settings/security",
];

export function evaluateOfficeStaffRestrictions(input: {
  pathname: string;
  method: string;
  role: string | null | undefined;
}): OfficeStaffDecision {
  if (!isOfficeStaffRole(input.role)) {
    return { allowed: true };
  }

  for (const prefix of OFFICE_STAFF_BLOCKED_PAGE_PREFIXES) {
    if (input.pathname === prefix || input.pathname.startsWith(`${prefix}/`)) {
      return { allowed: false, reason: "restricted_route" };
    }
  }

  for (const prefix of OFFICE_STAFF_BLOCKED_API_PREFIXES) {
    if (input.pathname === prefix || input.pathname.startsWith(`${prefix}/`)) {
      return { allowed: false, reason: "restricted_route" };
    }
  }

  if (input.pathname === "/api/visits" && input.method === "POST") {
    return { allowed: false, reason: "restricted_route" };
  }

  if (
    input.pathname.startsWith("/api/visits/") &&
    (input.method === "PATCH" || input.method === "DELETE")
  ) {
    return { allowed: false, reason: "restricted_route" };
  }

  if (input.pathname.startsWith("/api/patients/") && input.pathname.endsWith("/medical")) {
    return { allowed: false, reason: "restricted_route" };
  }

  return { allowed: true };
}

