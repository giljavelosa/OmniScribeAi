import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { appLog, scrubError } from "@/lib/logger";
import { canAccessPatient } from "@/lib/patient-access";

// GET /api/patients/:id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const accessProbe = await prisma.patient.findUnique({
      where: { id },
      select: {
        id: true,
        organizationId: true,
        visits: { where: { userId: session.user.id }, select: { userId: true }, take: 1 },
      },
    });
    if (!accessProbe) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

    const decision = canAccessPatient(accessProbe, {
      id: session.user.id,
      role: session.user.role,
      organizationId: session.user.organizationId,
    });
    if (!decision.allowed) {
      await auditLog({
        userId: session.user.id,
        action: "VIEW_PATIENT_DENIED",
        resource: `patient:${id}`,
        details: { reason: decision.reason },
      });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        coverages: { orderBy: { rank: "asc" } },
        allergies: { where: { status: "active" } },
        medications: { where: { status: "active" } },
        conditions: { where: { status: "active" } },
        visits: { orderBy: { date: "desc" }, take: 20, select: { id: true, date: true, frameworkId: true, domain: true, status: true, summary: true } },
        documents: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

    await auditLog({
      userId: session.user.id,
      action: "VIEW_PATIENT",
      resource: `patient:${patient.id}`,
      details: { reason: decision.reason },
    });

    return NextResponse.json({ patient }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    appLog('error', 'GET /api/patients/:id', scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/patients/:id
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const accessProbe = await prisma.patient.findUnique({
      where: { id },
      select: {
        id: true,
        organizationId: true,
        visits: { where: { userId: session.user.id }, select: { userId: true }, take: 1 },
      },
    });
    if (!accessProbe) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

    const decision = canAccessPatient(accessProbe, {
      id: session.user.id,
      role: session.user.role,
      organizationId: session.user.organizationId,
    });
    if (!decision.allowed) {
      await auditLog({
        userId: session.user.id,
        action: "UPDATE_PATIENT_DENIED",
        resource: `patient:${id}`,
        details: { reason: decision.reason },
      });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();

    // Allowlist: only permit demographic fields
    const ALLOWED_FIELDS = [
      'identifier', 'mrn', 'firstName', 'lastName', 'middleName', 'prefix', 'suffix',
      'dateOfBirth', 'gender', 'phone', 'phoneSecondary', 'email',
      'addressLine1', 'addressLine2', 'city', 'state', 'zip', 'country',
      'preferredLanguage', 'maritalStatus',
      'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelation',
      'pcpName', 'pcpPhone', 'pcpFax', 'referringProvider', 'referringProviderNpi',
    ] as const;

    const allowed: Record<string, unknown> = {};
    for (const field of ALLOWED_FIELDS) {
      if (data[field] !== undefined) allowed[field] = data[field];
    }
    if (allowed.dateOfBirth) allowed.dateOfBirth = new Date(allowed.dateOfBirth as string);

    const patient = await prisma.patient.update({
      where: { id },
      data: allowed,
    });

    await auditLog({
      userId: session.user.id,
      action: "UPDATE_PATIENT",
      resource: `patient:${patient.id}`,
      details: { fields: Object.keys(allowed), reason: decision.reason },
    });

    return NextResponse.json({ patient }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    appLog('error', 'PATCH /api/patients/:id', scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
