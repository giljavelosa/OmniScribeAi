import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// GET /api/admin/users — list all users (admin only)
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, name: true, role: true,
        clinicianType: true, credentials: true, isActive: true,
        lastLoginAt: true, createdAt: true, mustChangePassword: true,
        _count: { select: { visits: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[GET /api/admin/users]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/users — create user (admin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await req.json();
    if (!data.email || !data.password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

    const hash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hash,
        name: data.name || null,
        role: data.role || "CLINICIAN",
        clinicianType: data.clinicianType || null,
        credentials: data.credentials || null,
        mustChangePassword: true,
      },
    });

    await auditLog({
      userId: session.user.id,
      action: "CREATE_USER",
      resource: `user:${user.id}`,
      details: { email: user.email, role: user.role },
    });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/users]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
