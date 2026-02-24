import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { assertProductionApiKey } from "@/lib/phi-boundaries";
import { callAI, getActiveProvider } from "@/lib/ai-provider";
import { appLog, scrubError, errorCode } from "@/lib/logger";
import { sanitizeForPrompt, sanitizeSectionTitle, sanitizeItemName, safeJsonKey } from "@/lib/prompt-sanitizer";
import { NextRequest } from "next/server";

export const maxDuration = 300;
import { frameworks } from "@/lib/frameworks";
import { mockNotes } from "@/lib/mock-data";
import { validateEncounterState } from "@/lib/encounter-validator";
import { createInitialEncounterState, serializeFactsForPrompt, type EncounterState, type ClinicalFact } from "@/lib/encounter-state";

// Validate API key tier on module load
assertProductionApiKey();

// Strip markdown code fences that LLMs sometimes wrap JSON in
function stripFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/gm, '').replace(/^```\s*/gm, '').trim();
}


function parseJsonArray(raw: string): { title: string; content: string }[] {
  try {
    const trimmed = stripFences(raw);
    const jsonMatch = trimmed.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : parsed.sections || parsed.note || [parsed];
  } catch (e) {
    appLog('error', 'GenNote', 'JSON parse failed in parseJsonArray', { error: scrubError(e), rawLength: raw.length });
    // Visible fallback — clinician sees a warning, not raw JSON
    return [{
      title: "\u26a0 Formatting Error",
      content: "The note could not be formatted correctly. The raw output is shown below \u2014 please regenerate.\n\n---\n\n" + raw.substring(0, 2000),
    }];
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
  }

  const body = await request.json();
  const { transcript, frameworkId, useMock, regenerateFrom, mode, encounterState } = body;

  // Mock mode — return JSON directly (no streaming needed)
  if (useMock === true || (!process.env.ANTHROPIC_API_KEY && !process.env.XAI_API_KEY && !process.env.DEEPSEEK_API_KEY)) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Only 2 framework IDs differ from their mock key; the rest match directly
    const FRAMEWORK_TO_MOCK: Record<string, string> = {
      'rehab-pt-eval': 'pt-eval',
      'med-soap-followup': 'soap-followup',
    };
    const noteKey = FRAMEWORK_TO_MOCK[frameworkId] ?? frameworkId;
    const note = mockNotes[noteKey] ?? mockNotes['pt-eval'];
    return new Response(JSON.stringify({
      success: true,
      parsedData: note,
      clinicalNote: note,
      summary: "Mock-generated clinical note.",
      generationTime: 0.5,
      source: "mock",
    }), { headers: { "Content-Type": "application/json" } });
  }

  const framework = frameworks.find((f) => f.id === frameworkId);
  if (!framework) {
    return new Response(JSON.stringify({ success: false, error: "Framework not found" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  // ═══════════════════════════════════════════════════════════════
  // ENCOUNTER-STATE MODE — 2-pass pipeline
  // Used when real-time extraction built the EncounterState during recording
  // ═══════════════════════════════════════════════════════════════
  if (mode === 'encounter-state' && encounterState) {
    return handleEncounterStateMode(encounterState as EncounterState, framework, frameworkId, session);
  }

  // ═══════════════════════════════════════════════════════════════
  // TRANSCRIPT MODE — 3-pass pipeline
  // Extract facts from transcript (1 call), then delegate to 2-pass
  // Used for file uploads and legacy fallback
  // ═══════════════════════════════════════════════════════════════
  const transcriptText = regenerateFrom || transcript;
  if (!transcriptText || transcriptText.trim().length === 0) {
    return new Response(JSON.stringify({ success: false, error: "No transcript provided" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  appLog('info', 'GenNote', 'Transcript mode — building EncounterState from full transcript', {
    frameworkId,
    transcriptLength: transcriptText.length,
  });

  const builtState = await buildEncounterStateFromTranscript(transcriptText, framework);
  return handleEncounterStateMode(builtState, framework, frameworkId, session);
}

// ═══════════════════════════════════════════════════════════════
// BUILD ENCOUNTERSTATE FROM FULL TRANSCRIPT (1 LLM call)
// Converts a raw transcript into the same EncounterState format
// that real-time extraction produces, so both paths share the
// same 2-pass note generation pipeline.
// ═══════════════════════════════════════════════════════════════

async function buildEncounterStateFromTranscript(
  transcript: string,
  framework: (typeof frameworks)[number],
): Promise<EncounterState> {
  const state = createInitialEncounterState(framework.sections);

  const schemaFields = framework.sections.map((s) => {
    const sectionKey = safeJsonKey(s.title);
    const items = s.items.map((item) => {
      const itemKey = safeJsonKey(item);
      return `"${itemKey}": { "value": "string or null", "source": "transcript | not_documented | patient_denies" }`;
    });
    return `"${sectionKey}": {\n      ${items.join(",\n      ")}\n    }`;
  });

  const extractSystem = `You are a clinical transcript fact extractor. Extract ONLY explicitly stated facts from a clinical encounter transcript into structured JSON.

RULES:
1. If stated in transcript: set "value" to the information, "source" to "transcript"
2. If explicitly denied: set "value" to the denial, "source" to "patient_denies"
3. If NOT mentioned: set "value" to null, "source" to "not_documented"
4. NEVER fabricate, guess, or infer clinical data
5. Use EXACT words from the transcript for demographics and factual data
6. For measurements: use ONLY exact numbers stated
7. Ignore [silence] markers — do not extract data for silent periods
8. If speaker labels present (Clinician/Patient), note who stated each fact
9. If the transcript says "no substance use" or "denies substance use" globally, apply to ALL substance subcategories with source "patient_denies"
10. If demographics are stated, ensure they appear in BOTH patient_demographics AND any relevant section fields

Return valid JSON matching the schema provided.`;

  const extractUser = `Extract clinical facts from this transcript.

JSON SCHEMA:
{
  ${schemaFields.join(",\n  ")},
  "additional_facts": [
    { "fact": "string", "source": "transcript" }
  ]
}

TRANSCRIPT:
---
${transcript}
---

Return null and "not_documented" for anything not explicitly stated.`;

  const result = await callAI(extractSystem, extractUser, 4000);
  const raw = stripFences(result.content);

  try {
    const parsed = JSON.parse(raw);

    for (const [sectionKey, fields] of Object.entries(parsed)) {
      if (sectionKey === 'additional_facts') continue;
      if (typeof fields !== 'object' || fields === null) continue;

      if (!state.sections[sectionKey]) {
        state.sections[sectionKey] = {};
      }

      for (const [fieldKey, factData] of Object.entries(fields as Record<string, unknown>)) {
        const fact = factData as { value?: string | null; source?: string };
        if (fact?.value != null && fact?.source !== 'not_documented') {
          state.sections[sectionKey][fieldKey] = {
            value: String(fact.value),
            source: (fact.source as ClinicalFact['source']) || 'transcript',
            evidence: null,
          };
        }
      }
    }

    if (Array.isArray(parsed.additional_facts)) {
      for (const af of parsed.additional_facts) {
        if (af.fact) {
          state.additional_facts.push({
            label: String(af.fact).substring(0, 80),
            fact: {
              value: String(af.fact),
              source: 'transcript',
              evidence: null,
            },
          });
        }
      }
    }

    appLog('info', 'GenNote', 'Transcript fact extraction complete', {
      sectionCount: Object.keys(state.sections).length,
      factCount: Object.values(state.sections).reduce(
        (sum, fields) => sum + Object.values(fields).filter(f => f.value !== null).length, 0,
      ),
    });
  } catch {
    appLog('warn', 'GenNote', 'Transcript fact extraction parse failed — EncounterState may be sparse');
  }

  state.chunk_count = 1;
  state.last_updated = Date.now();

  return state;
}

// ═══════════════════════════════════════════════════════════════
// 2-PASS NOTE GENERATION PIPELINE
// Shared by both encounter-state mode and transcript mode.
// Pass 1: Generate clinical note from EncounterState facts
// Pass 2: Audit accuracy + generate summary
// ═══════════════════════════════════════════════════════════════

async function handleEncounterStateMode(
  encounterState: EncounterState,
  framework: (typeof frameworks)[number],
  frameworkId: string,
  session: { user: { id: string; name: string | null; email: string } },
) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: Record<string, unknown>) {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      }

      try {
        const startTime = Date.now();
        let totalTokens = 0;

        appLog('info', 'GenNote', 'Starting 2-pass pipeline', {
          frameworkId,
          chunkCount: encounterState.chunk_count,
        });

        // ─── Step 0: Deterministic validation (zero tokens) ───
        const validation = validateEncounterState(encounterState, frameworkId);
        appLog('info', 'GenNote', 'Validation complete', {
          valid: validation.valid,
          warningCount: validation.warnings.length,
          errorCount: validation.errors.length,
          documentedFacts: validation.documentedFactCount,
          complianceScore: validation.compliance.score,
          complianceGrade: validation.compliance.grade,
        });

        if (!validation.valid) {
          send("error", {
            success: false,
            error: validation.errors.join('; '),
            validation,
          });
          controller.close();
          return;
        }

        // Serialize EncounterState facts to compact JSON for the prompt
        const factsJson = serializeFactsForPrompt(encounterState);

        const clinicianType = framework.domain === 'rehabilitation'
          ? 'rehabilitation clinician (PT/OT/SLP)'
          : framework.domain === 'behavioral_health'
            ? 'behavioral health clinician'
            : framework.type === 'ED Note'
              ? 'emergency medicine physician'
              : framework.type === 'Procedure Note'
                ? 'proceduralist physician'
                : framework.type === 'Discharge Summary'
                  ? 'attending physician preparing a discharge summary'
                  : 'physician';

        const sectionPrompt = framework.sections
          .map((s) => {
            const title = sanitizeSectionTitle(s.title);
            const items = s.items.map(sanitizeItemName).join(", ");
            return `### ${title}\nItems: ${items}`;
          })
          .join("\n\n");

        // ═══════════════════════════════════════════════════════
        // PASS 1: Generate Clinical Note from EncounterState
        // ═══════════════════════════════════════════════════════
        send("progress", { pass: 1, total: 2, message: "Generating clinical note..." });

        const noteSystem = `You are a senior ${clinicianType} writing a clinical note from validated encounter data.

INPUT: A validated EncounterState JSON containing:
- Every fact has been extracted from the clinical encounter transcript
- Facts are tagged as "transcript" (documented), "patient_denies" (explicitly denied), or omitted (not documented)
- Speaker attribution indicates if CLINICIAN or PATIENT stated the information

WRITE THE NOTE:
1. Include ALL facts present in the JSON — use professional clinical language
2. ALWAYS start with a patient identification line (name, age, gender, occupation) when present in the JSON
3. For items with source "patient_denies": write the denial naturally (e.g., if value is "no substance use", write "No substance use" — do NOT add "Patient denies" prefix to values that already contain a negation)
4. OMIT items and entire sections that have NO documented facts in the JSON — do NOT render blanks, placeholders, or "___" for undocumented items
5. Only include a section if it has at least one documented fact
6. Weave clinical reasoning naturally into Assessment — connect documented findings to clinical impressions, assess severity, functional impact
7. Plan section: concrete treatment items linked to documented deficits
8. Use professional third-person clinical voice
9. Include tables for objective measurements (ROM, MMT, vitals) where applicable
10. NEVER add clinical data not present in the EncounterState JSON
11. NEVER mention or list items that were not assessed, not documented, or not in the JSON
12. The compliance score is ${validation.compliance.score}% (grade: ${validation.compliance.grade})${validation.requiredMissing.length > 0 ? ` — missing: ${validation.requiredMissing.join(', ')}` : ''}

FRAMEWORK: ${sanitizeForPrompt(framework.name)}
TYPE: ${sanitizeForPrompt(framework.type)} — ${sanitizeForPrompt(framework.subtype)}

STRUCTURE:
${sectionPrompt}

OUTPUT: Return ONLY a JSON array: [{ "title": "section title", "content": "formatted section content with markdown" }]`;

        const noteUser = `ENCOUNTERSTATE FACTS:
${factsJson}

Write the clinical note using ONLY facts present in the JSON. Omit any sections or items with no documented facts — do not add blanks or placeholders.`;

        const noteResult = await callAI(noteSystem, noteUser, 8000);
        totalTokens += noteResult.usage.input_tokens + noteResult.usage.output_tokens;
        const clinicalNote = parseJsonArray(noteResult.content);
        appLog('info', 'GenNote', 'Pass 1 complete', { sections: clinicalNote.length });

        // ═══════════════════════════════════════════════════════
        // PASS 2: Audit + Summary (combined into one call)
        // ═══════════════════════════════════════════════════════
        send("progress", { pass: 2, total: 2, message: "Verifying accuracy..." });

        let auditClean = true;
        let auditIssues: string[] = [];
        let summary = "Clinical note generated from encounter data.";

        try {
          const auditResult = await callAI(
            `You have two tasks:

TASK 1 — AUDIT: Compare this clinical note against the source EncounterState facts.
- Documented facts appearing in note: OK
- Clinical reasoning logically derived from documented facts: OK
- Any clinical data NOT traceable to the EncounterState JSON: FLAG as hallucination
- Blanks (___) for undocumented items: OK

TASK 2 — SUMMARY: Write a 2-3 sentence visit summary from the note. Be concise and clinical.

Return ONLY valid JSON:
{
  "audit": { "issues": ["description of any problems"], "clean": true },
  "summary": "2-3 sentence clinical summary"
}`,
            `ENCOUNTERSTATE FACTS:\n${factsJson}\n\nCLINICAL NOTE:\n${JSON.stringify(clinicalNote)}`,
            800,
          );
          totalTokens += auditResult.usage.input_tokens + auditResult.usage.output_tokens;

          try {
            const auditJson = JSON.parse(stripFences(auditResult.content));
            if (auditJson.audit) {
              auditClean = auditJson.audit.clean !== false;
              auditIssues = auditJson.audit.issues || [];
            }
            if (auditJson.summary) {
              summary = auditJson.summary;
            }
          } catch { /* keep defaults */ }
        } catch { /* non-critical */ }

        appLog('info', 'GenNote', 'Pass 2 (audit+summary) complete', {
          auditClean,
          issueCount: auditIssues.length,
        });

        const generationTime = (Date.now() - startTime) / 1000;
        appLog('info', 'GenNote', '2-pass pipeline complete', {
          generationTime,
          totalTokens,
          frameworkId,
          passes: 2,
        });

        // HIPAA audit log
        try {
          await auditLog({
            userId: session.user.id,
            action: "GENERATE_NOTE",
            resource: `framework:${frameworkId}`,
            details: {
              frameworkId,
              mode: 'encounter-state',
              factsCount: validation.documentedFactCount,
              tokensUsed: totalTokens,
              generationTime,
              complianceGrade: validation.compliance.grade,
            },
          });
        } catch { /* non-critical */ }

        // Send final result
        send("result", {
          success: true,
          clinicalNote,
          parsedData: clinicalNote, // Same format — for backward compat with UI
          compliance: validation.compliance,
          summary,
          auditClean,
          auditIssues: auditIssues.length > 0 ? auditIssues : undefined,
          validation: {
            warnings: validation.warnings,
            documentedFactCount: validation.documentedFactCount,
            evidenceLinkedCount: validation.evidenceLinkedCount,
          },
          generationTime: Math.round(generationTime * 10) / 10,
          source: getActiveProvider(),
          tokensUsed: totalTokens,
          mode: 'encounter-state',
        });
      } catch (error) {
        const code = errorCode();
        appLog('error', 'GenNote', 'Pipeline error', { code, error: scrubError(error) });
        send("error", { success: false, error: "Note generation failed", code });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
