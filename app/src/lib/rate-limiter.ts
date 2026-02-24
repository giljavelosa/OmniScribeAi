/**
 * In-Memory Sliding Window Rate Limiter
 *
 * Provides per-IP and per-user rate limiting for API routes.
 * Suitable for single-instance deployments. For multi-instance,
 * replace with Redis-backed implementation.
 *
 * Usage in middleware:
 *   const result = checkRateLimit('api', ip);
 *   if (!result.allowed) return new Response('Too Many Requests', { status: 429 });
 */

interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimitConfig {
  windowMs: number;   // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

// Rate limit tiers
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Login: 10 attempts per 15 minutes per IP
  login: { windowMs: 15 * 60 * 1000, maxRequests: 10 },
  // Expensive AI endpoints: 30 requests per minute per user
  ai: { windowMs: 60 * 1000, maxRequests: 30 },
  // General API: 120 requests per minute per user
  api: { windowMs: 60 * 1000, maxRequests: 120 },
};

// In-memory store (keyed by "tier:identifier")
const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      // Remove entries where all timestamps are expired
      const config = RATE_LIMITS[key.split(':')[0]] || RATE_LIMITS.api;
      entry.timestamps = entry.timestamps.filter(t => now - t < config.windowMs);
      if (entry.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  // Don't block Node.js shutdown
  if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref();
  }
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;     // max requests per window
  remaining: number;
  resetMs: number;   // ms until window resets
}

/**
 * Check if a request is within rate limits.
 *
 * @param tier - Rate limit tier: 'login', 'ai', or 'api'
 * @param identifier - IP address or user ID
 */
export function checkRateLimit(tier: string, identifier: string): RateLimitResult {
  ensureCleanup();

  const config = RATE_LIMITS[tier] || RATE_LIMITS.api;
  const key = `${tier}:${identifier}`;
  const now = Date.now();

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter(t => now - t < config.windowMs);

  if (entry.timestamps.length >= config.maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const resetMs = config.windowMs - (now - oldestInWindow);
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetMs,
    };
  }

  // Record this request
  entry.timestamps.push(now);

  return {
    allowed: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.timestamps.length,
    resetMs: config.windowMs,
  };
}

/**
 * Determine the rate limit tier from a URL pathname.
 */
export function getTierForPath(pathname: string): string {
  if (pathname.startsWith('/api/auth/callback')) return 'login';
  if (
    pathname.startsWith('/api/generate-note') ||
    pathname.startsWith('/api/transcribe') ||
    pathname.startsWith('/api/extract-chunk') ||
    pathname.startsWith('/api/ocr')
  ) return 'ai';
  if (pathname.startsWith('/api/')) return 'api';
  return 'api';
}
