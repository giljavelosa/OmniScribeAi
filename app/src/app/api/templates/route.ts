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

// ─── GET /api/templates — list templates ──────────────────

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: { code: "AUTH_UNAUTHORIZED", message: "Unauthorized" } },
      { status: 401 },
    );
  }

  try {
    const params = req.nextUrl.searchParams;
    const domain = params.get("domain");
    const sourceType = params.get("sourceType");
    const includeArchived = params.get("includeArchived") === "true";
    const search = params.get("search")?.trim();
    const limit = Math.min(parseInt(params.get("limit") || "50") || 50, 100);
    const offset = parseInt(params.get("offset") || "0") || 0;

    const results: unknown[] = [];
    let total = 0;

    // System templates (from frameworks.ts)
    if (!sourceType || sourceType === "system") {
      let systemFrameworks = frameworks;
      if (domain) systemFrameworks = systemFrameworks.filter(f => f.domain === domain);
      if (search) {
        const lower = search.toLowerCase();
        systemFrameworks = systemFrameworks.filter(f =>
          f.name.toLowerCase().includes(lower) ||
          f.description.toLowerCase().includes(lower)
        );
      }

      for (const fw of systemFrameworks) {
        results.push({
          id: fw.id,
          name: fw.name,
          description: fw.description,
          domain: fw.domain,
          noteFormat: fw.type,
          subtype: fw.subtype,
          sourceType: "system",
          sourceFrameworkId: fw.id,
          ownerUserId: null,
          visibility: null,
          organizationId: null,
          itemCount: fw.itemCount,
          version: 1,
          isArchived: false,
          createdAt: null,
          updatedAt: null,
        });
      }
    }

    // User templates (from DB)
    if (!sourceType || sourceType === "user") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { organizationId: true, role: true },
      });

      const isAdmin = user?.role === "ADMIN";

      // Build where clause: own templates + org-visible templates
      const orConditions: Record<string, unknown>[] = [
        { ownerUserId: session.user.id },
      ];

      if (user?.organizationId) {
        orConditions.push({
          organizationId: user.organizationId,
          visibility: "organization",
        });
      }

      if (isAdmin) {
        orConditions.push({}); // admin sees all
      }

      const where: Record<string, unknown> = {
        OR: orConditions,
        sourceType: "user",
      };

      if (domain) where.domain = domain;
      if (!includeArchived) where.isArchived = false;
      if (search) {
        where.OR = undefined; // override — combine with search
        where.AND = [
          { OR: orConditions },
          {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          },
        ];
      }

      const [dbTemplates, dbCount] = await Promise.all([
        prisma.noteTemplate.findMany({
          where,
          select: {
            id: true,
            name: true,
            description: true,
            domain: true,
            noteFormat: true,
            subtype: true,
            sourceType: true,
            sourceFrameworkId: true,
            ownerUserId: true,
            visibility: true,
            organizationId: true,
            itemCount: true,
            version: true,
            isArchived: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { updatedAt: "desc" },
        }),
        prisma.noteTemplate.count({ where }),
      ]);

      for (const t of dbTemplates) {
        results.push(t);
      }
      total += dbCount;
    }

    // Add system count to total
    if (!sourceType || sourceType === "system") {
      total += results.filter((r: unknown) => (r as { sourceType: string }).sourceType === "system").length;
    }

    // Apply pagination across combined results
    const paginated = results.slice(offset, offset + limit);

    return NextResponse.json({ templates: paginated, total });
  } catch (error) {
    appLog("error", "GET /api/templates", scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST /api/templates — create template ────────────────

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: { code: "AUTH_UNAUTHORIZED", message: "Unauthorized" } },
      { status: 401 },
    );
  }

  const entitlements = await getEntitlementSnapshot(session.user.id);
  const featureCheck = enforceFeature(entitlements, "custom_templates");
  if (!featureCheck.allowed) {
    return NextResponse.json(
      { success: false, error: featureCheck.message, code: featureCheck.code, requiredPlan: featureCheck.requiredPlan },
      { status: 403 },
    );
  }

  try {
    const data = await req.json();
    const { name, description, domain, noteFormat, subtype, sourceFrameworkId, structureJson, visibility } = data;

    // Required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: { code: "TEMPLATE_VALIDATION_FAILED", message: "Name is required" } },
        { status: 400 },
      );
    }
    if (!domain?.trim()) {
      return NextResponse.json(
        { success: false, error: { code: "TEMPLATE_VALIDATION_FAILED", message: "Domain is required" } },
        { status: 400 },
      );
    }
    if (!noteFormat?.trim()) {
      return NextResponse.json(
        { success: false, error: { code: "TEMPLATE_VALIDATION_FAILED", message: "Note format is required" } },
        { status: 400 },
      );
    }

    // Name length
    const safeName = sanitizeForPrompt(name.trim());
    if (safeName.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "TEMPLATE_VALIDATION_FAILED", message: "Name is invalid after sanitization" } },
        { status: 400 },
      );
    }

    // Domain validation
    const validDomains = ["medical", "rehabilitation", "behavioral_health"];
    if (!validDomains.includes(domain)) {
      return NextResponse.json(
        { success: false, error: { code: "TEMPLATE_VALIDATION_FAILED", message: `Invalid domain: ${domain}` } },
        { status: 400 },
      );
    }

    // noteFormat validation
    const validFormats = ["SOAP", "DAP", "narrative", "H&P", "eval", "custom"];
    if (!validFormats.includes(noteFormat)) {
      return NextResponse.json(
        { success: false, error: { code: "TEMPLATE_VALIDATION_FAILED", message: `Invalid noteFormat: ${noteFormat}` } },
        { status: 400 },
      );
    }

    // Visibility validation
    const effectiveVisibility = visibility || "private";
    if (!["private", "organization"].includes(effectiveVisibility)) {
      return NextResponse.json(
        { success: false, error: { code: "TEMPLATE_VALIDATION_FAILED", message: `Invalid visibility: ${visibility}` } },
        { status: 400 },
      );
    }

    // Get user's org for org-scoping
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true },
    });

    if (effectiveVisibility === "organization" && !user?.organizationId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "TEMPLATE_VALIDATION_FAILED", message: "Cannot set visibility to 'organization' without an organization" },
        },
        { status: 400 },
      );
    }

    // Resolve structure: from structureJson, or clone from sourceFrameworkId
    let structure;
    if (structureJson) {
      const parseResult = TemplateStructureSchema.safeParse(structureJson);
      if (!parseResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "TEMPLATE_VALIDATION_FAILED",
              message: "Invalid template structure",
              details: parseResult.error.issues.map(i => ({ path: i.path.join("."), message: i.message })),
            },
          },
          { status: 400 },
        );
      }
      structure = parseResult.data;
    } else if (sourceFrameworkId) {
      const fw = frameworks.find(f => f.id === sourceFrameworkId);
      if (!fw) {
        return NextResponse.json(
          { success: false, error: { code: "TEMPLATE_VALIDATION_FAILED", message: `Unknown source framework: ${sourceFrameworkId}` } },
          { status: 400 },
        );
      }
      structure = frameworkSectionsToTemplateStructure(
        fw.sections,
        noteFormat as NoteFormat,
        domain as Discipline,
      );
    } else {
      return NextResponse.json(
        { success: false, error: { code: "TEMPLATE_VALIDATION_FAILED", message: "Either structureJson or sourceFrameworkId is required" } },
        { status: 400 },
      );
    }

    // Ensure formatType and discipline match
    if (structure.formatType !== noteFormat) {
      structure = { ...structure, formatType: noteFormat as NoteFormat };
    }
    if (structure.discipline !== domain) {
      structure = { ...structure, discipline: domain as Discipline };
    }

    // Deep validation
    const deepResult = validateTemplateStructure(structure);
    if (!deepResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "TEMPLATE_VALIDATION_FAILED",
            message: "Template structure validation failed",
            details: deepResult.errors,
          },
        },
        { status: 400 },
      );
    }

    const itemCount = countTemplateItems(structure);

    const template = await prisma.noteTemplate.create({
      data: {
        name: safeName,
        description: description?.trim() || null,
        domain,
        noteFormat,
        subtype: subtype?.trim() || null,
        sourceType: "user",
        sourceFrameworkId: sourceFrameworkId || null,
        visibility: effectiveVisibility,
        ownerUserId: session.user.id,
        organizationId: user?.organizationId || null,
        structureJson: structure,
        itemCount,
      },
    });

    await auditLog({
      userId: session.user.id,
      action: "CREATE_TEMPLATE",
      resource: `template:${template.id}`,
      details: { name: safeName, domain, noteFormat, sourceFrameworkId: sourceFrameworkId || null },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    appLog("error", "POST /api/templates", scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
