import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { frameworks } from "@/lib/frameworks";
import { appLog, scrubError } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { getEntitlementSnapshot, enforceFeature } from "@/lib/billing/entitlements";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entitlements = await getEntitlementSnapshot(session.user.id);
  const featureCheck = enforceFeature(entitlements, "custom_templates");
  if (!featureCheck.allowed) {
    return NextResponse.json(
      { success: false, error: featureCheck.message, code: featureCheck.code, requiredPlan: featureCheck.requiredPlan },
      { status: 403 },
    );
  }

  try {
    const { id } = await params;

    if (frameworks.find(f => f.id === id)) {
      return NextResponse.json({ error: "Cannot archive system templates" }, { status: 400 });
    }

    const existing = await prisma.noteTemplate.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Template not found" }, { status: 404 });

    // Owner or admin only
    if (existing.ownerUserId !== session.user.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });
      if (user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const template = await prisma.noteTemplate.update({
      where: { id },
      data: { isArchived: true },
    });

    await auditLog({
      userId: session.user.id,
      action: "ARCHIVE_TEMPLATE",
      resource: `template:${template.id}`,
    });

    return NextResponse.json({ template });
  } catch (error) {
    appLog("error", "POST /api/templates/:id/archive", scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
