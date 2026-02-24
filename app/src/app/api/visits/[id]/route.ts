import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/visits/:id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const visit = await prisma.visit.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            coverages: { where: { isActive: true }, orderBy: { rank: "asc" } },
            allergies: { where: { status: "active" } },
            medications: { where: { status: "active" } },
            conditions: { where: { status: "active" } },
          },
        },
        user: { select: { name: true, clinicianType: true, credentials: true } },
      },
    });

    if (!visit) return NextResponse.json({ error: "Visit not found" }, { status: 404 });

    await auditLog({
      userId: session.user.id,
      action: "VIEW_VISIT",
      resource: `visit:${visit.id}`,
    });

    return NextResponse.json({ visit });
  } catch (error) {
    console.error("[GET /api/visits/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/visits/:id — update visit
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const data = await req.json();

    delete data.id;
    delete data.createdAt;
    delete data.userId;
    delete data.patientId;

    const visit = await prisma.visit.update({ where: { id }, data });

    await auditLog({
      userId: session.user.id,
      action: "UPDATE_VISIT",
      resource: `visit:${visit.id}`,
      details: { fields: Object.keys(data) },
    });

    return NextResponse.json({ visit });
  } catch (error) {
    console.error("[PATCH /api/visits/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
