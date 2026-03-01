import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { fail, ok } from "@/lib/api-contract";
import { prisma } from "@/lib/db";
import { frameworks } from "@/lib/frameworks";
import { NextRequest } from "next/server";
import { appLog, scrubError } from "@/lib/logger";

// GET /api/visits — list visits for current user
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return fail("AUTH_UNAUTHORIZED", "Unauthorized", 401);

  try {
    const patientId = req.nextUrl.searchParams.get("patientId");
    const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "50") || 50, 100);

    const where: { userId: string; patientId?: string } = { userId: session.user.id };
    if (patientId) where.patientId = patientId;

    const visits = await prisma.visit.findMany({
      where,
      take: limit,
      orderBy: { date: "desc" },
      include: {
        patient: { select: { id: true, identifier: true, firstName: true, lastName: true } },
      },
    });

    return ok({ visits });
  } catch (error) {
    appLog('error', 'GET /api/visits', scrubError(error));
    return fail("INTERNAL_ERROR", "Internal server error", 500);
  }
}

// POST /api/visits — create/save a visit
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return fail("AUTH_UNAUTHORIZED", "Unauthorized", 401);

  try {
    const data = await req.json();

    if (!data.patientId || !data.frameworkId) {
      return fail("VISIT_VALIDATION_FAILED", "patientId and frameworkId required", 400);
    }

    // Validate frameworkId: must be a known framework or 'custom'
    const isKnownFramework = frameworks.some(f => f.id === data.frameworkId);
    if (!isKnownFramework && data.frameworkId !== 'custom') {
      return fail("VISIT_VALIDATION_FAILED", "Invalid frameworkId: must be a known framework or 'custom'", 400);
    }

    const visit = await prisma.visit.create({
      data: {
        patientId: data.patientId,
        userId: session.user.id,
        frameworkId: data.frameworkId,
        domain: data.domain || "medical",
        date: data.date ? new Date(data.date) : new Date(),
        duration: data.duration || null,
        status: data.status || "RECORDING",
        transcript: data.transcript || null,
        transcriptSource: data.transcriptSource || null,
        transcriptConfidence: data.transcriptConfidence || null,
        extractedFacts: data.extractedFacts || null,
        clinicalSynthesis: data.clinicalSynthesis || null,
        parsedData: data.parsedData || null,
        noteData: data.noteData || null,
        auditResult: data.auditResult || null,
        cmsScore: data.cmsScore || null,
        summary: data.summary || null,
        generationTime: data.generationTime || null,
        templateId: data.templateId || null,
        templateSnapshotJson: data.templateSnapshotJson || null,
      },
    });

    await auditLog({
      userId: session.user.id,
      action: "CREATE_VISIT",
      resource: `visit:${visit.id}`,
      details: { frameworkId: data.frameworkId, patientId: data.patientId, templateId: data.templateId || undefined },
    });

    return ok({ visit }, { status: 201 });
  } catch (error) {
    appLog('error', 'POST /api/visits', scrubError(error));
    return fail("INTERNAL_ERROR", "Internal server error", 500);
  }
}
