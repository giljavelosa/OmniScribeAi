import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;

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
      data: { isArchived: false },
    });

    await auditLog({
      userId: session.user.id,
      action: "UNARCHIVE_TEMPLATE",
      resource: `template:${template.id}`,
    });

    return NextResponse.json({ template });
  } catch (error) {
    appLog("error", "POST /api/templates/:id/unarchive", scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
