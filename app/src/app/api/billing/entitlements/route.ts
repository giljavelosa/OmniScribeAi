import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getEntitlementSnapshot } from "@/lib/billing/entitlements";
import { appLog, scrubError } from "@/lib/logger";
import { unauthorized } from "@/lib/errors";
import { ok } from "@/lib/api-envelope";
import { wrapRoute } from "@/lib/wrap-route";

export const GET = wrapRoute(async (_req, _ctx, requestId) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw unauthorized();
  }

  try {
    const snapshot = await getEntitlementSnapshot(session.user.id);
    return ok(
      {
        plan: snapshot.plan,
        planLabel: snapshot.planLabel,
        source: snapshot.source,
        features: snapshot.features,
        quotas: snapshot.quotas,
        usage: snapshot.usage,
        periodStart: snapshot.periodStart,
        periodEnd: snapshot.periodEnd,
      },
      { headers: { "Cache-Control": "no-store" } },
      requestId,
    );
  } catch (error) {
    appLog("error", "BillingEntitlementsRoute", "Failed to fetch entitlements snapshot", {
      error: scrubError(error),
    });
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error", requestId } },
      { status: 500, headers: { "Cache-Control": "no-store", "x-request-id": requestId } },
    );
  }
});

