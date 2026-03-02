import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { appLog, scrubError } from "@/lib/logger";
import { ClinicianStyleEventType, Prisma } from "@prisma/client";
import { canEditVisit } from "@/lib/visit-access";
import { recordStyleFeedbackEventsBatch } from "@/lib/style-learning";

interface NoteDataSection {
  title: string;
  content: string;
}

interface AmendmentChange {
  section: string;
  oldContent: string;
  newContent: string;
}

// POST /api/visits/:id/amend — add amendment to finalized note
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { reason, changes } = await req.json();

    if (!reason?.trim()) {
      return NextResponse.json({ error: "Amendment reason is required" }, { status: 400 });
    }
    if (!Array.isArray(changes) || changes.length === 0) {
      return NextResponse.json({ error: "At least one change is required" }, { status: 400 });
    }
    if (changes.length > 50) {
      return NextResponse.json({ error: "Too many changes in a single amendment" }, { status: 400 });
    }

    // Fetch current visit
    const visit = await prisma.visit.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        organizationId: true,
        visibility: true,
        finalizedAt: true,
        amendments: true,
        noteData: true,
      },
    });
    if (!visit) return NextResponse.json({ error: "Visit not found" }, { status: 404 });

    const editDecision = canEditVisit(
      visit,
      { id: session.user.id, role: session.user.role, organizationId: session.user.organizationId },
    );
    if (!editDecision.allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!visit.finalizedAt) {
      return NextResponse.json({ error: "Only finalized notes can be amended" }, { status: 400 });
    }

    const userName = session.user.name || session.user.email || "Unknown";
    const userId = session.user.id;

    const existingSections = Array.isArray(visit.noteData)
      ? ((visit.noteData as Prisma.JsonArray) as unknown as NoteDataSection[])
      : [];
    const existingTitles = new Set(existingSections.map((section) => section.title));

    for (const change of changes as AmendmentChange[]) {
      if (!change || typeof change.section !== "string" || typeof change.newContent !== "string") {
        return NextResponse.json({ error: "Invalid amendment change payload" }, { status: 400 });
      }
      if (!existingTitles.has(change.section)) {
        return NextResponse.json(
          { error: `Section "${change.section}" does not exist in the finalized note` },
          { status: 400 },
        );
      }
      if (change.newContent.trim().length === 0) {
        return NextResponse.json(
          { error: `Section "${change.section}" cannot be set to empty content` },
          { status: 400 },
        );
      }
    }

    // Build amendment record
    const amendment = {
      id: "amend-" + Date.now(),
      timestamp: new Date().toISOString(),
      authorId: userId,
      authorName: userName,
      reason: reason.trim(),
      changes, // [{section, oldContent, newContent}]
    };

    // Append to existing amendments array
    const existingAmendments = (visit.amendments as Prisma.JsonArray) || [];
    const updatedAmendments = [...existingAmendments, amendment as unknown as Prisma.JsonValue];

    // Apply changes to noteData
    let updatedNoteData = existingSections;
    for (const change of changes as AmendmentChange[]) {
      updatedNoteData = updatedNoteData.map((section: NoteDataSection) => {
        if (section.title === change.section) {
          return { ...section, content: change.newContent };
        }
        return section;
      });
    }

    // Update visit
    const updatedVisit = await prisma.visit.update({
      where: { id },
      data: {
        amendments: updatedAmendments as unknown as Prisma.InputJsonValue,
        noteData: updatedNoteData as unknown as Prisma.InputJsonValue,
        status: "AMENDED",
      },
    });

    await auditLog({
      userId,
      action: "AMEND_VISIT",
      resource: "visit:" + visit.id,
      details: { amendmentId: amendment.id, reason: amendment.reason, sectionsChanged: changes.map((c: AmendmentChange) => c.section) },
    });

    await recordStyleFeedbackEventsBatch(
      (changes as AmendmentChange[]).map((change) => ({
        userId,
        visitId: visit.id,
        eventType: ClinicianStyleEventType.amendment,
        sectionKey: change.section,
        sectionTitle: change.section,
        snippetBefore: change.oldContent,
        snippetAfter: change.newContent,
        metadata: {
          source: "amendment",
          reason: reason.trim(),
          amendmentId: amendment.id,
        },
      })),
    );

    return NextResponse.json(
      { success: true, amendment, visit: updatedVisit },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    appLog('error', 'POST /api/visits/:id/amend', scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
