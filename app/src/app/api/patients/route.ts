import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { appLog, scrubError } from "@/lib/logger";

// GET /api/patients — list/search patients (scoped to user's organization)
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const search = req.nextUrl.searchParams.get("q") || "";
    const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "50") || 50, 100);

    // Build ownership filter:
    // - Admins see all patients
    // - If user has an org, scope to that org's patients
    // - Otherwise, scope to patients the user has visits with
    const isAdmin = session.user.role === "ADMIN";
    let ownershipFilter = {};

    if (!isAdmin) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { organizationId: true },
      });

      if (user?.organizationId) {
        ownershipFilter = { organizationId: user.organizationId };
      } else {
        // No org — only show patients this user has visits with
        ownershipFilter = { visits: { some: { userId: session.user.id } } };
      }
    }

    const searchFilter = search
      ? {
          OR: [
            { identifier: { contains: search, mode: "insensitive" as const } },
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const patients = await prisma.patient.findMany({
      where: { AND: [ownershipFilter, searchFilter] },
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        coverages: { where: { isActive: true }, orderBy: { rank: "asc" }, take: 1 },
        _count: { select: { visits: true } },
      },
    });

    return NextResponse.json({ patients });
  } catch (error) {
    appLog('error', 'GET /api/patients', scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/patients — create patient
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();

    if (!data.identifier?.trim()) {
      return NextResponse.json({ error: "Patient identifier is required" }, { status: 400 });
    }

    // Link patient to user's organization if available
    let organizationId: string | null = null;
    if (!data.organizationId) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { organizationId: true },
      });
      organizationId = user?.organizationId || null;
    }

    const patient = await prisma.patient.create({
      data: {
        identifier: data.identifier.trim(),
        mrn: data.mrn || null,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        middleName: data.middleName || null,
        prefix: data.prefix || null,
        suffix: data.suffix || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender || null,
        phone: data.phone || null,
        email: data.email || null,
        addressLine1: data.addressLine1 || null,
        addressLine2: data.addressLine2 || null,
        city: data.city || null,
        state: data.state || null,
        zip: data.zip || null,
        preferredLanguage: data.preferredLanguage || "en",
        maritalStatus: data.maritalStatus || null,
        emergencyContactName: data.emergencyContactName || null,
        emergencyContactPhone: data.emergencyContactPhone || null,
        emergencyContactRelation: data.emergencyContactRelation || null,
        pcpName: data.pcpName || null,
        pcpPhone: data.pcpPhone || null,
        referringProvider: data.referringProvider || null,
        referringProviderNpi: data.referringProviderNpi || null,
        organizationId,
      },
    });

    await auditLog({
      userId: session.user.id,
      action: "CREATE_PATIENT",
      resource: `patient:${patient.id}`,
    });

    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    appLog('error', 'POST /api/patients', scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
