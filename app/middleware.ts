import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { checkRateLimit, getTierForPath } from "@/lib/rate-limiter";

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
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/transcribe|api/ocr).*)",
  ],
};
