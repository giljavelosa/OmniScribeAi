import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { appLog, scrubError } from "@/lib/logger";

// PATCH /api/admin/users/:id — update user (admin only)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const data = await req.json();

    // Only allow specific fields
    const allowed: Record<string, string | boolean> = {};
    if (data.name !== undefined) allowed.name = data.name;
    if (data.role !== undefined) allowed.role = data.role;
    if (data.clinicianType !== undefined) allowed.clinicianType = data.clinicianType;
    if (data.credentials !== undefined) allowed.credentials = data.credentials;
    if (data.isActive !== undefined) allowed.isActive = data.isActive;

    const user = await prisma.user.update({ where: { id }, data: allowed });

    await auditLog({
      userId: session.user.id,
      action: "UPDATE_USER",
      resource: `user:${id}`,
      details: { fields: Object.keys(allowed) },
    });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, isActive: user.isActive } });
  } catch (error) {
    appLog('error', 'PATCH /api/admin/users/:id', scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
