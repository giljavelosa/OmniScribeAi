import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { NextRequest } from "next/server";

export const maxDuration = 120;
import { frameworks } from "@/lib/frameworks";

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
        usage: result.usage,
      };
    }

    const errorText = await response.text();
    const isOverloaded = errorText.includes("overloaded") || response.status === 529;
    if (isOverloaded && attempt < maxRetries) {
      await new Promise(r => setTimeout(r, attempt * 10000));
      continue;
    }
    throw new Error("Claude API error: " + errorText);
  }
  throw new Error("Claude API: max retries exceeded");
}

function parseJsonArray(raw: string): { title: string; content: string }[] {
  try {
    const trimmed = raw.trim();
    const jsonMatch = trimmed.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : parsed.sections || parsed.note || [parsed];
  } catch {
    return [{ title: "Note", content: raw }];
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
  }

  const body = await request.json();
  const { parsedData, clinicalSynthesis, frameworkId } = body;

  if (!parsedData || !clinicalSynthesis || !frameworkId) {
    return new Response(JSON.stringify({ success: false, error: "Missing required fields" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const framework = frameworks.find((f) => f.id === frameworkId);
  if (!framework) {
    return new Response(JSON.stringify({ success: false, error: "Framework not found" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const startTime = Date.now();
    const sectionPrompt = framework.sections.map((s) => `### ${s.title}\nItems: ${s.items.join(", ")}`).join("\n\n");

    const clinicianType = framework.type === 'SOAP' || framework.type === 'H&P'
      ? 'physician'
      : framework.domain === 'rehabilitation'
        ? 'rehabilitation clinician (PT/OT/SLP)'
        : 'behavioral health clinician';

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
7. Do NOT use markers or labels — this is the chart-ready version
8. Use proper medical terminology and standard clinical note formatting
9. Include tables for objective measurements where applicable

FRAMEWORK: ${framework.name}
TYPE: ${framework.type} — ${framework.subtype}

STRUCTURE:
${sectionPrompt}

OUTPUT: Return ONLY a JSON array: [{ "title": "section title", "content": "formatted section content with markdown" }]`;

    const clinicalNoteUser = `PARSED DATA (documented facts):
${JSON.stringify(parsedData, null, 2)}

CLINICAL REASONING (clinician-reviewed synthesis):
${JSON.stringify(clinicalSynthesis, null, 2)}

Write the final clinical note. Merge the parsed data and clinical reasoning into a cohesive, professional clinical document.`;

    const result = await callClaude(clinicalNoteSystem, clinicalNoteUser, 5000);
    const clinicalNote = parseJsonArray(result.content);
    const generationTime = (Date.now() - startTime) / 1000;

    return new Response(JSON.stringify({
      success: true,
      clinicalNote,
      generationTime: Math.round(generationTime * 10) / 10,
    }), { headers: { "Content-Type": "application/json" } });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: String(error) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
