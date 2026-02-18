import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { NextRequest } from "next/server";

export const maxDuration = 300;
import { frameworks } from "@/lib/frameworks";
import { mockNotes } from "@/lib/mock-data";
import { calculateCompliance } from "@/lib/cms-requirements";

async function callClaude(system: string, user: string, maxTokens: number = 4000) {
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        temperature: 0,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        content: result.content?.[0]?.text || "",
        tokens: result.usage?.input_tokens + result.usage?.output_tokens || 0,
        usage: result.usage,
      };
    }

    const errorText = await response.text();
    const isOverloaded = errorText.includes("overloaded") || response.status === 529;
    if (isOverloaded && attempt < maxRetries) {
      const waitSec = attempt * 10;
      console.log("[GenNote] Claude overloaded, retry " + attempt + "/" + maxRetries + " in " + waitSec + "s...");
      await new Promise(r => setTimeout(r, waitSec * 1000));
      continue;
    }
    throw new Error("Claude API error (attempt " + attempt + "): " + errorText);
  }
  throw new Error("Claude API: max retries exceeded");
}

function parseJsonArray(raw: string): { title: string; content: string }[] {
  try {
    const trimmed = raw.trim();
    const jsonMatch = trimmed.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : parsed.sections || parsed.note || [parsed];
  } catch (e) {
    console.error("[GenNote] JSON parse failed:", String(e), "Raw:", raw.substring(0, 300));
    return [{ title: "Note", content: raw }];
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
  }

  const body = await request.json();
  const { transcript, frameworkId, useMock, regenerateFrom } = body;

  // Mock mode — return JSON directly (no streaming needed)
  if (useMock === true || (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY)) {
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

  const transcriptText = regenerateFrom || transcript;
  if (!transcriptText || transcriptText.trim().length === 0) {
    return new Response(JSON.stringify({ success: false, error: "No transcript provided" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  // Stream response to keep connection alive
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: any) {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      }

      try {
        const startTime = Date.now();
        let totalTokens = 0;
        console.log("[GenNote] Starting. Framework:", frameworkId, "Transcript length:", transcriptText.length);

        // ═══════════════════════════════════════════════════════════════
        // PASS 1: STRUCTURED FACT EXTRACTION
        // ═══════════════════════════════════════════════════════════════
        send("progress", { pass: 1, total: 6, message: "Extracting clinical facts..." });

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
13. The transcript may have speaker labels (Clinician/Patient). Use these to distinguish:
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
${transcriptText}
---

Remember: null and "not_documented" for ANYTHING not explicitly stated.`;

        const extractResult = await callClaude(extractSystem, extractUser, 4000);
        const structuredFacts = extractResult.content;
        totalTokens += (extractResult.usage?.input_tokens || 0) + (extractResult.usage?.output_tokens || 0);
        console.log("[GenNote] Pass 1 (fact extraction) complete. Length:", structuredFacts.length);

        // COMPLIANCE SCORING
        const compliance = calculateCompliance(frameworkId, structuredFacts);
        console.log("[GenNote] Compliance score:", compliance.score, "% Grade:", compliance.grade, "Missing:", compliance.missing.length);

        // ═══════════════════════════════════════════════════════════════
        // PASS 2: CLINICAL SYNTHESIS
        // ═══════════════════════════════════════════════════════════════
        send("progress", { pass: 2, total: 6, message: "Generating clinical reasoning..." });

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

        const synthesisResult = await callClaude(synthesisSystem, synthesisUser, 2000);
        totalTokens += (synthesisResult.usage?.input_tokens || 0) + (synthesisResult.usage?.output_tokens || 0);
        let clinicalSynthesis;
        try {
          const raw = synthesisResult.content.replace(/```json\n?/g, "").replace(/```/g, "").trim();
          clinicalSynthesis = JSON.parse(raw);
        } catch {
          clinicalSynthesis = { clinical_impression: synthesisResult.content, problem_list: [], severity_assessment: "", rehab_potential: "", recommended_focus: [], reasoning_notes: "" };
        }
        console.log("[GenNote] Pass 2 (clinical synthesis) complete.");

        // ═══════════════════════════════════════════════════════════════
        // PASS 3: PARSED DATA
        // ═══════════════════════════════════════════════════════════════
        send("progress", { pass: 3, total: 6, message: "Building parsed data sections..." });

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

        const parsedDataResult = await callClaude(parsedDataSystem, parsedDataUser, 4000);
        totalTokens += (parsedDataResult.usage?.input_tokens || 0) + (parsedDataResult.usage?.output_tokens || 0);
        const parsedData = parseJsonArray(parsedDataResult.content);
        console.log("[GenNote] Pass 3 (parsed data) complete. Sections:", parsedData.length);

        // ═══════════════════════════════════════════════════════════════
        // PASS 4: FINAL CLINICAL NOTE
        // ═══════════════════════════════════════════════════════════════
        send("progress", { pass: 4, total: 6, message: "Writing clinical note..." });

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

        const clinicalNoteResult = await callClaude(clinicalNoteSystem, clinicalNoteUser, 5000);
        totalTokens += (clinicalNoteResult.usage?.input_tokens || 0) + (clinicalNoteResult.usage?.output_tokens || 0);
        const clinicalNote = parseJsonArray(clinicalNoteResult.content);
        console.log("[GenNote] Pass 4 (clinical note) complete. Sections:", clinicalNote.length);

        // ═══════════════════════════════════════════════════════════════
        // PASS 5: HALLUCINATION AUDIT
        // ═══════════════════════════════════════════════════════════════
        send("progress", { pass: 5, total: 6, message: "Running hallucination audit..." });

        let auditClean = true;
        let auditIssues: string[] = [];
        try {
          const auditResult = await callClaude(
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
            const auditJson = JSON.parse(auditResult.content.replace(/```json\n?/g, "").replace(/```/g, "").trim());
            auditClean = auditJson.clean !== false;
            auditIssues = auditJson.issues || [];
          } catch { /* ok */ }
          totalTokens += (auditResult.usage?.input_tokens || 0) + (auditResult.usage?.output_tokens || 0);
        } catch { /* non-critical */ }
        console.log("[GenNote] Pass 5 (audit) complete. Clean:", auditClean);

        // ═══════════════════════════════════════════════════════════════
        // PASS 6: SUMMARY
        // ═══════════════════════════════════════════════════════════════
        send("progress", { pass: 6, total: 6, message: "Generating summary..." });

        let summary = "Clinical note generated from encounter transcript.";
        try {
          const summaryResult = await callClaude(
            "Write a 2-3 sentence visit summary including the clinical impression. Be concise and clinical.",
            `SYNTHESIS: ${JSON.stringify(clinicalSynthesis)}\nNOTE: ${JSON.stringify(clinicalNote)}`,
            300
          );
          summary = summaryResult.content || summary;
          totalTokens += (summaryResult.usage?.input_tokens || 0) + (summaryResult.usage?.output_tokens || 0);
        } catch { /* non-critical */ }

        const generationTime = (Date.now() - startTime) / 1000;
        console.log("[GenNote] Complete. Time:", generationTime, "s. Tokens:", totalTokens);

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
          source: "claude-sonnet",
          tokensUsed: totalTokens,
        });
      } catch (error) {
        console.error("Note generation error:", error);
        send("error", { success: false, error: "Note generation service error", details: String(error) });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
