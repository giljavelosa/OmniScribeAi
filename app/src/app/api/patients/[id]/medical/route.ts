import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { appLog, scrubError } from "@/lib/logger";

// POST /api/patients/:id/medical — add allergy, medication, condition, or coverage
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { type, ...data } = await req.json();

    let result;
    switch (type) {
      case "allergy":
        result = await prisma.allergy.create({ data: { patientId: id, substance: data.substance, reaction: data.reaction, severity: data.severity } });
        break;
      case "medication":
        result = await prisma.medication.create({ data: { patientId: id, name: data.name, dose: data.dose, frequency: data.frequency, route: data.route, prescriber: data.prescriber } });
        break;
      case "condition":
        result = await prisma.condition.create({ data: { patientId: id, description: data.description, icdCode: data.icdCode } });
        break;
      case "coverage":
        result = await prisma.coverage.create({ data: { patientId: id, payerName: data.payerName, memberId: data.memberId, groupNumber: data.groupNumber, planName: data.planName, planType: data.planType, rank: data.rank || 1 } });
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    await auditLog({
      userId: session.user.id,
      action: `ADD_${type.toUpperCase()}`,
      resource: `patient:${id}`,
    });

    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    appLog('error', 'POST /api/patients/:id/medical', scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/patients/:id/medical — remove by itemId and type
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { type, itemId } = await req.json();

    switch (type) {
      case "allergy": await prisma.allergy.delete({ where: { id: itemId, patientId: id } }); break;
      case "medication": await prisma.medication.delete({ where: { id: itemId, patientId: id } }); break;
      case "condition": await prisma.condition.delete({ where: { id: itemId, patientId: id } }); break;
      case "coverage": await prisma.coverage.delete({ where: { id: itemId, patientId: id } }); break;
      default: return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    await auditLog({
      userId: session.user.id,
      action: `REMOVE_${type.toUpperCase()}`,
      resource: `patient:${id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    appLog('error', 'DELETE /api/patients/:id/medical', scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
