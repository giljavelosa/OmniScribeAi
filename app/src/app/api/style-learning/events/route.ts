import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ClinicianStyleEventType, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canEditVisit } from "@/lib/visit-access";
import { appLog, scrubError } from "@/lib/logger";
import { recordStyleFeedbackEvent } from "@/lib/style-learning";

const eventSchema = z.object({
  eventType: z.nativeEnum(ClinicianStyleEventType),
  visitId: z.string().min(1).optional(),
  templateId: z.string().min(1).optional(),
  sectionKey: z.string().max(100).optional(),
  sectionTitle: z.string().max(100).optional(),
  snippetBefore: z.string().max(1000).optional(),
  snippetAfter: z.string().max(1000).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = eventSchema.parse(await request.json());

    if (payload.visitId) {
      const visit = await prisma.visit.findUnique({
        where: { id: payload.visitId },
        select: { id: true, userId: true, organizationId: true, visibility: true, templateId: true },
      });

      if (!visit) {
        return NextResponse.json({ success: false, error: "Visit not found", code: "NOT_FOUND" }, { status: 404 });
      }

      const decision = canEditVisit(visit, {
        id: session.user.id,
        role: session.user.role,
        organizationId: session.user.organizationId,
      });
      if (!decision.allowed) {
        return NextResponse.json({ success: false, error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
      }
    }

    await recordStyleFeedbackEvent({
      userId: session.user.id,
      eventType: payload.eventType,
      visitId: payload.visitId,
      templateId: payload.templateId,
      sectionKey: payload.sectionKey,
      sectionTitle: payload.sectionTitle,
      snippetBefore: payload.snippetBefore,
      snippetAfter: payload.snippetAfter,
      metadata: (payload.metadata as Prisma.InputJsonValue | undefined) ?? undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid style feedback payload", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }
    appLog("error", "StyleLearningEventsRoute", "Failed to record style feedback event", {
      error: scrubError(error),
      userId: session.user.id,
    });
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

