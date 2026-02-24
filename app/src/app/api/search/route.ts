import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { appLog, scrubError } from "@/lib/logger";

// GET /api/search?q=<query> — unified search across patients + visits
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const query = (req.nextUrl.searchParams.get("q") || "").trim();
  if (query.length < 2) {
    return NextResponse.json({ success: true, patients: [], visits: [] });
  }

  try {
    // Build ownership filter (mirrors /api/patients scoping)
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
        ownershipFilter = { visits: { some: { userId: session.user.id } } };
      }
    }

    const searchFilter = {
      OR: [
        { identifier: { contains: query, mode: "insensitive" as const } },
        { firstName: { contains: query, mode: "insensitive" as const } },
        { lastName: { contains: query, mode: "insensitive" as const } },
      ],
    };

    // Search patients (max 5)
    const patients = await prisma.patient.findMany({
      where: { AND: [ownershipFilter, searchFilter] },
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        identifier: true,
        firstName: true,
        lastName: true,
        _count: { select: { visits: true } },
      },
    });

    // Search visits by user (most recent, matching patient names, max 5)
    const visitWhere: Record<string, unknown> = { userId: session.user.id };
    if (!isAdmin) {
      visitWhere.userId = session.user.id;
    }

    const visits = await prisma.visit.findMany({
      where: {
        ...visitWhere,
        patient: searchFilter,
      },
      take: 5,
      orderBy: { date: "desc" },
      select: {
        id: true,
        frameworkId: true,
        domain: true,
        date: true,
        status: true,
        patient: {
          select: { id: true, identifier: true, firstName: true, lastName: true },
        },
      },
    });

    return NextResponse.json({ success: true, patients, visits });
  } catch (error) {
    appLog("error", "GET /api/search", scrubError(error));
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
