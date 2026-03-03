import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdminWithMfa } from "@/lib/auth/current-user";
import { isAuthzError } from "@/lib/auth/errors";
import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";
import { getEntitlementSnapshot, enforceFeature } from "@/lib/billing/entitlements";
import { z } from "zod";

const CreateOrgSchema = z.object({
  name: z.string().min(1).max(255).trim(),
  npi: z.string().max(20).trim().optional().transform((s) => s || undefined),
  address: z.string().max(500).trim().optional().transform((s) => s || undefined),
  city: z.string().max(100).trim().optional().transform((s) => s || undefined),
  state: z.string().max(50).trim().optional().transform((s) => s || undefined),
  zip: z.string().max(20).trim().optional().transform((s) => s || undefined),
  phone: z.string().max(50).trim().optional().transform((s) => s || undefined),
  fax: z.string().max(50).trim().optional().transform((s) => s || undefined),
});

// POST /api/admin/orgs — create organization (SUPER_ADMIN + MFA)
export async function POST(req: NextRequest) {
  try {
    const currentUser = await requireSuperAdminWithMfa();
    const entitlements = await getEntitlementSnapshot(currentUser.id);
    const featureCheck = enforceFeature(entitlements, "admin_org_controls");
    if (!featureCheck.allowed) {
      return NextResponse.json(
        { success: false, error: featureCheck.message, code: featureCheck.code },
        { status: 403 },
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body", code: "INVALID_JSON" },
        { status: 400 },
      );
    }

    const parsed = CreateOrgSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.flatten().formErrors.join("; ") || "Validation failed";
      return NextResponse.json(
        { success: false, error: msg, code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const org = await prisma.organization.create({
      data: {
        name: parsed.data.name,
        npi: parsed.data.npi,
        address: parsed.data.address,
        city: parsed.data.city,
        state: parsed.data.state,
        zip: parsed.data.zip,
        phone: parsed.data.phone,
        fax: parsed.data.fax,
      },
    });

    await appLog("info", "AdminOrgsRoute", "Organization created", {
      orgId: org.id,
      name: org.name,
    });

    return NextResponse.json({ success: true, organization: org }, { status: 201 });
  } catch (error) {
    if (isAuthzError(error)) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.status },
      );
    }
    appLog("error", "AdminOrgsRoute", "POST admin orgs failed", { error: scrubError(error) });
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

// GET /api/admin/orgs — list organizations (SUPER_ADMIN + MFA)
export async function GET(req: Request) {
  try {
    const currentUser = await requireSuperAdminWithMfa();
    const entitlements = await getEntitlementSnapshot(currentUser.id);
    const featureCheck = enforceFeature(entitlements, "admin_org_controls");
    if (!featureCheck.allowed) {
      return NextResponse.json(
        { success: false, error: featureCheck.message, code: featureCheck.code, requiredPlan: featureCheck.requiredPlan },
        { status: 403 },
      );
    }
    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? "50") || 50, 100);
    const offset = Math.max(Number(url.searchParams.get("offset") ?? "0") || 0, 0);

    const organizations = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        npi: true,
        createdAt: true,
        _count: {
          select: {
            users: true,
            patients: true,
            visits: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({ success: true, organizations });
  } catch (error) {
    if (isAuthzError(error)) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.status },
      );
    }

    appLog("error", "AdminOrgsRoute", "GET admin orgs failed", { error: scrubError(error) });
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
