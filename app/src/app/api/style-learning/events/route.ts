import { NextRequest, NextResponse } from "next/server";
import { ClinicianStyleEventType } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canEditVisit } from "@/lib/visit-access";
import { recordStyleFeedbackEvent } from "@/lib/style-learning";
import { appLog, scrubError } from "@/lib/logger";

const VALID_EVENT_TYPES = new Set<string>(
  Object.values(ClinicianStyleEventType),
);

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { eventType, visitId, sectionKey, sectionTitle, snippetBefore, snippetAfter, metadata } = body;

    if (!eventType || !VALID_EVENT_TYPES.has(eventType)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing eventType" },
        { status: 400 },
      );
    }

    if (visitId) {
      const visit = await prisma.visit.findUnique({
        where: { id: visitId },
        select: { id: true, userId: true, organizationId: true, visibility: true, templateId: true },
      });

      if (!visit) {
        return NextResponse.json(
          { success: false, error: "Visit not found" },
          { status: 404 },
        );
      }

      const access = canEditVisit(
        visit,
        { id: session.user.id, role: session.user.role ?? "CLINICIAN", organizationId: null },
      );

      if (!access.allowed) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 },
        );
      }
    }

    await recordStyleFeedbackEvent({
      userId: session.user.id,
      visitId: visitId ?? "",
      templateId: null,
      sectionTitle: sectionTitle ?? sectionKey ?? "",
      eventType,
      previousContent: snippetBefore,
      nextContent: snippetAfter,
      metadata,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    appLog("error", "POST /api/style-learning/events", scrubError(err));
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
