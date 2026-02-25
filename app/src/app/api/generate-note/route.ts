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
import { createInitialEncounterState, serializeFactsForPrompt, formatTranscriptForNoteGeneration, type EncounterState, type ClinicalFact } from "@/lib/encounter-state";

// Validate API key tier on module load
assertProductionApiKey();

// Strip markdown code fences that LLMs sometimes wrap JSON in
function stripFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/gm, '').replace(/^```\s*/gm, '').trim();
}


function parseJsonArray(raw: string): { title: string; content: string }[] {
  try {
    const trimmed = stripFences(raw);
    let arr: unknown[];
    const jsonMatch = trimmed.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      arr = JSON.parse(jsonMatch[0]);
    } else {
      const parsed = JSON.parse(trimmed);
      arr = Array.isArray(parsed) ? parsed : parsed.sections || parsed.note || [parsed];
    }

    if (!Array.isArray(arr) || arr.length === 0) {
      appLog('warn', 'GenNote', 'parseJsonArray: empty or non-array result', { rawLength: raw.length });
      return [{
        title: "\u26a0 Formatting Error",
        content: "The note returned no sections. Please regenerate.\n\n---\n\n" + raw.substring(0, 2000),
      }];
    }

    // Validate each section has title + content; drop malformed entries with warning
    const valid: { title: string; content: string }[] = [];
    let dropped = 0;
    for (const item of arr) {
      if (item && typeof item === 'object' && 'title' in item && 'content' in item) {
        const s = item as { title: string; content: string };
        if (typeof s.title === 'string' && typeof s.content === 'string') {
          valid.push(s);
          continue;
        }
      }
      dropped++;
    }

    if (dropped > 0) {
      appLog('warn', 'GenNote', 'parseJsonArray: dropped malformed sections', { dropped, total: arr.length });
      valid.push({
        title: "\u26a0 Data Warning",
        content: `${dropped} section(s) had missing or malformed data and were omitted. Please review and regenerate if needed.`,
      });
    }

    return valid.length > 0 ? valid : [{
      title: "\u26a0 Formatting Error",
      content: "All sections were malformed. Please regenerate.\n\n---\n\n" + raw.substring(0, 2000),
    }];
  } catch (e) {
    appLog('error', 'GenNote', 'JSON parse failed in parseJsonArray', { error: scrubError(e), rawLength: raw.length });
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
  "patient_demographics": {
    "name": { "value": "string or null", "source": "transcript | not_documented" },
    "age": { "value": "string or null", "source": "transcript | not_documented" },
    "gender": { "value": "string or null", "source": "transcript | not_documented" },
    "occupation": { "value": "string or null", "source": "transcript | not_documented" }
  },
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

  if (result.truncated) {
    appLog('warn', 'GenNote', 'Transcript extraction LLM output truncated — EncounterState will be sparse', {
      outputTokens: result.usage.output_tokens,
      maxTokens: 4000,
    });
    // Don't attempt to parse truncated JSON — return sparse state with transcript fallback
    state.chunk_count = 1;
    state.last_updated = Date.now();
    if (transcript.trim().length > 0) {
      state.diarized_transcript = [{
        speaker: 'UNKNOWN' as const,
        text: transcript.trim(),
        t0: 0,
        t1: 0,
      }];
    }
    return state;
  }

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
  } catch (parseErr) {
    appLog('warn', 'GenNote', 'Transcript fact extraction parse failed — EncounterState will be sparse', {
      error: scrubError(parseErr),
      rawLength: raw.length,
    });
  }

  state.chunk_count = 1;
  state.last_updated = Date.now();

  // Store the raw transcript so transcript-enriched note generation works for file uploads too
  if (transcript.trim().length > 0) {
    state.diarized_transcript = [{
      speaker: 'UNKNOWN' as const,
      text: transcript.trim(),
      t0: 0,
      t1: 0,
    }];
  }

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

        // FIX-43: Send validation warnings to client before note generation
        if (validation.warnings.length > 0) {
          send("warnings", {
            warnings: validation.warnings,
            compliance: validation.compliance,
          });
        }

        // Serialize EncounterState facts to compact JSON for the prompt
        const factsJson = serializeFactsForPrompt(encounterState);
        const transcriptText = formatTranscriptForNoteGeneration(encounterState);
        const hasTranscript = transcriptText.length > 0;

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

        const noteSystem = `You are a senior ${clinicianType} with 20+ years of experience writing clinical documentation. Write as a seasoned clinician would — concise, authoritative, with natural clinical jargon.

INPUT: You receive ${hasTranscript ? 'TWO sources' : 'ONE source'}:
1. **Structured Facts JSON** (primary for measurements, scores, objective data) — extracted from the clinical encounter
${hasTranscript ? '2. **Encounter Transcript** (context, nuance, patient quotes, clinical flow) — the actual clinician-patient conversation' : ''}
- Facts are tagged as "transcript" (documented), "patient_denies" (explicitly denied), or omitted (not documented)
- Speaker attribution indicates if CLINICIAN or PATIENT stated the information
${hasTranscript ? '- When the Transcript contains clinically relevant information not captured in Facts JSON, you MAY include it with appropriate clinical language' : ''}

CLINICAL WRITING STYLE:
- Write like an experienced clinician documenting for peer review — not like a template or a medical student
- Use standard clinical abbreviations freely: c/o, s/p, b/l, WNL, WBAT, w/o, pt, hx, dx, tx, fx, ROM, MMT, TTP, NWB, etc.
- Translate lay language to clinical terminology: "sore" → "tenderness," "numb/tingling" → "paresthesia," "swollen" → "edema," "stiff" → "decreased mobility," "dizzy" → "vertigo/lightheadedness," "hurts to move" → "pain with active motion," "can't sleep" → "reports insomnia," "feeling down" → "endorses depressed mood"
- Chief complaint and patient-reported symptoms: quote the patient's own words verbatim in quotation marks, then follow with your clinical interpretation. Example: Patient c/o "my knee has been giving out on me when I go down stairs" consistent with quadriceps weakness and patellar instability.
- Denials: use standard clinical phrasing — "Denies radiating symptoms," "No c/o paresthesia," "Negative for suicidal ideation"
- Present tense for current exam findings, past tense for history
- Assessment must demonstrate clinical reasoning — connect objective findings to functional limitations, note severity implications, and reference relevant clinical patterns. Include factual differential diagnosis derived from documented signs, symptoms, and test results. State the most likely diagnosis first, then list plausible differentials that the documented findings support or rule out. When making clinical inferences, base them ONLY on information present in either source. The inference itself is expected — inventing findings that appear in neither source is not.

WRITE THE NOTE:
1. Include ALL facts present in the JSON — translate to proper clinical terminology${hasTranscript ? '. Enrich with relevant details from the Transcript that add clinical value (patient statements, contextual details, clinical observations mentioned in conversation)' : ''}
2. The FIRST section MUST begin with a patient identification line stating the patient's name, age, gender, and occupation (from "patient_demographics" in the JSON). Example: "Robert Johnson is a 45-year-old male electrician presenting for..." — this line is REQUIRED if any demographics are present
3. For items with source "patient_denies": write using standard clinical denial phrasing as described above
4. OMIT sections with no relevant content from ${hasTranscript ? 'either source' : 'the JSON'} — do NOT render blanks, placeholders, or "___" for undocumented items
5. Only include a section if it has at least one documented fact${hasTranscript ? ' or relevant transcript content' : ''}
6. Assessment / Medical Assessment: This is the most critical section. Do NOT simply restate findings. Instead:
   a. **Clinical Reasoning**: Synthesize subjective complaints and objective findings into a cohesive clinical picture. Explain HOW the findings relate to each other (e.g., "Limited shoulder flexion ROM to 120° with pain at end-range, combined with positive Neer's and Hawkins-Kennedy tests, is consistent with subacromial impingement syndrome").
   b. **Differential Diagnosis**: Based STRICTLY on the documented signs, symptoms, history, and test results${hasTranscript ? ' from Facts JSON and Transcript' : ' in the JSON'}, list the most likely diagnosis first, then plausible differentials. For each differential, cite the specific documented findings that support or argue against it. Example: "Primary impression: Lateral epicondylalgia, supported by TTP over lateral epicondyle and pain with resisted wrist extension. Differential considerations include radial tunnel syndrome (less likely given absence of supinator tenderness) and C6 radiculopathy (less likely given intact dermatome sensation and negative Spurling's)."
   c. **Severity & Functional Impact**: Quantify severity using documented measurements. Relate impairments to functional limitations (e.g., "Grip strength deficit of 40% compared to contralateral side limits patient's ability to perform occupational tasks requiring sustained grip").
   d. **Prognostic Indicators**: Note factors from the documented data that inform prognosis (chronicity, aggravating/alleviating factors, prior treatment response, patient goals).
   e. ALL reasoning must trace directly to facts in the JSON${hasTranscript ? ' or statements in the Transcript' : ''} — never introduce diagnoses or clinical patterns that aren't supported by the documented data.
7. Plan: write concrete, specific treatment items linked to documented deficits with clinical rationale implied. Reference the assessment findings that justify each intervention. Use frequency/duration/intensity parameters where applicable (e.g., "Therapeutic exercise for rotator cuff strengthening, 3x/week x 6 weeks, to address documented supraspinatus weakness").
8. Use professional third-person clinical voice — concise sentences, no filler
9. Include tables for objective measurements (ROM, MMT, vitals, goniometric data) where applicable
10. NEVER add clinical data not present in ${hasTranscript ? 'either the Facts JSON or the Transcript' : 'the EncounterState JSON'} — clinical terminology upgrades are expected, fabricated findings are not
11. NEVER mention or list items that were not assessed, not documented, or not in ${hasTranscript ? 'either source' : 'the JSON'}
12. The compliance score is ${validation.compliance.score}% (grade: ${validation.compliance.grade})${validation.requiredMissing.length > 0 ? ` — missing: ${validation.requiredMissing.join(', ')}` : ''}

FRAMEWORK: ${sanitizeForPrompt(framework.name)}
TYPE: ${sanitizeForPrompt(framework.type)} — ${sanitizeForPrompt(framework.subtype)}

STRUCTURE:
${sectionPrompt}

OUTPUT: Return ONLY a JSON array: [{ "title": "section title", "content": "formatted section content with markdown" }]`;

        const noteUser = hasTranscript
          ? `STRUCTURED FACTS JSON:
${factsJson}

ENCOUNTER TRANSCRIPT:
${transcriptText}

Write a comprehensive clinical note using the structured facts as your primary data source, enriched by the encounter transcript for context, patient quotes, and clinical nuance. Omit sections with no relevant content from either source.`
          : `STRUCTURED FACTS JSON:
${factsJson}

Write the clinical note using the structured facts. Omit sections with no documented facts.`;

        const noteResult = await callAI(noteSystem, noteUser, 8000);
        totalTokens += noteResult.usage.input_tokens + noteResult.usage.output_tokens;

        if (noteResult.truncated) {
          appLog('warn', 'GenNote', 'Pass 1 LLM output truncated — note incomplete', {
            outputTokens: noteResult.usage.output_tokens,
            maxTokens: 8000,
          });
          send("error", {
            success: false,
            error: "Note generation was truncated (output too long). Please try again — if this persists, use a simpler framework.",
          });
          controller.close();
          return;
        }

        const clinicalNote = parseJsonArray(noteResult.content);
        appLog('info', 'GenNote', 'Pass 1 complete', { sections: clinicalNote.length });

        // ═══════════════════════════════════════════════════════
        // PASS 2: Audit + Summary (combined into one call)
        // ═══════════════════════════════════════════════════════
        send("progress", { pass: 2, total: 2, message: "Verifying accuracy..." });

        let auditClean = true;
        let auditIssues: string[] = [];
        let auditFailed = false;
        let summary = "Clinical note generated from encounter data.";

        try {
          const auditSystem = hasTranscript
            ? `You have two tasks:

TASK 1 — AUDIT: Compare this clinical note against the source data (Facts JSON + Encounter Transcript).
- Documented facts appearing in note: OK
- Clinical reasoning logically derived from documented facts or transcript statements: OK
- Clinical terminology upgrades of lay language: OK
- Reasonable clinical inferences from documented data: OK
- Any clinical data NOT traceable to the Facts JSON OR Transcript: FLAG as hallucination
- Blanks (___) for undocumented items: OK

TASK 2 — SUMMARY: Write a 2-3 sentence visit summary from the note. Be concise and clinical.

Return ONLY valid JSON:
{
  "audit": { "issues": ["description of any problems"], "clean": true },
  "summary": "2-3 sentence clinical summary"
}`
            : `You have two tasks:

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
}`;

          const auditUser = hasTranscript
            ? `STRUCTURED FACTS JSON:\n${factsJson}\n\nENCOUNTER TRANSCRIPT:\n${transcriptText}\n\nCLINICAL NOTE:\n${JSON.stringify(clinicalNote)}`
            : `ENCOUNTERSTATE FACTS:\n${factsJson}\n\nCLINICAL NOTE:\n${JSON.stringify(clinicalNote)}`;

          const auditResult = await callAI(
            auditSystem,
            auditUser,
            800,
          );
          totalTokens += auditResult.usage.input_tokens + auditResult.usage.output_tokens;

          if (auditResult.truncated) {
            appLog('warn', 'GenNote', 'Audit LLM output truncated', {
              outputTokens: auditResult.usage.output_tokens,
              maxTokens: 800,
            });
            auditClean = false;
            auditFailed = true;
            auditIssues = ['Hallucination audit output was truncated — please review the note manually'];
          } else {
            try {
              const auditJson = JSON.parse(stripFences(auditResult.content));
              if (auditJson.audit) {
                auditClean = auditJson.audit.clean !== false;
                auditIssues = auditJson.audit.issues || [];
              }
              if (auditJson.summary) {
                summary = auditJson.summary;
              }
            } catch (auditParseErr) {
              appLog('warn', 'GenNote', 'Audit JSON parse failed — marking audit as not completed', {
                error: scrubError(auditParseErr),
              });
              auditClean = false;
              auditFailed = true;
              auditIssues = ['Hallucination audit could not parse results — please review the note manually'];
            }
          }
        } catch (auditErr) {
          appLog('error', 'GenNote', 'Audit call failed', { error: scrubError(auditErr) });
          auditClean = false;
          auditFailed = true;
          auditIssues = ['Hallucination audit failed to run — please review the note manually'];
        }

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
        } catch (auditLogErr) {
          appLog('warn', 'GenNote', 'HIPAA audit log failed (non-blocking)', { error: scrubError(auditLogErr) });
        }

        // Send final result
        send("result", {
          success: true,
          clinicalNote,
          parsedData: clinicalNote, // Same format — for backward compat with UI
          compliance: validation.compliance,
          summary,
          auditClean,
          auditFailed,
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
