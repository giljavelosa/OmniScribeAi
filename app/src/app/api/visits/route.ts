import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/visits — list visits for current user
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const patientId = req.nextUrl.searchParams.get("patientId");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");

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

  return NextResponse.json({ visits });
}

// POST /api/visits — create/save a visit
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  if (!data.patientId || !data.frameworkId) {
    return NextResponse.json({ error: "patientId and frameworkId required" }, { status: 400 });
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
    },
  });

  await auditLog({
    userId: session.user.id,
    action: "CREATE_VISIT",
    resource: `visit:${visit.id}`,
    details: { frameworkId: data.frameworkId, patientId: data.patientId },
  });

  return NextResponse.json({ visit }, { status: 201 });
}
