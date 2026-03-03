import { requireSuperAdminWithMfa } from "@/lib/auth/current-user";
import { isAuthzError } from "@/lib/auth/errors";
import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const DiscountPatchSchema = z.object({
  validTo: z.string().datetime().nullable().optional(),
  maxRedemptions: z.number().int().min(0).nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;
  const body = await req.json();
  const parsed = DiscountPatchSchema.safeParse(body);
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
    const update: { validTo?: Date | null; maxRedemptions?: number | null } = {};
    if (parsed.data.validTo !== undefined) {
      update.validTo = parsed.data.validTo ? new Date(parsed.data.validTo) : null;
    }
    if (parsed.data.maxRedemptions !== undefined) {
      update.maxRedemptions = parsed.data.maxRedemptions;
    }
    const discount = await prisma.discountCode.update({
      where: { id },
      data: update,
    });
    return NextResponse.json({ success: true, discount });
  } catch (error) {
    appLog("error", "AdminBillingDiscountsIdRoute", "Failed to update discount", {
      id,
      error: scrubError(error),
    });
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 },
    );
  }
}
