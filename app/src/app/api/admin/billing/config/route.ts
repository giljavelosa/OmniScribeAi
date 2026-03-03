import { requireSuperAdminWithMfa } from "@/lib/auth/current-user";
import { isAuthzError } from "@/lib/auth/errors";
import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CONFIG_KEYS = [
  "annual_discount_percent",
  "referral_discount_percent",
  "post_trial_discount_percent",
  "post_trial_discount_months",
] as const;

const ConfigPatchSchema = z.object({
  key: z.enum(CONFIG_KEYS),
  value: z.string().min(0).max(256),
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
    const configs = await prisma.billingConfig.findMany({
      where: { key: { in: [...CONFIG_KEYS] } },
    });
    const map: Record<string, string> = {};
    for (const c of configs) {
      map[c.key] = c.value;
    }
    return NextResponse.json({ success: true, config: map });
  } catch (error) {
    appLog("error", "AdminBillingConfigRoute", "Failed to list config", {
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
  const parsed = ConfigPatchSchema.safeParse(body);
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
    const config = await prisma.billingConfig.upsert({
      where: { key: parsed.data.key },
      create: { key: parsed.data.key, value: parsed.data.value },
      update: { value: parsed.data.value },
    });
    return NextResponse.json({ success: true, config });
  } catch (error) {
    appLog("error", "AdminBillingConfigRoute", "Failed to update config", {
      error: scrubError(error),
    });
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 },
    );
  }
}
