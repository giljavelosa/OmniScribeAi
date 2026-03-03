import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";
import { enforceApiRateLimit, evaluateCsrf, evaluateOfficeStaffRestrictions } from "@/lib/request-guards";
import { fail } from "@/lib/api-envelope";
import { getOrCreateRequestId, withRequestIdHeader } from "@/lib/request-id";

// Use Edge-compatible auth config (no DB adapter, no Node.js crypto)
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const requestId = getOrCreateRequestId(req.headers);

  // Always-public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/signup") ||
    pathname.startsWith("/api/auth/signup") ||
    pathname.startsWith("/api/billing/pricing") ||
    pathname.startsWith("/api/billing/webhook/stripe") ||
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    // Rate limit login attempts by IP
    if (pathname.startsWith("/api/auth/callback")) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
      const result = checkRateLimit("login", ip);
      if (!result.allowed) {
        return fail(
          "RATE_LIMITED",
          "Too many login attempts. Please try again later.",
          requestId,
          429,
          {
            headers: {
              "Retry-After": String(Math.ceil(result.resetMs / 1000)),
              "X-RateLimit-Limit": String(result.limit),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": String(Math.ceil(result.resetMs / 1000)),
            },
          },
        );
      }
    }
    return withRequestIdHeader(NextResponse.next(), requestId);
  }

  // Admin API routes must never redirect on auth failure.
  if (pathname.startsWith("/api/admin") && !req.auth) {
    return fail("UNAUTHORIZED", "Unauthorized", requestId, 401);
  }

  // Not logged in — redirect to login with validated callbackUrl
  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);
    // Only allow relative paths (prevent open redirect)
    if (pathname.startsWith("/") && !pathname.startsWith("//")) {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return withRequestIdHeader(NextResponse.redirect(loginUrl), requestId);
  }

  const officeStaffAccess = evaluateOfficeStaffRestrictions({
    pathname,
    method: req.method,
    role: req.auth.user?.role,
  });
  if (!officeStaffAccess.allowed) {
    if (pathname.startsWith("/api/")) {
      return fail("FORBIDDEN", "Insufficient permissions for office staff role", requestId, 403);
    }
    return withRequestIdHeader(NextResponse.redirect(new URL("/dashboard", req.url)), requestId);
  }

  // Logged in but must change password — force to /change-password
  if (
    req.auth.user?.mustChangePassword &&
    !pathname.startsWith("/change-password") &&
    !pathname.startsWith("/api/")
  ) {
    return withRequestIdHeader(NextResponse.redirect(new URL("/change-password", req.url)), requestId);
  }

  const csrf = evaluateCsrf({
    pathname,
    method: req.method,
    origin: req.headers.get("origin"),
    referer: req.headers.get("referer"),
    host: req.headers.get("host"),
  });
  if (!csrf.allowed) {
    return fail("CSRF_FAILED", "CSRF validation failed", requestId, 403);
  }

  // Rate limit API routes for authenticated users
  if (pathname.startsWith("/api/")) {
    const userId = req.auth.user?.id || "anonymous";
    const result = enforceApiRateLimit(pathname, userId);
    if (!result.allowed) {
      return fail("RATE_LIMITED", "Rate limit exceeded. Please slow down.", requestId, 429, {
        headers: {
          "Retry-After": String(Math.ceil(result.resetMs / 1000)),
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(result.resetMs / 1000)),
        },
      });
    }

    const response = withRequestIdHeader(NextResponse.next(), requestId);
    response.headers.set("X-RateLimit-Limit", String(result.limit));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetMs / 1000)));
    return response;
  }

  return withRequestIdHeader(NextResponse.next(), requestId);
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
