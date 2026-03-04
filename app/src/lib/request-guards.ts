/**
 * Request guards for middleware: CSRF validation and API rate limiting.
 * These are Edge-compatible (no Node.js APIs).
 */

import { checkRateLimit, getTierForPath } from './rate-limiter';

// ────────────────────────────────────────────────────────────────
// CSRF guard
// ────────────────────────────────────────────────────────────────

interface CsrfInput {
  pathname: string;
  method: string;
  origin: string | null;
  referer: string | null;
  host: string | null;
}

type CsrfResult =
  | { allowed: true }
  | { allowed: false; reason: 'missing_headers' | 'cross_origin' };

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Evaluate whether a request passes CSRF checks.
 * Safe methods (GET, HEAD, OPTIONS) always pass.
 * State-changing methods on /api/ paths require a matching Origin or Referer.
 */
export function evaluateCsrf(input: CsrfInput): CsrfResult {
  // Safe methods are exempt
  if (SAFE_METHODS.has(input.method.toUpperCase())) {
    return { allowed: true };
  }

  // Non-API paths are exempt
  if (!input.pathname.startsWith('/api/')) {
    return { allowed: true };
  }

  // Must have Origin or Referer
  const originOrReferer = input.origin || input.referer;
  if (!originOrReferer) {
    return { allowed: false, reason: 'missing_headers' };
  }

  // Check origin matches host
  try {
    const url = new URL(originOrReferer);
    const expectedHost = input.host?.replace(/:\d+$/, '') ?? '';
    const actualHost = url.hostname;

    if (actualHost !== expectedHost && actualHost !== 'localhost') {
      return { allowed: false, reason: 'cross_origin' };
    }
  } catch {
    return { allowed: false, reason: 'cross_origin' };
  }

  return { allowed: true };
}

// ────────────────────────────────────────────────────────────────
// API rate limit guard
// ────────────────────────────────────────────────────────────────

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

/**
 * Enforce rate limits for an API path + user combo.
 * Delegates to the sliding-window rate limiter with the appropriate tier.
 */
export function enforceApiRateLimit(
  pathname: string,
  userId: string,
): RateLimitResult {
  const tier = getTierForPath(pathname);
  return checkRateLimit(tier, userId);
}
