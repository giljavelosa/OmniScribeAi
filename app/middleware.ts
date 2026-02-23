import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

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
    (req.auth.user as any)?.mustChangePassword &&
    !pathname.startsWith("/change-password") &&
    !pathname.startsWith("/api/")
  ) {
    return NextResponse.redirect(new URL("/change-password", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/transcribe|api/ocr).*)",
  ],
};
