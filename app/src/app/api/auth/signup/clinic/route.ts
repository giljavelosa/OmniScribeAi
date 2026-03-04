import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createTrialSubscriptionForOrg } from "@/lib/billing/trial";
import { Role } from "@prisma/client";

const ClinicSignupSchema = z.object({
  orgName: z.string().min(1).max(255).trim(),
  orgNpi: z.string().max(20).trim().optional().transform((s) => s || undefined),
  orgAddress: z.string().max(500).trim().optional().transform((s) => s || undefined),
  orgCity: z.string().max(100).trim().optional().transform((s) => s || undefined),
  orgState: z.string().max(50).trim().optional().transform((s) => s || undefined),
  orgZip: z.string().max(20).trim().optional().transform((s) => s || undefined),
  orgPhone: z.string().max(50).trim().optional().transform((s) => s || undefined),
  adminEmail: z.string().email().max(255).transform((s) => s.trim().toLowerCase()),
  adminPassword: z.string().min(8).max(128),
  adminName: z.string().max(255).optional().transform((s) => (s?.trim() || undefined)),
});

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const { checkRateLimit } = await import("@/lib/rate-limiter");
  const result = checkRateLimit("signup", ip);
  if (!result.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many signup attempts. Please try again later.",
        code: "RATE_LIMIT_EXCEEDED",
      },
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

  const parsed = ClinicSignupSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors.join("; ") || "Validation failed";
    return NextResponse.json(
      { success: false, error: msg, code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  const {
    orgName,
    orgNpi,
    orgAddress,
    orgCity,
    orgState,
    orgZip,
    orgPhone,
    adminEmail,
    adminPassword,
    adminName,
  } = parsed.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: adminEmail,
          mode: "insensitive",
        },
      },
      select: { id: true },
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already in use", code: "EMAIL_IN_USE" },
        { status: 409 },
      );
    }

    const org = await prisma.organization.create({
      data: {
        name: orgName,
        npi: orgNpi,
        address: orgAddress,
        city: orgCity,
        state: orgState,
        zip: orgZip,
        phone: orgPhone,
      },
    });

    const hash = await bcrypt.hash(adminPassword, 12);
    const user = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hash,
        name: adminName || null,
        role: Role.ADMIN,
        organizationId: org.id,
        mustChangePassword: true,
      },
    });

    await createTrialSubscriptionForOrg(org.id);

    appLog("info", "ClinicSignupRoute", "Clinic registered", {
      orgId: org.id,
      userId: user.id,
      emailDomain: adminEmail.split("@")[1],
    });

    return NextResponse.json(
      { success: true, organizationId: org.id, userId: user.id },
      { status: 201 },
    );
  } catch (error) {
    appLog("error", "ClinicSignupRoute", "Clinic signup failed", {
      error: scrubError(error),
      emailDomain: adminEmail.split("@")[1],
    });
    return NextResponse.json(
      {
        success: false,
        error: "Registration failed. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
