import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { frameworks } from "@/lib/frameworks";
import { appLog, scrubError } from "@/lib/logger";
import { sanitizeForPrompt } from "@/lib/prompt-sanitizer";
import {
  TemplateStructureSchema,
  validateTemplateStructure,
  frameworkSectionsToTemplateStructure,
  countTemplateItems,
  type NoteFormat,
  type Discipline,
} from "@/lib/template-schema";
import { NextRequest, NextResponse } from "next/server";
import { getEntitlementSnapshot, enforceFeature } from "@/lib/billing/entitlements";

// ─── Helper: check authz for user templates ───────────────

async function checkTemplateAccess(
  templateOwnerId: string | null,
  templateVisibility: string,
  templateOrgId: string | null,
  sessionUserId: string,
  action: 'read' | 'write',
): Promise<{ allowed: boolean; reason?: string }> {
  // Owner always has access
  if (templateOwnerId === sessionUserId) return { allowed: true };

  const user = await prisma.user.findUnique({
    where: { id: sessionUserId },
    select: { organizationId: true, role: true },
  });

  // Admin has access to everything
  if (user?.role === "ADMIN") return { allowed: true };

  // Org-visible templates: same-org users can read/clone but not write
  if (
    templateVisibility === "organization" &&
    templateOrgId &&
    user?.organizationId === templateOrgId
  ) {
    if (action === 'read') return { allowed: true };
    return { allowed: false, reason: "Only template owner or admin can modify org templates" };
  }

  return { allowed: false, reason: "Access denied" };
}

// ─── GET /api/templates/[id] — get template detail ────────

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;

    // Check if this is a system framework ID
    const framework = frameworks.find(f => f.id === id);
    if (framework) {
      const formatType = inferFormatType(framework.type);
      const structure = frameworkSectionsToTemplateStructure(
        framework.sections,
        formatType,
        framework.domain as Discipline,
      );

      return NextResponse.json({
        template: {
          id: framework.id,
          name: framework.name,
          description: framework.description,
          domain: framework.domain,
          noteFormat: framework.type,
          subtype: framework.subtype,
          sourceType: "system",
          sourceFrameworkId: framework.id,
          ownerUserId: null,
          visibility: null,
          organizationId: null,
          structureJson: structure,
          itemCount: framework.itemCount,
          version: 1,
          isArchived: false,
          createdAt: null,
          updatedAt: null,
        },
      });
    }

    // User template from DB
    const template = await prisma.noteTemplate.findUnique({ where: { id } });
    if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

    const access = await checkTemplateAccess(
      template.ownerUserId,
      template.visibility,
      template.organizationId,
      session.user.id,
      'read',
    );
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason || "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    appLog("error", "GET /api/templates/:id", scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── PATCH /api/templates/[id] — update template ──────────

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entitlements = await getEntitlementSnapshot(session.user.id);
  const featureCheck = enforceFeature(entitlements, "custom_templates");
  if (!featureCheck.allowed) {
    return NextResponse.json(
      { success: false, error: featureCheck.message, code: featureCheck.code, requiredPlan: featureCheck.requiredPlan },
      { status: 403 },
    );
  }

  try {
    const { id } = await params;

    // System templates cannot be edited
    if (frameworks.find(f => f.id === id)) {
      return NextResponse.json({ error: "Cannot edit system templates" }, { status: 400 });
    }

    const existing = await prisma.noteTemplate.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Template not found" }, { status: 404 });

    if (existing.isArchived) {
      return NextResponse.json({ error: "Cannot edit archived template" }, { status: 400 });
    }

    // Write access: owner or admin only
    const access = await checkTemplateAccess(
      existing.ownerUserId,
      existing.visibility,
      existing.organizationId,
      session.user.id,
      'write',
    );
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason || "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const updateData: Record<string, unknown> = {};

    // Name
    if (data.name !== undefined) {
      const safeName = sanitizeForPrompt(data.name.trim());
      if (!safeName) return NextResponse.json({ error: "Name is invalid" }, { status: 400 });
      updateData.name = safeName;
    }

    // Description
    if (data.description !== undefined) {
      updateData.description = data.description?.trim() || null;
    }

    // noteFormat
    if (data.noteFormat !== undefined) {
      const validFormats = ["SOAP", "DAP", "narrative", "H&P", "eval", "custom"];
      if (!validFormats.includes(data.noteFormat)) {
        return NextResponse.json({ error: `Invalid noteFormat: ${data.noteFormat}` }, { status: 400 });
      }
      updateData.noteFormat = data.noteFormat;
    }

    // Subtype
    if (data.subtype !== undefined) {
      updateData.subtype = data.subtype?.trim() || null;
    }

    // Visibility
    if (data.visibility !== undefined) {
      if (!["private", "organization"].includes(data.visibility)) {
        return NextResponse.json({ error: `Invalid visibility: ${data.visibility}` }, { status: 400 });
      }
      if (data.visibility === "organization" && !existing.organizationId) {
        return NextResponse.json({ error: "Cannot set visibility to 'organization' without an organization" }, { status: 400 });
      }
      updateData.visibility = data.visibility;
    }

    // Structure
    if (data.structureJson !== undefined) {
      const parseResult = TemplateStructureSchema.safeParse(data.structureJson);
      if (!parseResult.success) {
        return NextResponse.json({
          error: "Invalid template structure",
          details: parseResult.error.issues.map(i => ({ path: i.path.join('.'), message: i.message })),
        }, { status: 400 });
      }

      const deepResult = validateTemplateStructure(parseResult.data);
      if (!deepResult.valid) {
        return NextResponse.json({
          error: "Template structure validation failed",
          details: deepResult.errors,
        }, { status: 400 });
      }

      updateData.structureJson = parseResult.data;
      updateData.itemCount = countTemplateItems(parseResult.data);
      updateData.version = existing.version + 1;
    }

    const template = await prisma.noteTemplate.update({
      where: { id },
      data: updateData,
    });

    await auditLog({
      userId: session.user.id,
      action: "UPDATE_TEMPLATE",
      resource: `template:${template.id}`,
      details: { fields: Object.keys(updateData) },
    });

    return NextResponse.json({ template });
  } catch (error) {
    appLog("error", "PATCH /api/templates/:id", scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── Helpers ──────────────────────────────────────────────

function inferFormatType(frameworkType: string): NoteFormat {
  const lower = frameworkType.toLowerCase();
  if (lower.includes('soap')) return 'SOAP';
  if (lower.includes('dap')) return 'DAP';
  if (lower.includes('h&p') || lower.includes('history')) return 'H&P';
  if (lower.includes('evaluation') || lower.includes('eval') || lower.includes('intake')) return 'eval';
  if (lower.includes('narrative') || lower.includes('discharge') || lower.includes('progress')) return 'narrative';
  return 'custom';
}
