/**
 * Groq Whisper Chunk Transcription Endpoint
 *
 * Receives a WAV audio chunk (10-30s of speech) captured during recording
 * and returns text + word-level timestamps via Groq Whisper API.
 *
 * Called incrementally during recording — NOT after stop.
 * Word timestamps are offset by globalStartSec to map to absolute recording time.
 */

import { auth } from "@/lib/auth";
import { assertPhiApprovedEndpoint } from "@/lib/phi-boundaries";
import { appLog, scrubError, errorCode } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// Medical terminology priming for Whisper prompt
const MEDICAL_PROMPT_PREFIX =
  "Medical clinical encounter. Terms: ROM, MMT, AROM, PROM, PHQ-9, GAD-7, " +
  "C-SSRS, AUDIT-C, ADL, IADL, goniometer, dorsiflexion, plantarflexion, " +
  "supination, pronation, flexion, extension, abduction, adduction, " +
  "WNL, BID, TID, QID, PRN, SOAP, HPI, ROS, CPT, ICD-10, E/M, " +
  "hemoglobin, creatinine, troponin, systolic, diastolic, A1C, " +
  "SSRI, benzodiazepine, psychosis, suicidal ideation, DSM-5.";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;
    const prompt = formData.get("prompt") as string || "";
    const chunkIndex = parseInt(formData.get("chunkIndex") as string || "0", 10);
    const globalStartSec = parseFloat(formData.get("globalStartSec") as string || "0");

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: "No audio file provided" },
        { status: 400 },
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { success: false, error: "Groq API key not configured" },
        { status: 500 },
      );
    }

    const audioBuffer = await audioFile.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: "audio/wav" });

    appLog("info", "TranscribeChunk", "Starting Groq Whisper request", {
      chunkIndex,
      globalStartSec: Math.round(globalStartSec),
      sizeBytes: audioBuffer.byteLength,
    });

    // Build the prompt — medical terms + last sentence for context continuity
    const fullPrompt = prompt
      ? `${MEDICAL_PROMPT_PREFIX} ${prompt.slice(-200)}`
      : MEDICAL_PROMPT_PREFIX;

    // Call Groq Whisper API
    const groqFormData = new FormData();
    groqFormData.append("file", audioBlob, `chunk_${chunkIndex}.wav`);
    groqFormData.append("model", "whisper-large-v3-turbo");
    groqFormData.append("response_format", "verbose_json");
    groqFormData.append("language", "en");
    groqFormData.append("timestamp_granularities[]", "word");
    groqFormData.append("prompt", fullPrompt);

    const groqUrl = "https://api.groq.com/openai/v1/audio/transcriptions";
    assertPhiApprovedEndpoint(groqUrl);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    const groqResponse = await fetch(groqUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: groqFormData,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!groqResponse.ok) {
      const code = errorCode();
      const status = groqResponse.status;
      appLog("error", "TranscribeChunk", "Groq Whisper request failed", { status, code, chunkIndex });
      return NextResponse.json(
        { success: false, error: "Transcription failed", code },
        { status: 500 },
      );
    }

    const groqResult = await groqResponse.json();

    // Extract text and word-level timestamps
    const text: string = groqResult.text || "";
    const rawWords: Array<{ word: string; start: number; end: number }> =
      groqResult.words || [];
    const duration: number = groqResult.duration || 0;

    // Offset word timestamps by globalStartSec so they map to absolute recording time
    const words = rawWords.map((w) => ({
      word: w.word,
      start: Math.round((w.start + globalStartSec) * 1000) / 1000,
      end: Math.round((w.end + globalStartSec) * 1000) / 1000,
    }));

    appLog("info", "TranscribeChunk", "Groq Whisper success", {
      chunkIndex,
      textLength: text.length,
      wordCount: words.length,
      durationSec: Math.round(duration),
    });

    return NextResponse.json(
      {
        success: true,
        text,
        words,
        duration,
        chunkIndex,
        globalStartSec,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const code = errorCode();
    appLog("error", "TranscribeChunk", "Unhandled error", { code, error: scrubError(error) });
    return NextResponse.json(
      { success: false, error: "Transcription service error", code },
      { status: 500 },
    );
  }
}
