import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// POST /api/visits/:id/amend — add amendment to finalized note
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { reason, changes } = await req.json();

  if (!reason?.trim()) {
    return NextResponse.json({ error: "Amendment reason is required" }, { status: 400 });
  }
  if (!changes || changes.length === 0) {
    return NextResponse.json({ error: "At least one change is required" }, { status: 400 });
  }

  // Fetch current visit
  const visit = await prisma.visit.findUnique({ where: { id } });
  if (!visit) return NextResponse.json({ error: "Visit not found" }, { status: 404 });
  if (!visit.finalizedAt) {
    return NextResponse.json({ error: "Only finalized notes can be amended" }, { status: 400 });
  }

  const userName = (session.user as any).name || (session.user as any).email || "Unknown";
  const userId = (session.user as any).id;

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
  const existingAmendments = (visit.amendments as any[]) || [];
  const updatedAmendments = [...existingAmendments, amendment];

  // Apply changes to noteData
  let updatedNoteData = (visit.noteData as any[]) || [];
  for (const change of changes) {
    updatedNoteData = updatedNoteData.map((section: any) => {
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
      amendments: updatedAmendments,
      noteData: updatedNoteData,
      status: "AMENDED",
    },
  });

  await auditLog({
    userId,
    action: "AMEND_VISIT",
    resource: "visit:" + visit.id,
    details: { amendmentId: amendment.id, reason: amendment.reason, sectionsChanged: changes.map((c: any) => c.section) },
  });

  return NextResponse.json({ success: true, amendment, visit: updatedVisit });
}
