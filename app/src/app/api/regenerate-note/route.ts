import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { callAI } from "@/lib/ai-provider";
import { appLog, scrubError, errorCode } from "@/lib/logger";
import { sanitizeForPrompt, sanitizeSectionTitle, sanitizeItemName } from "@/lib/prompt-sanitizer";
import { NextRequest } from "next/server";
import { resolveTemplate, effectiveFrameworkId, buildSnapshot, TemplateResolutionError } from "@/lib/template-resolver";
import { prisma } from "@/lib/db";

export const maxDuration = 300;

function stripFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/gm, '').replace(/^```\s*/gm, '').trim();
}

function parseJsonArray(raw: string): { title: string; content: string }[] {
  try {
    const trimmed = stripFences(raw);
    const jsonMatch = trimmed.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : parsed.sections || parsed.note || [parsed];
  } catch {
    return [{ title: "\u26a0 Formatting Error", content: "Note could not be formatted \u2014 please regenerate.\n\n" + raw.substring(0, 2000) }];
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
  }

  const body = await request.json();
  const { parsedData, clinicalSynthesis, frameworkId, templateId, visitId } = body;

  if (!parsedData || !clinicalSynthesis) {
    return new Response(JSON.stringify({ success: false, error: "Missing required fields: parsedData and clinicalSynthesis" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  if (!templateId && !frameworkId) {
    return new Response(JSON.stringify({ success: false, error: "Either templateId or frameworkId is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  // ═══ Template Resolution — templateId takes priority over frameworkId ═══
  let resolved;
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true },
    });

    if (templateId && frameworkId) {
      appLog('warn', 'RegenNote', 'Both templateId and frameworkId provided \u2014 templateId takes priority', { templateId, frameworkId });
    }

    resolved = await resolveTemplate({
      templateId: templateId || undefined,
      frameworkId: !templateId ? frameworkId : undefined,
      userId: session.user.id,
      userOrgId: user?.organizationId,
    });
  } catch (err) {
    if (err instanceof TemplateResolutionError) {
      return new Response(JSON.stringify({ success: false, error: err.message, code: err.code }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    throw err;
  }

  const framework = {
    id: resolved.id,
    name: resolved.name,
    domain: resolved.domain as 'medical' | 'rehabilitation' | 'behavioral_health',
    type: resolved.type,
    subtype: resolved.subtype,
    sections: resolved.frameworkSections,
    itemCount: resolved.itemCount,
  };
  const resolvedFrameworkId = effectiveFrameworkId(resolved);
  const templateSnapshot = buildSnapshot(resolved);

  try {
    const startTime = Date.now();
    const sectionPrompt = framework.sections.map((s) => `### ${sanitizeSectionTitle(s.title)}\nItems: ${s.items.map(sanitizeItemName).join(", ")}`).join("\n\n");

    const clinicianType =
      framework.domain === 'rehabilitation'   ? 'rehabilitation clinician (PT/OT/SLP)' :
      framework.domain === 'behavioral_health' ? 'behavioral health clinician' :
      framework.type === 'ED Note'             ? 'emergency medicine physician' :
      framework.type === 'Procedure Note'      ? 'proceduralist physician' :
      framework.type === 'Discharge Summary'   ? 'attending physician preparing a discharge summary' :
      'physician';

    const clinicalNoteSystem = `You are a senior ${clinicianType} writing the final clinical note for the medical record. You are combining two inputs:

1. PARSED DATA: The documented facts from the encounter
2. CLINICAL REASONING: Clinical synthesis reviewed and approved by the clinician

Your job is to produce a POLISHED, COMPLETE clinical note that:

RULES:
1. Include ALL documented facts from the parsed data in proper clinical format
2. For Assessment/Impression sections: weave in the clinical reasoning naturally
3. For Plan sections: incorporate recommended focus areas into concrete treatment plan items
4. Keep blanks (___) for truly undocumented items
5. Write in professional third-person clinical voice
6. The note should read as if written by an experienced clinician
7. Do NOT use markers or labels \u2014 this is the chart-ready version
8. Use proper medical terminology and standard clinical note formatting
9. Include tables for objective measurements where applicable

FRAMEWORK: ${sanitizeForPrompt(framework.name)}
TYPE: ${sanitizeForPrompt(framework.type)} \u2014 ${sanitizeForPrompt(framework.subtype)}

STRUCTURE:
${sectionPrompt}

OUTPUT: Return ONLY a JSON array: [{ "title": "section title", "content": "formatted section content with markdown" }]`;

    const clinicalNoteUser = `PARSED DATA (documented facts):
${JSON.stringify(parsedData, null, 2)}

CLINICAL REASONING (clinician-reviewed synthesis):
${JSON.stringify(clinicalSynthesis, null, 2)}

Write the final clinical note. Merge the parsed data and clinical reasoning into a cohesive, professional clinical document.`;

    const result = await callAI(clinicalNoteSystem, clinicalNoteUser, 8000);
    const clinicalNote = parseJsonArray(result.content);
    const generationTime = (Date.now() - startTime) / 1000;

    // HIPAA audit log — note regeneration event
    try {
      await auditLog({
        userId: session.user.id,
        action: "REGENERATE_NOTE",
        resource: `framework:${resolvedFrameworkId}`,
        details: { frameworkId: resolvedFrameworkId, templateId: templateId || undefined, generationTime },
      });
    } catch { /* non-critical */ }

    // ─── Snapshot persistence (if visitId provided) ────────
    let snapshotPersisted: boolean | undefined;
    let snapshotError: string | undefined;
    if (visitId && templateSnapshot) {
      // Ownership check: verify visit belongs to the authenticated user
      const visitRecord = await prisma.visit.findUnique({
        where: { id: visitId },
        select: { id: true, userId: true },
      });

      if (!visitRecord) {
        return new Response(JSON.stringify({ success: false, error: "Visit not found" }), {
          status: 404, headers: { "Content-Type": "application/json" },
        });
      }

      if (visitRecord.userId !== session.user.id) {
        return new Response(JSON.stringify({ success: false, error: "Forbidden" }), {
          status: 403, headers: { "Content-Type": "application/json" },
        });
      }

      try {
        await prisma.visit.update({
          where: { id: visitId },
          data: {
            templateSnapshotJson: JSON.parse(JSON.stringify(templateSnapshot)),
            noteData: clinicalNote,
          },
        });
        snapshotPersisted = true;
      } catch (snapErr) {
        snapshotPersisted = false;
        snapshotError = scrubError(snapErr);
        appLog('error', 'RegenNote', 'Failed to persist template snapshot', {
          visitId,
          error: snapshotError,
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      clinicalNote,
      generationTime: Math.round(generationTime * 10) / 10,
      templateSnapshot,
      ...(snapshotPersisted !== undefined ? { snapshotPersisted, snapshotError } : {}),
    }), { headers: { "Content-Type": "application/json", "Cache-Control": "no-store, no-cache, must-revalidate", "Pragma": "no-cache" } });

  } catch (error) {
    const code = errorCode();
    appLog('error', 'RegenNote', 'Error', { code, error: scrubError(error) });
    return new Response(JSON.stringify({ success: false, error: "Note regeneration failed", code }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
}
