import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { fail, ok } from "@/lib/api-contract";
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
import { NextRequest } from "next/server";

// ─── GET /api/templates — list templates ──────────────────

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return fail("AUTH_UNAUTHORIZED", "Unauthorized", 401);

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

    return ok({ templates: paginated, total });
  } catch (error) {
    appLog("error", "GET /api/templates", scrubError(error));
    return fail("INTERNAL_ERROR", "Internal server error", 500);
  }
}

// ─── POST /api/templates — create template ────────────────

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return fail("AUTH_UNAUTHORIZED", "Unauthorized", 401);

  try {
    const data = await req.json();
    const { name, description, domain, noteFormat, subtype, sourceFrameworkId, structureJson, visibility } = data;

    // Required fields
    if (!name?.trim()) return fail("TEMPLATE_VALIDATION_FAILED", "Name is required", 400);
    if (!domain?.trim()) return fail("TEMPLATE_VALIDATION_FAILED", "Domain is required", 400);
    if (!noteFormat?.trim()) return fail("TEMPLATE_VALIDATION_FAILED", "Note format is required", 400);

    // Name length
    const safeName = sanitizeForPrompt(name.trim());
    if (safeName.length === 0) return fail("TEMPLATE_VALIDATION_FAILED", "Name is invalid after sanitization", 400);

    // Domain validation
    const validDomains = ["medical", "rehabilitation", "behavioral_health"];
    if (!validDomains.includes(domain)) {
      return fail("TEMPLATE_VALIDATION_FAILED", `Invalid domain: ${domain}`, 400);
    }

    // noteFormat validation
    const validFormats = ["SOAP", "DAP", "narrative", "H&P", "eval", "custom"];
    if (!validFormats.includes(noteFormat)) {
      return fail("TEMPLATE_VALIDATION_FAILED", `Invalid noteFormat: ${noteFormat}`, 400);
    }

    // Visibility validation
    const effectiveVisibility = visibility || "private";
    if (!["private", "organization"].includes(effectiveVisibility)) {
      return fail("TEMPLATE_VALIDATION_FAILED", `Invalid visibility: ${visibility}`, 400);
    }

    // Get user's org for org-scoping
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true },
    });

    if (effectiveVisibility === "organization" && !user?.organizationId) {
      return fail("TEMPLATE_VALIDATION_FAILED", "Cannot set visibility to 'organization' without an organization", 400);
    }

    // Resolve structure: from structureJson, or clone from sourceFrameworkId
    let structure;
    if (structureJson) {
      const parseResult = TemplateStructureSchema.safeParse(structureJson);
      if (!parseResult.success) {
        return fail("TEMPLATE_VALIDATION_FAILED", "Invalid template structure", 400, {
          details: parseResult.error.issues.map(i => ({ path: i.path.join('.'), message: i.message })),
        });
      }
      structure = parseResult.data;
    } else if (sourceFrameworkId) {
      const fw = frameworks.find(f => f.id === sourceFrameworkId);
      if (!fw) {
        return fail("TEMPLATE_VALIDATION_FAILED", `Unknown source framework: ${sourceFrameworkId}`, 400);
      }
      structure = frameworkSectionsToTemplateStructure(
        fw.sections,
        noteFormat as NoteFormat,
        domain as Discipline,
      );
    } else {
      return fail("TEMPLATE_VALIDATION_FAILED", "Either structureJson or sourceFrameworkId is required", 400);
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
      return fail("TEMPLATE_VALIDATION_FAILED", "Template structure validation failed", 400, {
        details: deepResult.errors,
      });
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

    return ok({ template }, { status: 201 });
  } catch (error) {
    appLog("error", "POST /api/templates", scrubError(error));
    return fail("INTERNAL_ERROR", "Internal server error", 500);
  }
}
