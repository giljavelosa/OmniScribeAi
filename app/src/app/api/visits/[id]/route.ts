import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { appLog, scrubError } from "@/lib/logger";
import { canEditVisit, canViewVisit, SHARE_AUDIT_ACTIONS } from "@/lib/visit-access";
import { deriveSectionEditEvents, recordStyleFeedbackEventsBatch } from "@/lib/style-learning";

const MIN_DOCUMENTED_FACTS = 3;
const MIN_EVIDENCE_COVERAGE = 0.3;

type FinalizeValidationInput = {
  documentedFactCount?: unknown;
  evidenceLinkedCount?: unknown;
};

type FinalizeComplianceInput = {
  missing?: Array<{ category?: string; emrProvided?: boolean }>;
};

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
        shareGrants: {
          where: { revokedAt: null },
          select: { granteeUserId: true, revokedAt: true, permission: true },
        },
      },
    });

    if (!visit) return NextResponse.json({ error: "Visit not found" }, { status: 404 });

    const viewDecision = canViewVisit(
      {
        userId: visit.userId,
        organizationId: visit.organizationId,
        visibility: visit.visibility,
      },
      {
        id: session.user.id,
        role: session.user.role,
        organizationId: session.user.organizationId,
      },
      visit.shareGrants,
    );

    if (!viewDecision.allowed) {
      await auditLog({
        userId: session.user.id,
        action: SHARE_AUDIT_ACTIONS.denyShared,
        resource: `visit:${id}`,
        details: { reason: viewDecision.reason },
      });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await auditLog({
      userId: session.user.id,
      action: viewDecision.reason === "owner" || viewDecision.reason === "admin"
        ? "VIEW_VISIT"
        : SHARE_AUDIT_ACTIONS.viewShared,
      resource: `visit:${visit.id}`,
      details: { reason: viewDecision.reason },
    });

    return NextResponse.json(
      { visit },
      { headers: { "Cache-Control": "no-store" } },
    );
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

    const existing = await prisma.visit.findUnique({
      where: { id },
      select: {
        userId: true,
        organizationId: true,
        visibility: true,
        finalizedAt: true,
        status: true,
        noteData: true,
        templateId: true,
      },
    });
    if (!existing) return NextResponse.json({ error: "Visit not found" }, { status: 404 });

    const editDecision = canEditVisit(
      existing,
      { id: session.user.id, role: session.user.role, organizationId: session.user.organizationId },
    );
    if (!editDecision.allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();

    // Finalized charts must only be changed through amendment flow for traceability.
    if (existing.finalizedAt) {
      return NextResponse.json(
        { error: "Finalized visits are read-only. Use the amendment workflow." },
        { status: 409 },
      );
    }

    const isFinalizing = data.status === "FINALIZED" || Boolean(data.finalizedAt);
    if (isFinalizing) {
      const noteData = data.noteData;
      if (!Array.isArray(noteData) || noteData.length === 0) {
        return NextResponse.json(
          { error: "Cannot finalize: note data is missing or empty", code: "FINALIZE_NOTE_REQUIRED" },
          { status: 409 },
        );
      }

      const validation = (data.validation ?? {}) as FinalizeValidationInput;
      const documentedFactCount =
        typeof validation.documentedFactCount === "number" ? validation.documentedFactCount : null;
      const evidenceLinkedCount =
        typeof validation.evidenceLinkedCount === "number" ? validation.evidenceLinkedCount : null;
      if (documentedFactCount === null || evidenceLinkedCount === null) {
        return NextResponse.json(
          { error: "Cannot finalize: validation metrics are required", code: "FINALIZE_VALIDATION_REQUIRED" },
          { status: 409 },
        );
      }
      if (documentedFactCount < MIN_DOCUMENTED_FACTS) {
        return NextResponse.json(
          {
            error: `Cannot finalize: only ${documentedFactCount} documented facts (minimum ${MIN_DOCUMENTED_FACTS})`,
            code: "FINALIZE_MIN_FACTS",
          },
          { status: 409 },
        );
      }
      const evidenceCoverage = documentedFactCount > 0 ? evidenceLinkedCount / documentedFactCount : 0;
      if (evidenceCoverage < MIN_EVIDENCE_COVERAGE) {
        return NextResponse.json(
          {
            error: `Cannot finalize: evidence coverage ${Math.round(evidenceCoverage * 100)}% is below required ${Math.round(MIN_EVIDENCE_COVERAGE * 100)}%`,
            code: "FINALIZE_EVIDENCE_LOW",
          },
          { status: 409 },
        );
      }

      const compliance = (data.compliance ?? {}) as FinalizeComplianceInput;
      const criticalMissing = Array.isArray(compliance.missing)
        ? compliance.missing.filter((item) => item?.category === "critical" && item?.emrProvided !== true).length
        : null;
      if (criticalMissing === null) {
        return NextResponse.json(
          { error: "Cannot finalize: compliance summary is required", code: "FINALIZE_COMPLIANCE_REQUIRED" },
          { status: 409 },
        );
      }
      if (criticalMissing > 0) {
        return NextResponse.json(
          {
            error: `Cannot finalize: ${criticalMissing} critical compliance item(s) remain unresolved`,
            code: "FINALIZE_CRITICAL_MISSING",
          },
          { status: 409 },
        );
      }
    }

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

    if (data.noteData !== undefined) {
      const styleEvents = deriveSectionEditEvents({
        userId: session.user.id,
        visitId: id,
        templateId: existing.templateId,
        previousNoteData: existing.noteData as { title: string; content: string }[] || [],
        nextNoteData: data.noteData as { title: string; content: string }[] || [],
      });
      await recordStyleFeedbackEventsBatch(styleEvents);
    }

    return NextResponse.json(
      { visit },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    appLog('error', 'PATCH /api/visits/:id', scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
