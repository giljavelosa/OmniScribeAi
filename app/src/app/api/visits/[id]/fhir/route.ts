import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { appLog, errorCode, scrubError } from "@/lib/logger";
import { canViewVisit, SHARE_AUDIT_ACTIONS } from "@/lib/visit-access";
import { getEntitlementSnapshot, enforceFeature } from "@/lib/billing/entitlements";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/fhir+json",
};

function toIsoDate(value: Date | string | null | undefined): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const entitlements = await getEntitlementSnapshot(session.user.id);
  const featureCheck = enforceFeature(entitlements, "fhir_export");
  if (!featureCheck.allowed) {
    return NextResponse.json(
      { success: false, error: featureCheck.message, code: featureCheck.code, requiredPlan: featureCheck.requiredPlan },
      { status: 403 },
    );
  }

  try {
    const { id } = await params;
    const visit = await prisma.visit.findUnique({
      where: { id },
      include: {
        patient: true,
        user: { select: { id: true, name: true, clinicianType: true, credentials: true } },
        shareGrants: { where: { revokedAt: null }, select: { granteeUserId: true, revokedAt: true, permission: true } },
      },
    });

    if (!visit) {
      return NextResponse.json({ success: false, error: "Visit not found" }, { status: 404 });
    }

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
        resource: `visit:${visit.id}`,
        details: { reason: viewDecision.reason, operation: "export_fhir" },
      });
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const patientName = [visit.patient.firstName, visit.patient.lastName].filter(Boolean).join(" ").trim();
    const encounterDate = toIsoDate(visit.date);
    const finalizedAt = toIsoDate(visit.finalizedAt);

    const bundle = {
      resourceType: "Bundle",
      type: "collection",
      timestamp: new Date().toISOString(),
      entry: [
        {
          resource: {
            resourceType: "Patient",
            id: visit.patient.id,
            identifier: [{ system: "https://omniscribe.ai/patient-identifier", value: visit.patient.identifier }],
            name: patientName ? [{ text: patientName }] : undefined,
            gender: visit.patient.gender ? String(visit.patient.gender).toLowerCase() : undefined,
            birthDate: toIsoDate(visit.patient.dateOfBirth),
          },
        },
        {
          resource: {
            resourceType: "Practitioner",
            id: visit.user.id,
            name: visit.user.name ? [{ text: visit.user.name }] : undefined,
            qualification: visit.user.credentials
              ? [{ code: { text: visit.user.credentials } }]
              : undefined,
          },
        },
        {
          resource: {
            resourceType: "Encounter",
            id: visit.id,
            status: visit.status === "FINALIZED" || visit.status === "AMENDED" ? "finished" : "in-progress",
            class: { code: "AMB", display: "ambulatory" },
            subject: { reference: `Patient/${visit.patient.id}` },
            participant: [{ individual: { reference: `Practitioner/${visit.user.id}` } }],
            period: {
              start: encounterDate,
              end: finalizedAt ?? encounterDate,
            },
            reasonCode: visit.summary ? [{ text: visit.summary }] : undefined,
          },
        },
        {
          resource: {
            resourceType: "Composition",
            id: `${visit.id}-composition`,
            status: visit.status === "FINALIZED" || visit.status === "AMENDED" ? "final" : "preliminary",
            type: { text: visit.frameworkId },
            subject: { reference: `Patient/${visit.patient.id}` },
            date: finalizedAt ?? encounterDate ?? new Date().toISOString(),
            author: [{ reference: `Practitioner/${visit.user.id}` }],
            title: "OmniScribe Clinical Note Export",
            section: Array.isArray(visit.noteData)
              ? visit.noteData.map((item) => ({
                  title:
                    item && typeof item === "object" && "title" in item ? String(item.title ?? "") : "Section",
                  text: {
                    status: "generated",
                    div:
                      item && typeof item === "object" && "content" in item
                        ? `<div>${escapeXml(String(item.content ?? ""))}</div>`
                        : "<div></div>",
                  },
                }))
              : [],
          },
        },
      ],
    };

    await auditLog({
      userId: session.user.id,
      action: "EXPORT_VISIT_FHIR",
      resource: `visit:${visit.id}`,
      details: { reason: viewDecision.reason },
    });

    return new NextResponse(JSON.stringify(bundle), { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    const code = errorCode();
    appLog("error", "VisitFhirExport", "Failed to export visit in FHIR format", {
      code,
      error: scrubError(error),
    });
    return NextResponse.json({ success: false, error: "Internal server error", code }, { status: 500 });
  }
}
