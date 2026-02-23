import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { assertProductionApiKey } from "@/lib/phi-boundaries";
import { callAI, getActiveProvider } from "@/lib/ai-provider";
import { appLog, scrubError, errorCode } from "@/lib/logger";
import { NextRequest } from "next/server";

export const maxDuration = 300;
import { frameworks } from "@/lib/frameworks";
import { mockNotes } from "@/lib/mock-data";
import { calculateCompliance } from "@/lib/cms-requirements";
import { validateEncounterState } from "@/lib/encounter-validator";
import { serializeFactsForPrompt, type EncounterState } from "@/lib/encounter-state";

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
      title: "⚠ Formatting Error",
      content: "The note could not be formatted correctly. The raw output is shown below — please regenerate.\n\n---\n\n" + raw.substring(0, 2000),
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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    let noteKey = "pt-eval";
    if (frameworkId === "med-soap-followup" || frameworkId === "med-soap-new" || frameworkId === "med-awv") {
      noteKey = "soap-followup";
    } else if (frameworkId?.startsWith("bh-")) {
      noteKey = "bh-intake";
    }
    const note = mockNotes[noteKey];
    return new Response(JSON.stringify({
      success: true,
      parsedData: note || mockNotes["pt-eval"],
      clinicalNote: note || mockNotes["pt-eval"],
      summary: "Mock-generated clinical note.",
      generationTime: 2.0,
      source: "mock",
    }), { headers: { "Content-Type": "application/json" } });
  }

  const framework = frameworks.find((f) => f.id === frameworkId);
  if (!framework) {
    return new Response(JSON.stringify({ success: false, error: "Framework not found" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  // ═══════════════════════════════════════════════════════════════
  // ENCOUNTER-STATE MODE — 2-pass pipeline (30-45 seconds)
  // Used when real-time extraction built the EncounterState during recording
  // ═══════════════════════════════════════════════════════════════
  if (mode === 'encounter-state' && encounterState) {
    return handleEncounterStateMode(encounterState as EncounterState, framework, frameworkId, session);
  }

  const transcriptText = regenerateFrom || transcript;
  if (!transcriptText || transcriptText.trim().length === 0) {
    return new Response(JSON.stringify({ success: false, error: "No transcript provided" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  // Stream response to keep connection alive
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: Record<string, unknown>) {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      }

      try {
        const startTime = Date.now();
        let totalTokens = 0;
        appLog('info', 'GenNote', 'Starting generation', { frameworkId, transcriptLength: transcriptText.length });

        // ═══════════════════════════════════════════════════════════════
        // PASS 0: PHI DE-IDENTIFICATION (Claude — keeps PHI local to Anthropic)
        // ═══════════════════════════════════════════════════════════════
        send("progress", { pass: 0, total: 7, message: "Securing patient data..." });

        const deidentifySystem = `You are a HIPAA de-identification engine. Replace all Protected Health Information (PHI) in the transcript with consistent placeholder tokens.

REPLACE these PHI categories:
- Patient names → [PATIENT_NAME], [PATIENT_NAME_2], etc.
- Provider/clinician names → [PROVIDER_NAME], [PROVIDER_NAME_2], etc.
- Dates of birth → [DOB]
- Social Security Numbers → [SSN]
- Medical Record Numbers → [MRN]
- Phone numbers → [PHONE]
- Addresses (street, city, zip) → [ADDRESS]
- Email addresses → [EMAIL]
- Insurance/policy numbers → [INSURANCE_ID]
- Facility names → [FACILITY_NAME]
- Any other unique identifiers → [ID_1], [ID_2], etc.

KEEP these (not PHI for clinical purposes):
- Age (e.g., "45 years old") — KEEP
- Gender — KEEP
- Occupation (general, e.g., "construction worker") — KEEP
- All clinical data (diagnoses, medications, vitals, symptoms) — KEEP
- Dates of service (keep relative: "today", "3 weeks ago") — KEEP but replace absolute dates with [DATE_1], [DATE_2]

RULES:
1. Use CONSISTENT tokens — same person = same token throughout
2. Return TWO things: the scrubbed transcript AND a mapping table
3. The mapping table maps each token to the original value
4. Do NOT alter clinical content — only identifiers

Return JSON:
{
  "scrubbed_transcript": "the full transcript with PHI replaced",
  "phi_map": { "[PATIENT_NAME]": "original name", "[DOB]": "original DOB", ... }
}`;

        const deidentifyResult = await callAI(deidentifySystem, transcriptText, 16000);
        totalTokens += (deidentifyResult.usage?.input_tokens || 0) + (deidentifyResult.usage?.output_tokens || 0);
        
        let scrubbedTranscript = transcriptText;
        let phiMap: Record<string, string> = {};
        try {
          const deidentJson = JSON.parse(deidentifyResult.content.replace(/```json\n?/g, "").replace(/```/g, "").trim());
          scrubbedTranscript = deidentJson.scrubbed_transcript || transcriptText;
          phiMap = deidentJson.phi_map || {};
          console.log("[GenNote] Pass 0 (de-identification) complete. PHI tokens:", Object.keys(phiMap).length);
        } catch (e) {
          console.warn("[GenNote] De-identification parse failed, using original transcript:", String(e));
        }

        // Helper: re-identify text by replacing tokens with original values
        function reidentify(text: string): string {
          let result = text;
          // Sort by token length descending to avoid partial replacements
          const sortedTokens = Object.entries(phiMap).sort((a, b) => b[0].length - a[0].length);
          for (const [token, original] of sortedTokens) {
            result = result.split(token).join(original);
          }
          return result;
        }

        // Use scrubbed transcript for all subsequent passes
        const safeTranscript = scrubbedTranscript;

        // ═══════════════════════════════════════════════════════════════
        // PASS 1: STRUCTURED FACT EXTRACTION (DeepSeek)
        // ═══════════════════════════════════════════════════════════════
        send("progress", { pass: 1, total: 7, message: "Extracting clinical facts..." });

        const schemaFields = framework.sections.map((s) => {
          const items = s.items.map((item) => {
            return `"${item.toLowerCase().replace(/[^a-z0-9]/g, '_')}": { "value": "string or null", "source": "transcript | not_documented | patient_denies" }`;
          });
          return `"${s.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}": {\n      ${items.join(",\n      ")}\n    }`;
        });

        const extractSystem = `You are a clinical transcript fact extractor. You extract ONLY explicitly stated facts from a clinical encounter transcript into a structured JSON format.

ABSOLUTE RULES:
1. If a data element is explicitly stated in the transcript, set "value" to the stated information and "source" to "transcript".
2. If the patient or clinician explicitly denies or negates something, set "value" to the denial and "source" to "patient_denies".
3. If a data element is NOT mentioned anywhere in the transcript, set "value" to null and "source" to "not_documented".
4. NEVER fabricate, guess, infer, or assume ANY clinical data.
5. NEVER use your medical knowledge to fill in expected findings.
6. NEVER add information from medical training — only from the transcript.
7. Use the EXACT words from the transcript for demographics, occupation, and all factual data.
8. For measurements (ROM, vitals, scores): use ONLY exact numbers stated.
9. For clinical findings: use ONLY findings explicitly described.
10. If the clinician says "everything else is within normal limits" or "the rest is normal", mark those items as value: "WNL" with source: "transcript".
11. If the transcript says "no substance use" or "denies substance use" globally, apply to ALL substance subcategories with source "patient_denies".
12. If demographics are stated, ensure they appear in BOTH patient_demographics AND any relevant section fields.
13. The transcript may contain [silence] markers indicating periods of no speech
    (e.g., patient performing exercises, manual therapy). Ignore these markers
    entirely — do not extract or fabricate data for silent periods.
14. The transcript may have speaker labels (Clinician/Patient). Use these to distinguish:
    - Patient-reported symptoms, history, and goals (source: "transcript", note who reported it)
    - Clinician observations, measurements, and assessments (source: "transcript")
    - If the Patient states something, prefer "Patient reports..." phrasing
    - If the Clinician states findings, prefer clinical observation phrasing

Return valid JSON matching the schema provided.`;

        const extractUser = `Extract clinical facts from this transcript into the following JSON schema.

JSON SCHEMA:
{
  "patient_demographics": {
    "name": { "value": "string or null", "source": "transcript | not_documented" },
    "age": { "value": "string or null", "source": "transcript | not_documented" },
    "gender": { "value": "string or null", "source": "transcript | not_documented" },
    "occupation": { "value": "string or null", "source": "transcript | not_documented" },
    "handedness": { "value": "string or null", "source": "transcript | not_documented" }
  },
  ${schemaFields.join(",\n  ")},
  "additional_facts": [
    { "fact": "string", "quote": "approximate quote from transcript", "source": "transcript" }
  ]
}

TRANSCRIPT:
---
${safeTranscript}
---

Remember: null and "not_documented" for ANYTHING not explicitly stated.`;

        const extractResult = await callAI(extractSystem, extractUser, 4000);
        // Strip markdown code fences — LLMs frequently wrap JSON in ```json``` blocks
        const structuredFacts = stripFences(extractResult.content);
        totalTokens += extractResult.usage.input_tokens + extractResult.usage.output_tokens;
        appLog('info', 'GenNote', 'Pass 1 complete', { factsLength: structuredFacts.length });

        // COMPLIANCE SCORING
        const compliance = calculateCompliance(frameworkId, structuredFacts);
        appLog('info', 'GenNote', 'Compliance calculated', { score: compliance.score, grade: compliance.grade, missingCount: compliance.missing.length });

        // ═══════════════════════════════════════════════════════════════
        // PASS 2: CLINICAL SYNTHESIS
        // ═══════════════════════════════════════════════════════════════
        send("progress", { pass: 2, total: 7, message: "Generating clinical reasoning..." });

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

        const synthesisSystem = `You are an experienced ${clinicianType}. You are reviewing structured clinical facts extracted from a patient encounter.

Your job is to SYNTHESIZE the documented findings into clinical reasoning. You may ONLY reason from facts present in the JSON (source: "transcript" or "patient_denies"). You must NOT introduce new clinical data.

Generate:

1. **Clinical Impression / Diagnosis**: Connect documented findings to the most likely clinical picture. Reference specific documented values.

2. **Problem List**: Key clinical problems identified from documented findings. Each must trace to specific facts.

3. **Severity/Functional Impact**: Based on documented limitations, pain levels, and measurements.

4. **Rehabilitation/Treatment Potential**: Based on documented history, goals, and presentation.

5. **Recommended Focus Areas**: What the plan of care should prioritize, linked to specific deficits.

RULES:
- Every statement MUST trace to a non-null JSON fact
- If insufficient data for a category, write "[Insufficient documented data]"
- You ARE allowed to: connect findings to diagnoses, assess severity, suggest focus areas, assess prognosis
- You are NOT allowed to: invent findings, assume tests not performed, add undocumented data

Return valid JSON:
{
  "clinical_impression": "string",
  "problem_list": ["string"],
  "severity_assessment": "string",
  "rehab_potential": "string",
  "recommended_focus": ["string"],
  "reasoning_notes": "string"
}`;

        const synthesisUser = `Review these extracted clinical facts and provide your clinical synthesis:

${structuredFacts}

Framework: ${framework.name} (${framework.type} — ${framework.subtype})

Synthesize ONLY from documented facts (source: "transcript").`;

        const synthesisResult = await callAI(synthesisSystem, synthesisUser, 2000);
        totalTokens += synthesisResult.usage.input_tokens + synthesisResult.usage.output_tokens;
        let clinicalSynthesis;
        try {
          const raw = synthesisResult.content.replace(/```json\n?/g, "").replace(/```/g, "").trim();
          clinicalSynthesis = JSON.parse(raw);
        } catch {
          clinicalSynthesis = { clinical_impression: synthesisResult.content, problem_list: [], severity_assessment: "", rehab_potential: "", recommended_focus: [], reasoning_notes: "" };
        }
        appLog('info', 'GenNote', 'Pass 2 complete');

        // ═══════════════════════════════════════════════════════════════
        // PASS 3: PARSED DATA
        // ═══════════════════════════════════════════════════════════════
        send("progress", { pass: 3, total: 7, message: "Building parsed data sections..." });

        const sectionPrompt = framework.sections
          .map((s) => {
            const items = s.items.join(", ");
            return `### ${s.title}\nItems: ${items}`;
          })
          .join("\n\n");

        const parsedDataSystem = `You are a clinical data renderer. You convert structured JSON clinical facts into a formatted parsed data document.

This is the RAW PARSED DATA layer — facts only, no interpretation.

RULES:
1. For fields with source "transcript" and non-null value: render the documented value
2. For fields with source "not_documented" or null value: render as "___" (blank for clinician to fill)
3. For fields with source "patient_denies": render as "Patient denies [item]"
4. For fields with value "WNL": render as "WNL" or "Within normal limits"
5. Do NOT add any clinical reasoning, assessment, or interpretation
6. Do NOT connect findings or suggest diagnoses
7. This is PURELY a structured data display
8. Use clinical formatting (tables for ROM/MMT, bullet lists for findings)
9. Include patient demographics at the top if available
10. For Assessment/Plan sections: render ONLY documented facts. If the clinician stated a diagnosis, include it. If not, use "___".

FRAMEWORK: ${framework.name}
TYPE: ${framework.type} — ${framework.subtype}

STRUCTURE:
${sectionPrompt}

OUTPUT: Return ONLY a JSON array: [{ "title": "section title", "content": "formatted section content with markdown" }]`;

        const parsedDataUser = `Render these clinical facts as parsed data sections. Facts only — no interpretation.

${structuredFacts}

Every null/"not_documented" item → "___". Do not skip any items.`;

        const parsedDataResult = await callAI(parsedDataSystem, parsedDataUser, 6000);
        totalTokens += parsedDataResult.usage.input_tokens + parsedDataResult.usage.output_tokens;
        const parsedData = parseJsonArray(parsedDataResult.content);
        appLog('info', 'GenNote', 'Pass 3 complete', { sections: parsedData.length });

        // ═══════════════════════════════════════════════════════════════
        // PASS 4: FINAL CLINICAL NOTE
        // ═══════════════════════════════════════════════════════════════
        send("progress", { pass: 4, total: 7, message: "Writing clinical note..." });

        const clinicalNoteSystem = `You are a senior ${clinicianType} writing the final clinical note for the medical record. You are combining two inputs:

1. PARSED DATA: The documented facts from the encounter (with blanks for undocumented items)
2. CLINICAL REASONING: AI-generated clinical synthesis based on documented findings

Your job is to produce a POLISHED, COMPLETE clinical note that:

RULES:
1. Include ALL documented facts from the parsed data in proper clinical format
2. For Assessment/Impression sections: weave in the clinical reasoning naturally. Write it as a clinician would — connecting findings to impressions, not just listing them.
3. For Plan sections: incorporate recommended focus areas into concrete treatment plan items
4. Keep blanks (___) for truly undocumented items — do NOT fill them in
5. Write in professional third-person clinical voice
6. The note should read as if written by an experienced clinician, not as separate "data" and "reasoning" blocks
7. Do NOT use "⚡" markers or "AI" labels in the final note — this is the chart-ready version
8. The clinical reasoning should flow naturally into the assessment and plan, not be called out separately
9. Use proper medical terminology and standard clinical note formatting
10. Include tables for objective measurements (ROM, MMT, vitals) where applicable
11. For rehabilitation notes (PT, OT, SLP): include a BILLING SUMMARY at the end of the Objective section as a table with columns: CPT Code, Description, Minutes, Units. Use the 8-minute rule (8-22 min = 1 unit, 23-37 min = 2 units, 38-52 min = 3 units, 53-67 min = 4 units). Common codes:
    - 97110 Therapeutic Exercise
    - 97112 Neuromuscular Re-education  
    - 97140 Manual Therapy Techniques
    - 97530 Therapeutic Activities
    - 97535 Self-Care/Home Management Training
    - 97542 Wheelchair Management
    - 97150 Group Therapy
    - 97032 Electrical Stimulation (attended)
    - 97035 Ultrasound
    - 97010 Hot/Cold Packs (untimed, no units)
    - 97161/97162/97163 PT Eval (Low/Mod/High complexity)
    - 97165/97166/97167 OT Eval (Low/Mod/High complexity)
    - 92521-92524 SLP Eval
    - 97164 PT Re-evaluation
    - 97168 OT Re-evaluation
    Extract the interventions, time spent, and map to appropriate CPT codes. Calculate units using the 8-minute rule. Include total skilled time and total billable units.

FRAMEWORK: ${framework.name}
TYPE: ${framework.type} — ${framework.subtype}

STRUCTURE:
${sectionPrompt}

OUTPUT: Return ONLY a JSON array: [{ "title": "section title", "content": "formatted section content with markdown" }]`;

        const clinicalNoteUser = `PARSED DATA (documented facts):
${JSON.stringify(parsedData, null, 2)}

CLINICAL REASONING (synthesis from documented findings):
${JSON.stringify(clinicalSynthesis, null, 2)}

Write the final clinical note. Merge the parsed data and clinical reasoning into a cohesive, professional clinical document. Assessment and Plan sections should reflect the clinical reasoning integrated with documented findings. Keep ___ for undocumented items.`;

        const clinicalNoteResult = await callAI(clinicalNoteSystem, clinicalNoteUser, 8000);
        totalTokens += clinicalNoteResult.usage.input_tokens + clinicalNoteResult.usage.output_tokens;
        const clinicalNote = parseJsonArray(clinicalNoteResult.content);
        appLog('info', 'GenNote', 'Pass 4 complete', { sections: clinicalNote.length });

        // Re-identify: restore PHI tokens to original values in the final note
        for (const section of clinicalNote) {
          section.content = reidentify(section.content);
          section.title = reidentify(section.title);
        }
        // Also re-identify parsed data
        for (const section of parsedData) {
          section.content = reidentify(section.content);
          section.title = reidentify(section.title);
        }
        console.log("[GenNote] Re-identification complete.");

        // ═══════════════════════════════════════════════════════════════
        // PASS 5: HALLUCINATION AUDIT
        // ═══════════════════════════════════════════════════════════════
        send("progress", { pass: 5, total: 7, message: "Running hallucination audit..." });

        let auditClean = true;
        let auditIssues: string[] = [];
        try {
          const auditResult = await callAI(
            `You are a clinical note auditor. Compare the final clinical note against the structured facts AND clinical synthesis.

RULES:
- Documented facts from JSON appearing in the note: OK
- Clinical reasoning that logically follows from documented facts: OK
- Any clinical data NOT traceable to JSON facts or logical synthesis: FLAG as hallucination
- Blanks (___) for undocumented items: OK
- Standard clinical formatting: OK

Return ONLY valid JSON: { "issues": ["description"], "clean": true/false }`,
            `FACTS JSON:\n${structuredFacts}\n\nSYNTHESIS:\n${JSON.stringify(clinicalSynthesis)}\n\nFINAL NOTE:\n${JSON.stringify(clinicalNote)}`,
            500
          );
          try {
            const auditJson = JSON.parse(stripFences(auditResult.content));
            auditClean = auditJson.clean !== false;
            auditIssues = auditJson.issues || [];
          } catch { /* ok */ }
          totalTokens += auditResult.usage.input_tokens + auditResult.usage.output_tokens;
        } catch { /* non-critical */ }
        appLog('info', 'GenNote', 'Pass 5 complete', { auditClean: auditClean ?? true, issueCount: auditIssues?.length ?? 0 });

        // ═══════════════════════════════════════════════════════════════
        // PASS 6: SUMMARY
        // ═══════════════════════════════════════════════════════════════
        send("progress", { pass: 6, total: 7, message: "Generating summary..." });

        let summary = "Clinical note generated from encounter transcript.";
        try {
          const summaryResult = await callAI(
            "Write a 2-3 sentence visit summary including the clinical impression. Be concise and clinical.",
            `SYNTHESIS: ${JSON.stringify(clinicalSynthesis)}\nNOTE: ${JSON.stringify(clinicalNote)}`,
            300
          );
          summary = reidentify(summaryResult.content || summary);
          totalTokens += summaryResult.usage.input_tokens + summaryResult.usage.output_tokens;
        } catch { /* non-critical */ }

        const generationTime = (Date.now() - startTime) / 1000;
        appLog('info', 'GenNote', 'Complete', { generationTime, totalTokens, frameworkId });

        // HIPAA audit log — note generation event
        try {
          await auditLog({
            userId: session.user.id,
            action: "GENERATE_NOTE",
            resource: `framework:${frameworkId}`,
            details: { frameworkId, transcriptLength: transcriptText.length, tokensUsed: totalTokens, generationTime },
          });
        } catch { /* non-critical — don't fail the note */ }

        // Send final result
        send("result", {
          success: true,
          parsedData,
          clinicalSynthesis,
          clinicalNote,
          compliance,
          summary,
          extractedFacts: structuredFacts,
          auditClean,
          auditIssues: auditIssues.length > 0 ? auditIssues : undefined,
          generationTime: Math.round(generationTime * 10) / 10,
          source: getActiveProvider(),
          tokensUsed: totalTokens,
        });
      } catch (error) {
        const code = errorCode();
        appLog('error', 'GenNote', 'Pipeline error', { code, error: scrubError(error) });
        send("error", { success: false, error: "Note generation failed", code });
      } finally {
        controller.close();
      }
    }
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

// ═══════════════════════════════════════════════════════════════
// ENCOUNTER-STATE 2-PASS PIPELINE
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

        appLog('info', 'GenNote', 'Starting encounter-state 2-pass pipeline', {
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
            const items = s.items.join(", ");
            return `### ${s.title}\nItems: ${items}`;
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
2. For items with source "patient_denies": include as "Patient denies [item]"
3. For items NOT present in the JSON: render as "___" (blank for clinician to fill)
4. Weave clinical reasoning naturally into Assessment — connect documented findings to clinical impressions, assess severity, functional impact
5. Plan section: concrete treatment items linked to documented deficits
6. Use professional third-person clinical voice
7. Include tables for objective measurements (ROM, MMT, vitals) where applicable
8. NEVER add clinical data not present in the EncounterState JSON
9. The compliance score is ${validation.compliance.score}% (grade: ${validation.compliance.grade})${validation.requiredMissing.length > 0 ? ` — missing: ${validation.requiredMissing.join(', ')}` : ''}

FRAMEWORK: ${framework.name}
TYPE: ${framework.type} — ${framework.subtype}

STRUCTURE:
${sectionPrompt}

OUTPUT: Return ONLY a JSON array: [{ "title": "section title", "content": "formatted section content with markdown" }]`;

        const noteUser = `ENCOUNTERSTATE FACTS:
${factsJson}

Write the complete clinical note. Every fact in the JSON must appear in the note. Missing items get "___".`;

        const noteResult = await callAI(noteSystem, noteUser, 8000);
        totalTokens += noteResult.usage.input_tokens + noteResult.usage.output_tokens;
        const clinicalNote = parseJsonArray(noteResult.content);
        appLog('info', 'GenNote', 'Pass 1 (encounter-state) complete', { sections: clinicalNote.length });

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
        appLog('info', 'GenNote', 'EncounterState pipeline complete', {
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
        appLog('error', 'GenNote', 'EncounterState pipeline error', { code, error: scrubError(error) });
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
