import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import { checkRateLimit, getTierForPath } from "@/lib/rate-limiter";

// Use Edge-compatible auth config (no DB adapter, no Node.js crypto)
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Always-public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    // Rate limit login attempts by IP
    if (pathname.startsWith("/api/auth/callback")) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
      const result = checkRateLimit("login", ip);
      if (!result.allowed) {
        return new NextResponse(
          JSON.stringify({ error: "Too many login attempts. Please try again later." }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(Math.ceil(result.resetMs / 1000)),
              "X-RateLimit-Limit": String(result.limit),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": String(Math.ceil(result.resetMs / 1000)),
            },
          },
        );
      }
    }
    return NextResponse.next();
  }

  // Not logged in — redirect to login with validated callbackUrl
  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);
    // Only allow relative paths (prevent open redirect)
    if (pathname.startsWith("/") && !pathname.startsWith("//")) {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Logged in but must change password — force to /change-password
  if (
    req.auth.user?.mustChangePassword &&
    !pathname.startsWith("/change-password") &&
    !pathname.startsWith("/api/")
  ) {
    return NextResponse.redirect(new URL("/change-password", req.url));
  }

  // CSRF protection: verify Origin on state-changing API requests
  if (
    pathname.startsWith("/api/") &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)
  ) {
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");
    const host = req.headers.get("host");

    // Accept if Origin matches host
    let originOk = false;
    if (origin) {
      try {
        const originHost = new URL(origin).host;
        originOk = originHost === host;
      } catch { /* invalid origin */ }
    } else if (referer) {
      // Fallback to Referer if no Origin (some older browsers)
      try {
        const refererHost = new URL(referer).host;
        originOk = refererHost === host;
      } catch { /* invalid referer */ }
    }
    // No Origin and no Referer — reject (likely cross-site or curl without headers)
    // Exception: allow requests with no origin only if they have a valid session (server-to-server)
    if (!originOk && (origin || referer)) {
      return new NextResponse(
        JSON.stringify({ error: "CSRF validation failed" }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  // Rate limit API routes for authenticated users
  if (pathname.startsWith("/api/")) {
    const userId = req.auth.user?.id || "anonymous";
    const tier = getTierForPath(pathname);
    const result = checkRateLimit(tier, userId);
    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Rate limit exceeded. Please slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil(result.resetMs / 1000)),
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(result.resetMs / 1000)),
          },
        },
      );
    }

    // Attach rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(result.limit));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetMs / 1000)));
    return response;
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/transcribe|api/ocr).*)",
  ],
};
