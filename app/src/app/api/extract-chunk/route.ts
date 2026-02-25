/**
 * Chunk Extraction + LLM Diarization Endpoint
 *
 * Receives transcribed text + word timestamps from a single audio chunk
 * and uses Grok LLM to:
 *   1. Identify speakers (CLINICIAN / PATIENT / UNKNOWN) from conversational context
 *   2. Extract clinical facts into the framework schema with evidence pointers
 *   3. Correct common medical term transcription errors
 *
 * Called incrementally during recording after each transcribe-chunk response.
 * Returns diarized statements + extracted facts for EncounterState merge.
 */

import { auth } from "@/lib/auth";
import { callAI } from "@/lib/ai-provider";
import { appLog, scrubError, errorCode } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { frameworks } from "@/lib/frameworks";
import { safeJsonKey } from "@/lib/prompt-sanitizer";
import type { ExtractionResult, DiarizedStatement, ClinicalFact } from "@/lib/encounter-state";

export const maxDuration = 60;

// Strip markdown code fences that LLMs sometimes wrap JSON in
function stripFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/gm, "").replace(/^```\s*/gm, "").trim();
}

interface ExtractRequest {
  text: string;
  words: Array<{ word: string; start: number; end: number }>;
  globalStartSec: number;
  frameworkId: string;
  previousContext?: {
    lastSpeaker: "CLINICIAN" | "PATIENT" | "UNKNOWN";
    topic: string;
    lastSentence: string;
  };
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: ExtractRequest = await request.json();
    const { text, words, globalStartSec, frameworkId, previousContext } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "No transcript text provided" },
        { status: 400 },
      );
    }

    const framework = frameworks.find((f) => f.id === frameworkId);
    if (!framework) {
      return NextResponse.json(
        { success: false, error: "Unknown framework" },
        { status: 400 },
      );
    }

    appLog("info", "ExtractChunk", "Starting extraction", {
      frameworkId,
      textLength: text.length,
      wordCount: words.length,
      globalStartSec: Math.round(globalStartSec),
    });

    // Build the framework schema for extraction (sanitized to prevent prompt injection)
    const schemaFields = framework.sections.map((s) => {
      const sectionKey = safeJsonKey(s.title);
      const items = s.items.map((item) => {
        const itemKey = safeJsonKey(item);
        return `"${itemKey}": { "value": "string or null", "source": "transcript | not_documented | patient_denies", "evidence": { "speaker": "CLINICIAN | PATIENT", "text": "exact quote", "t0": 0, "t1": 0 } | null }`;
      });
      return `"${sectionKey}": {\n        ${items.join(",\n        ")}\n      }`;
    });

    // Build context from previous chunk
    const contextInfo = previousContext
      ? `Previous chunk context: ${previousContext.lastSpeaker} was speaking about "${previousContext.topic}". Last sentence: "${previousContext.lastSentence}"`
      : "This is the first chunk of the encounter.";

    // Build word timestamp reference for evidence pointers
    const wordTimestamps = words.length > 0
      ? `\nWord timestamps (for evidence pointers):\n${words.map((w) => `"${w.word}" [${w.start.toFixed(2)}-${w.end.toFixed(2)}]`).join(", ")}`
      : "";

    const systemPrompt = `You are a clinical fact extractor AND speaker identifier for a medical encounter.

TASK 1 — SPEAKER IDENTIFICATION:
Identify who is speaking for each statement in this transcript chunk.
Rules:
- CLINICIAN: questions about symptoms, clinical observations, examination findings, measurements, treatment recommendations, clinical instructions, medical history questions
- PATIENT: symptom descriptions, pain reports, personal history, responses to questions, concerns, goals, functional complaints
- UNKNOWN: truly ambiguous (e.g., isolated "OK", "Mm-hmm" with no conversational context)
Use conversational flow: a question is typically followed by an answer from the other speaker.
${contextInfo}

TASK 2 — FACT EXTRACTION:
Extract clinical facts into the provided schema for framework: ${framework.name} (${framework.type} — ${framework.subtype}).
ABSOLUTE RULES:
1. Stated in transcript → value + source:"transcript" + evidence: {speaker, text (exact quote), t0, t1}
2. Explicitly denied → value + source:"patient_denies" + evidence pointer
3. NOT mentioned → value:null + source:"not_documented" + evidence:null
4. NEVER fabricate, infer, or assume ANY clinical data
5. NEVER use medical knowledge to fill in expected findings
6. Use EXACT words from transcript for all factual data
7. Measurements: ONLY exact numbers stated
8. If the clinician says "everything else is within normal limits" or "the rest is normal", mark those items as value:"WNL" source:"transcript"

TASK 3 — MEDICAL TERM CORRECTION:
If the transcript contains likely medical term errors, correct them in your extraction:
- "room" in ROM context → "ROM"
- "ph queue nine" → "PHQ-9"
- "gad seven" → "GAD-7"
- "see SSRS" → "C-SSRS"
- "audit see" → "AUDIT-C"
Only correct when context makes the medical term unambiguous.

Return ONLY valid JSON (no markdown fences):
{
  "statements": [
    { "speaker": "CLINICIAN | PATIENT | UNKNOWN", "text": "what they said", "t0": 0.0, "t1": 0.0 }
  ],
  "facts": {
    ${schemaFields.join(",\n    ")}
  },
  "additional_facts": [
    { "label": "string", "fact": { "value": "string", "source": "transcript", "evidence": { "speaker": "...", "text": "...", "t0": 0, "t1": 0 } } }
  ]
}

For evidence timestamps, use the word timestamps provided. Match evidence text to the closest word timestamps.
For "statements", group consecutive words by the same speaker into natural sentences/utterances.
Only include facts that are present in THIS chunk — leave everything else as null/not_documented.`;

    const userPrompt = `TRANSCRIPT CHUNK (position: ${globalStartSec.toFixed(1)}s in recording):
---
${text}
---
${wordTimestamps}

Extract speakers + clinical facts. Return JSON only.`;

    // FIX-44: Dynamic maxTokens based on framework complexity
    const totalItems = framework.sections.reduce((sum, s) => sum + s.items.length, 0);
    const estimatedTokens = 500 + totalItems * 60;
    const maxTokens = Math.max(4000, Math.min(estimatedTokens, 8000));
    appLog('info', 'ExtractChunk', 'Dynamic maxTokens', { totalItems, maxTokens });

    const result = await callAI(systemPrompt, userPrompt, maxTokens);

    appLog("info", "ExtractChunk", "LLM extraction complete", {
      outputLength: result.content.length,
      inputTokens: result.usage.input_tokens,
      outputTokens: result.usage.output_tokens,
      truncated: result.truncated,
    });

    // FIX-41: Return failure if LLM output was truncated
    if (result.truncated) {
      appLog("warn", "ExtractChunk", "LLM output truncated", {
        outputTokens: result.usage.output_tokens,
        maxTokens,
      });
      return NextResponse.json(
        { success: false, error: "LLM output truncated — extraction incomplete", retryable: true },
        { status: 200, headers: { "Cache-Control": "no-store" } },
      );
    }

    // Parse the LLM response
    let extraction: ExtractionResult;
    try {
      const cleaned = stripFences(result.content);
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON object found in response");
      }
      const parsed = JSON.parse(jsonMatch[0]);

      // Validate and normalize statements
      const statements: DiarizedStatement[] = (parsed.statements || []).map(
        (s: { speaker: unknown; text: unknown; t0: unknown; t1: unknown }) => ({
          speaker: validateSpeaker(s.speaker),
          text: String(s.text || ""),
          t0: Number(s.t0) || globalStartSec,
          t1: Number(s.t1) || globalStartSec,
        }),
      );

      // Validate and normalize facts
      const facts: Record<string, Record<string, ClinicalFact>> = {};
      if (parsed.facts && typeof parsed.facts === "object") {
        for (const [sectionKey, fields] of Object.entries(parsed.facts)) {
          if (typeof fields !== "object" || fields === null) continue;
          facts[sectionKey] = {};
          for (const [fieldKey, fact] of Object.entries(
            fields as Record<string, unknown>,
          )) {
            facts[sectionKey][fieldKey] = normalizeFact(fact);
          }
        }
      }

      // Validate and normalize additional facts
      const additional_facts: Array<{ label: string; fact: ClinicalFact }> = (
        parsed.additional_facts || []
      )
        .filter((af: { label?: string; fact?: { value?: string } }) => af?.label && af?.fact?.value)
        .map((af: { label: string; fact: unknown }) => ({
          label: String(af.label),
          fact: normalizeFact(af.fact),
        }));

      extraction = { statements, facts, additional_facts };
    } catch (parseError) {
      appLog("warn", "ExtractChunk", "JSON parse failed", {
        error: scrubError(parseError),
      });
      return NextResponse.json(
        { success: false, error: "Extraction parse failed", retryable: true },
        { status: 200, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      {
        success: true,
        extraction,
        usage: {
          input_tokens: result.usage.input_tokens,
          output_tokens: result.usage.output_tokens,
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const code = errorCode();
    appLog("error", "ExtractChunk", "Unhandled error", {
      code,
      error: scrubError(error),
    });
    return NextResponse.json(
      { success: false, error: "Extraction service error", code },
      { status: 500 },
    );
  }
}

// ─── Helpers ────────────────────────────────────────────────

function validateSpeaker(
  speaker: unknown,
): "CLINICIAN" | "PATIENT" | "UNKNOWN" {
  if (speaker === "CLINICIAN" || speaker === "PATIENT") return speaker;
  return "UNKNOWN";
}

function normalizeFact(raw: unknown): ClinicalFact {
  if (!raw || typeof raw !== "object") {
    return { value: null, source: "not_documented", evidence: null };
  }

  const r = raw as Record<string, unknown>;
  const value = r.value != null ? String(r.value) : null;
  const source =
    r.source === "transcript" || r.source === "patient_denies"
      ? r.source
      : "not_documented";

  let evidence = null;
  if (r.evidence && typeof r.evidence === "object" && value !== null) {
    const ev = r.evidence as Record<string, unknown>;
    evidence = {
      speaker: validateSpeaker(ev.speaker),
      text: String(ev.text || ""),
      t0: Number(ev.t0) || 0,
      t1: Number(ev.t1) || 0,
    };
  }

  return { value, source, evidence };
}
