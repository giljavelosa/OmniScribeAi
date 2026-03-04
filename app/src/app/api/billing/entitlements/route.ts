import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getEntitlementSnapshot } from "@/lib/billing/entitlements";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const snapshot = await getEntitlementSnapshot(session.user.id);

  return NextResponse.json({
    success: true,
    plan: snapshot.plan,
    planLabel: snapshot.planLabel,
    features: snapshot.features,
    quotas: snapshot.quotas,
    usage: snapshot.usage,
    periodStart: snapshot.periodStart,
    periodEnd: snapshot.periodEnd,
  });
}
