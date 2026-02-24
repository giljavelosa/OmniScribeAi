import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { NextResponse } from "next/server";

const CURRENT_VERSION = "1.0";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    await prisma.user.update({
      where: { id: userId },
      data: {
        extendedSessionAcknowledgedAt: new Date(),
        extendedSessionAcknowledgedVersion: CURRENT_VERSION,
      },
    });

    try {
      await auditLog({
        userId,
        action: "ACKNOWLEDGE_EXTENDED_SESSION",
        details: { version: CURRENT_VERSION },
      });
    } catch { /* non-critical */ }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/auth/acknowledge-disclaimer]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
