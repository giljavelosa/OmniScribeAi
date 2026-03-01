import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { frameworks } from "@/lib/frameworks";
import { appLog, scrubError } from "@/lib/logger";
import { sanitizeForPrompt } from "@/lib/prompt-sanitizer";
import {
  frameworkSectionsToTemplateStructure,
  countTemplateItems,
  type NoteFormat,
  type Discipline,
} from "@/lib/template-schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    let body: { name?: string } = {};
    try {
      body = (await req.json()) as { name?: string };
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const customName = body.name?.trim();

    // Get cloner's org
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true, role: true },
    });

    // Try system framework first
    const framework = frameworks.find(f => f.id === id);
    if (framework) {
      const formatType = inferFormatType(framework.type);
      const structure = frameworkSectionsToTemplateStructure(
        framework.sections,
        formatType,
        framework.domain as Discipline,
      );

      const name = sanitizeForPrompt(customName || `Copy of ${framework.name}`);

      const template = await prisma.noteTemplate.create({
        data: {
          name,
          description: framework.description,
          domain: framework.domain,
          noteFormat: framework.type,
          subtype: framework.subtype,
          sourceType: "user",
          sourceFrameworkId: framework.id,
          visibility: "private",
          ownerUserId: session.user.id,
          organizationId: user?.organizationId || null,
          structureJson: structure,
          itemCount: framework.itemCount,
        },
      });

      await auditLog({
        userId: session.user.id,
        action: "CLONE_TEMPLATE",
        resource: `template:${template.id}`,
        details: { sourceType: "system", sourceId: framework.id },
      });

      return NextResponse.json({ template }, { status: 201 });
    }

    // User template from DB
    const source = await prisma.noteTemplate.findUnique({ where: { id } });
    if (!source) return NextResponse.json({ error: "Template not found" }, { status: 404 });

    // Visibility check: can the user see this template?
    const isOwner = source.ownerUserId === session.user.id;
    const isAdmin = user?.role === "ADMIN";
    const isSameOrg = source.visibility === "organization" &&
      source.organizationId &&
      user?.organizationId === source.organizationId;

    if (!isOwner && !isAdmin && !isSameOrg) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const name = sanitizeForPrompt(customName || `Copy of ${source.name}`);

    const template = await prisma.noteTemplate.create({
      data: {
        name,
        description: source.description,
        domain: source.domain,
        noteFormat: source.noteFormat,
        subtype: source.subtype,
        sourceType: "user",
        sourceFrameworkId: source.sourceFrameworkId,
        visibility: "private",  // clones always start private
        ownerUserId: session.user.id,
        organizationId: user?.organizationId || null,
        structureJson: source.structureJson!,
        itemCount: source.itemCount,
      },
    });

    await auditLog({
      userId: session.user.id,
      action: "CLONE_TEMPLATE",
      resource: `template:${template.id}`,
      details: { sourceType: "user", sourceId: source.id },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    appLog("error", "POST /api/templates/:id/clone", scrubError(error));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function inferFormatType(frameworkType: string): NoteFormat {
  const lower = frameworkType.toLowerCase();
  if (lower.includes('soap')) return 'SOAP';
  if (lower.includes('dap')) return 'DAP';
  if (lower.includes('h&p') || lower.includes('history')) return 'H&P';
  if (lower.includes('evaluation') || lower.includes('eval') || lower.includes('intake')) return 'eval';
  if (lower.includes('narrative') || lower.includes('discharge') || lower.includes('progress')) return 'narrative';
  return 'custom';
}
