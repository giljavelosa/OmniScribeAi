import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { callAI } from "@/lib/ai-provider";
import { appLog, scrubError, errorCode } from "@/lib/logger";
import { sanitizeForPrompt, sanitizeSectionTitle, sanitizeItemName } from "@/lib/prompt-sanitizer";
import { NoteSectionsSchema, type NoteSections } from "@/lib/llm-schemas";
import { checkAIBudget, recordAICallStart, recordAITokenUsage } from "@/lib/ai-budget";
import { beginIdempotentRequest, completeIdempotentRequest, failIdempotentRequest } from "@/lib/idempotency";
import { NextRequest } from "next/server";
import { resolveTemplate, effectiveFrameworkId, buildSnapshot, TemplateResolutionError } from "@/lib/template-resolver";
import { prisma } from "@/lib/db";
import { canEditVisit } from "@/lib/visit-access";
import { getEntitlementSnapshot, enforceFeature, enforceQuota } from "@/lib/billing/entitlements";
import { fail, ok } from "@/lib/api-envelope";
import { AppError, unauthorized } from "@/lib/errors";
import { wrapRoute } from "@/lib/wrap-route";

export const maxDuration = 300;

function enforceAIBudget(userId: string): { ok: true } | { ok: false; error: string; code: string } {
  const budget = checkAIBudget(userId);
  if (!budget.allowed) {
    return { ok: false, error: budget.error, code: budget.code };
  }
  recordAICallStart(userId);
  return { ok: true };
}

function stripFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/gm, '').replace(/^```\s*/gm, '').trim();
}

function parseJsonArray(raw: string): NoteSections {
  try {
    const trimmed = stripFences(raw);
    const jsonMatch = trimmed.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = NoteSectionsSchema.safeParse(JSON.parse(jsonMatch[0]));
      if (!parsed.success) {
        throw new Error("Regenerated note failed schema validation");
      }
      return parsed.data;
    }
    const parsed = JSON.parse(trimmed);
    const normalized = Array.isArray(parsed) ? parsed : parsed.sections || parsed.note || [parsed];
    const validated = NoteSectionsSchema.safeParse(normalized);
    if (!validated.success) {
      throw new Error("Regenerated note failed schema validation");
    }
    return validated.data;
  } catch (error) {
    appLog("error", "RegenNote", "Failed to parse/validate regenerated note", {
      error: scrubError(error),
      rawLength: raw.length,
    });
    throw new AppError("LLM_JSON_INVALID", "Note regeneration returned invalid JSON structure", 502);
  }
}

export const POST = wrapRoute(async (request: NextRequest, _ctx, requestId) => {
  const session = await auth();
  if (!session?.user) {
    throw unauthorized();
  }

  const entitlements = await getEntitlementSnapshot(session.user.id);
  const featureCheck = enforceFeature(entitlements, "regenerate_note");
  if (!featureCheck.allowed) {
    return fail(featureCheck.code, featureCheck.message, requestId, 403, {
      headers: { "Cache-Control": "no-store" },
    });
  }
  const quotaCheck = enforceQuota(entitlements, "monthly_notes", 1);
  if (!quotaCheck.allowed) {
    return fail(quotaCheck.code, quotaCheck.message, requestId, 429, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const idempotencyKey = request.headers.get("x-idempotency-key")?.trim() || null;
  if (idempotencyKey) {
    const gate = beginIdempotentRequest(session.user.id, "regenerate-note", idempotencyKey);
    if (!gate.allowed && gate.inProgress) {
      return fail("IDEMPOTENCY_IN_PROGRESS", "A regeneration run with this key is already in progress.", requestId, 409, {
        headers: { "Cache-Control": "no-store" },
      });
    }
    if (!gate.allowed && gate.completedResult) {
      return ok(gate.completedResult, { headers: { "Cache-Control": "no-store" } }, requestId);
    }
  }

  const body = await request.json();
  const { parsedData, clinicalSynthesis, frameworkId, templateId, visitId } = body;

  if (!parsedData || !clinicalSynthesis) {
    if (idempotencyKey) failIdempotentRequest(session.user.id, "regenerate-note", idempotencyKey);
    return fail("VALIDATION_ERROR", "Missing required fields: parsedData and clinicalSynthesis", requestId, 400);
  }

  if (!templateId && !frameworkId) {
    if (idempotencyKey) failIdempotentRequest(session.user.id, "regenerate-note", idempotencyKey);
    return fail("VALIDATION_ERROR", "Either templateId or frameworkId is required", requestId, 400);
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
      if (idempotencyKey) failIdempotentRequest(session.user.id, "regenerate-note", idempotencyKey);
      return fail(err.code, err.message, requestId, 400);
    }
    if (idempotencyKey) failIdempotentRequest(session.user.id, "regenerate-note", idempotencyKey);
    appLog("error", "RegenNote", "Template resolution failed", { error: scrubError(err) });
    return fail("TEMPLATE_RESOLUTION_FAILED", "Template resolution failed", requestId, 500);
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

    const budget = enforceAIBudget(session.user.id);
    if (!budget.ok) {
      if (idempotencyKey) failIdempotentRequest(session.user.id, "regenerate-note", idempotencyKey);
      return fail(budget.code, budget.error, requestId, 429, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const result = await callAI(clinicalNoteSystem, clinicalNoteUser, 8000);
    recordAITokenUsage(session.user.id, result.usage.input_tokens + result.usage.output_tokens);
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
    } catch (auditErr) {
      appLog('warn', 'RegenNote', 'Audit log failed (non-blocking)', { error: scrubError(auditErr) });
    }

    // ─── Snapshot persistence (if visitId provided) ────────
    let snapshotPersisted: boolean | undefined;
    let snapshotError: string | undefined;
    if (visitId && templateSnapshot) {
      // Edit check: only owner/admin can mutate visit snapshot metadata.
      const visitRecord = await prisma.visit.findUnique({
        where: { id: visitId },
        select: { id: true, userId: true, organizationId: true, visibility: true },
      });

      if (!visitRecord) {
        return fail("NOT_FOUND", "Visit not found", requestId, 404);
      }

      if (!canEditVisit(
        visitRecord,
        {
          id: session.user.id,
          role: (session.user as { role?: string }).role ?? "CLINICIAN",
          organizationId: (session.user as { organizationId?: string | null }).organizationId ?? null,
        },
      ).allowed) {
        return fail("FORBIDDEN", "Forbidden", requestId, 403);
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

    const responsePayload = {
      success: true,
      clinicalNote,
      generationTime: Math.round(generationTime * 10) / 10,
      templateSnapshot,
      ...(snapshotPersisted !== undefined ? { snapshotPersisted, snapshotError } : {}),
    };
    if (idempotencyKey) {
      completeIdempotentRequest(session.user.id, "regenerate-note", idempotencyKey, responsePayload);
    }
    return ok(
      responsePayload,
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate", "Pragma": "no-cache" } },
      requestId,
    );

  } catch (error) {
    if (idempotencyKey) failIdempotentRequest(session.user.id, "regenerate-note", idempotencyKey);
    if (error instanceof AppError) {
      return fail(error.code, error.message, requestId, error.status, {
        headers: { "Cache-Control": "no-store" },
      });
    }
    const code = errorCode();
    appLog('error', 'RegenNote', 'Error', { code, error: scrubError(error) });
    return fail(code, "Note regeneration failed", requestId, 500, {
      headers: { "Cache-Control": "no-store" },
    });
  }
});
