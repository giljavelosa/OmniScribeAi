import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { appLog, scrubError } from "@/lib/logger";

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

    if (visit.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await auditLog({
      userId: session.user.id,
      action: "VIEW_VISIT",
      resource: `visit:${visit.id}`,
    });

    return NextResponse.json({ visit });
  } catch (error) {
    appLog('error', 'GET /api/visits/:id', scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/visits/:id — update visit
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;

    const existing = await prisma.visit.findUnique({ where: { id }, select: { userId: true } });
    if (!existing) return NextResponse.json({ error: "Visit not found" }, { status: 404 });

    if (existing.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();

    // Allowlist: only permit clinical update fields
    const ALLOWED_FIELDS = [
      'status', 'transcript', 'transcriptSource', 'transcriptConfidence',
      'extractedFacts', 'clinicalSynthesis', 'parsedData', 'noteData', 'auditResult',
      'cmsScore', 'summary', 'generationTime', 'duration',
      'finalizedAt', 'finalizedBy',
      'templateId', 'templateSnapshotJson',
    ] as const;

    const allowed: Record<string, unknown> = {};
    for (const field of ALLOWED_FIELDS) {
      if (data[field] !== undefined) allowed[field] = data[field];
    }

    const visit = await prisma.visit.update({ where: { id }, data: allowed });

    await auditLog({
      userId: session.user.id,
      action: "UPDATE_VISIT",
      resource: `visit:${visit.id}`,
      details: { fields: Object.keys(allowed) },
    });

    return NextResponse.json({ visit });
  } catch (error) {
    appLog('error', 'PATCH /api/visits/:id', scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
