import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { frameworks } from "@/lib/frameworks";
import { NextRequest, NextResponse } from "next/server";
import { appLog, scrubError } from "@/lib/logger";
import type { Prisma, VisitVisibility } from "@prisma/client";

// GET /api/visits — list visits for current user
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const patientId = req.nextUrl.searchParams.get("patientId");
    const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "50") || 50, 100);
    const isAdmin = session.user.role === "ADMIN";

    const filters: Prisma.VisitWhereInput[] = [];
    if (patientId) filters.push({ patientId });

    if (!isAdmin) {
      const accessOr: Prisma.VisitWhereInput[] = [{ userId: session.user.id }];

      if (session.user.organizationId) {
        accessOr.push({
          visibility: "organization",
          organizationId: session.user.organizationId,
        });
      }

      accessOr.push({
        visibility: "restricted",
        shareGrants: {
          some: {
            granteeUserId: session.user.id,
            revokedAt: null,
          },
        },
      });

      filters.push({ OR: accessOr });
    }

    const where: Prisma.VisitWhereInput = filters.length > 0 ? { AND: filters } : {};

    const visits = await prisma.visit.findMany({
      where,
      take: limit,
      orderBy: { date: "desc" },
      include: {
        patient: { select: { id: true, identifier: true, firstName: true, lastName: true } },
        user: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      { visits },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    appLog('error', 'GET /api/visits', scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/visits — create/save a visit
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();

    if (!data.patientId || !data.frameworkId) {
      return NextResponse.json({ error: "patientId and frameworkId required" }, { status: 400 });
    }

    // Validate frameworkId: must be a known framework or 'custom'
    const isKnownFramework = frameworks.some(f => f.id === data.frameworkId);
    if (!isKnownFramework && data.frameworkId !== 'custom') {
      return NextResponse.json({ error: "Invalid frameworkId: must be a known framework or 'custom'" }, { status: 400 });
    }

    const visibilityFromInput = typeof data.visibility === "string" ? data.visibility : "private";
    const allowedVisibility: VisitVisibility[] = ["private", "organization", "restricted"];
    const visibility: VisitVisibility = allowedVisibility.includes(visibilityFromInput as VisitVisibility)
      ? (visibilityFromInput as VisitVisibility)
      : "private";

    const visit = await prisma.visit.create({
      data: {
        patientId: data.patientId,
        userId: session.user.id,
        organizationId: session.user.organizationId || null,
        visibility,
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
      details: {
        frameworkId: data.frameworkId,
        patientId: data.patientId,
        templateId: data.templateId || undefined,
        visibility,
      },
    });

    return NextResponse.json(
      { visit },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    appLog('error', 'POST /api/visits', scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
