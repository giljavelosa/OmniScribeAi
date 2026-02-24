import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { appLog, scrubError } from "@/lib/logger";

// GET /api/patients/:id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        coverages: { orderBy: { rank: "asc" } },
        allergies: { where: { status: "active" } },
        medications: { where: { status: "active" } },
        conditions: { where: { status: "active" } },
        visits: { orderBy: { date: "desc" }, take: 20, select: { id: true, date: true, frameworkId: true, domain: true, status: true, summary: true } },
        documents: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

    await auditLog({
      userId: session.user.id,
      action: "VIEW_PATIENT",
      resource: `patient:${patient.id}`,
    });

    return NextResponse.json({ patient });
  } catch (error) {
    appLog('error', 'GET /api/patients/:id', scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/patients/:id
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const data = await req.json();

    // Remove fields that shouldn't be directly updated
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    if (data.dateOfBirth) data.dateOfBirth = new Date(data.dateOfBirth);

    const patient = await prisma.patient.update({
      where: { id },
      data,
    });

    await auditLog({
      userId: session.user.id,
      action: "UPDATE_PATIENT",
      resource: `patient:${patient.id}`,
      details: { fields: Object.keys(data) },
    });

    return NextResponse.json({ patient });
  } catch (error) {
    appLog('error', 'PATCH /api/patients/:id', scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
