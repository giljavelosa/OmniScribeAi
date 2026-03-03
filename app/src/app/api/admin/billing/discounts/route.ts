import { requireSuperAdminWithMfa } from "@/lib/auth/current-user";
import { isAuthzError } from "@/lib/auth/errors";
import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const DiscountCreateSchema = z.object({
  code: z.string().min(1).max(64).transform((s) => s.trim().toUpperCase()),
  type: z.enum(["percent", "fixed_cents"]),
  value: z.number().int().min(0),
  validFrom: z.string().datetime().optional(),
  validTo: z.string().datetime().nullable().optional(),
  maxRedemptions: z.number().int().min(0).nullable().optional(),
});

export async function GET() {
  try {
    await requireSuperAdminWithMfa();
  } catch (error) {
    if (isAuthzError(error) && error.code === "MFA_REQUIRED") {
      return NextResponse.json(
        { success: false, error: { code: "MFA_REQUIRED", message: "MFA setup required" } },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
      { status: 401 },
    );
  }

  try {
    const discounts = await prisma.discountCode.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, discounts });
  } catch (error) {
    appLog("error", "AdminBillingDiscountsRoute", "Failed to list discounts", {
      error: scrubError(error),
    });
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdminWithMfa();
  } catch (error) {
    if (isAuthzError(error) && error.code === "MFA_REQUIRED") {
      return NextResponse.json(
        { success: false, error: { code: "MFA_REQUIRED", message: "MFA setup required" } },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
      { status: 401 },
    );
  }

  const body = await req.json();
  const parsed = DiscountCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.flatten().formErrors.join("; "),
        },
      },
      { status: 400 },
    );
  }

  try {
    const { code, type, value, validFrom, validTo, maxRedemptions } = parsed.data;
    const existing = await prisma.discountCode.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: "CONFLICT", message: "Discount code already exists" } },
        { status: 409 },
      );
    }
    const discount = await prisma.discountCode.create({
      data: {
        code,
        type,
        value,
        validFrom: validFrom ? new Date(validFrom) : undefined,
        validTo: validTo ? new Date(validTo) : null,
        maxRedemptions: maxRedemptions ?? null,
      },
    });
    return NextResponse.json({ success: true, discount });
  } catch (error) {
    appLog("error", "AdminBillingDiscountsRoute", "Failed to create discount", {
      error: scrubError(error),
    });
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 },
    );
  }
}
