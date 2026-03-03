import { requireSuperAdminWithMfa } from "@/lib/auth/current-user";
import { isAuthzError } from "@/lib/auth/errors";
import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PriceUpsertSchema = z.object({
  planCode: z.enum(["starter", "professional", "practice"]),
  billingInterval: z.enum(["monthly", "annual"]),
  amountCents: z.number().int().min(0),
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
    const prices = await prisma.priceConfig.findMany({
      orderBy: [{ planCode: "asc" }, { billingInterval: "asc" }],
    });
    return NextResponse.json({ success: true, prices });
  } catch (error) {
    appLog("error", "AdminBillingPricesRoute", "Failed to list prices", {
      error: scrubError(error),
    });
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
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
  const parsed = PriceUpsertSchema.safeParse(body);
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
    const { planCode, billingInterval, amountCents } = parsed.data;
    const price = await prisma.priceConfig.upsert({
      where: {
        planCode_billingInterval: { planCode, billingInterval },
      },
      create: { planCode, billingInterval, amountCents },
      update: { amountCents },
    });
    return NextResponse.json({ success: true, price });
  } catch (error) {
    appLog("error", "AdminBillingPricesRoute", "Failed to upsert price", {
      error: scrubError(error),
    });
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 },
    );
  }
}
