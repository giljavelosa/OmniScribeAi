import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createTrialSubscription } from "@/lib/billing/trial";
import { Role } from "@prisma/client";

const SignupSchema = z.object({
  email: z.string().email().max(255).transform((s) => s.trim().toLowerCase()),
  password: z.string().min(8).max(128),
  name: z.string().max(255).optional().transform((s) => (s?.trim() || undefined)),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const { checkRateLimit } = await import("@/lib/rate-limiter");
  const result = checkRateLimit("signup", ip);
  if (!result.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many signup attempts. Please try again later.", code: "RATE_LIMIT_EXCEEDED" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(result.resetMs / 1000)),
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body", code: "INVALID_JSON" },
      { status: 400 },
    );
  }

  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors.join("; ") || "Validation failed";
    return NextResponse.json(
      { success: false, error: msg, code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  const { email, password, name } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already in use", code: "EMAIL_IN_USE" },
        { status: 409 },
      );
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        name: name || null,
        role: Role.CLINICIAN,
        mustChangePassword: true,
      },
    });

    await createTrialSubscription(user.id);

    appLog("info", "SignupRoute", "User registered", {
      userId: user.id,
      emailDomain: email.split("@")[1],
    });

    return NextResponse.json(
      { success: true, userId: user.id },
      { status: 201 },
    );
  } catch (error) {
    appLog("error", "SignupRoute", "Signup failed", {
      error: scrubError(error),
      emailDomain: email.split("@")[1],
    });
    return NextResponse.json(
      { success: false, error: "Registration failed. Please try again.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
