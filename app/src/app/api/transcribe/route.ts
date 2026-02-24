import { auth } from "@/lib/auth";
import { assertPhiApprovedEndpoint } from "@/lib/phi-boundaries";
import { appLog, scrubError, errorCode } from "@/lib/logger";
import { isWavFile, splitWavFile } from "@/lib/audio-chunker";
export const maxDuration = 600;
import { NextRequest, NextResponse } from 'next/server';
import { mockTranscripts } from '@/lib/mock-data';

const SIZE_LIMIT = 24 * 1024 * 1024; // 24MB — leave headroom under Groq's 25MB cap

// Medical terminology priming for Whisper prompt
const MEDICAL_PROMPT =
  "Medical clinical encounter. Terms: ROM, MMT, AROM, PROM, PHQ-9, GAD-7, " +
  "C-SSRS, AUDIT-C, ADL, IADL, goniometer, dorsiflexion, plantarflexion, " +
  "supination, pronation, flexion, extension, abduction, adduction, " +
  "WNL, BID, TID, QID, PRN, SOAP, HPI, ROS, CPT, ICD-10, E/M, " +
  "hemoglobin, creatinine, troponin, systolic, diastolic, A1C, " +
  "SSRI, benzodiazepine, psychosis, suicidal ideation, DSM-5.";

const GROQ_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
  }

  try {
    const body = await request.formData();
    const audioFile = body.get('audio') as File | null;
    const frameworkId = body.get('frameworkId') as string || '';
    const useMock = body.get('useMock') as string;

    // If no audio or explicitly requesting mock, return mock data
    if (!audioFile || useMock === 'true') {
      await new Promise(resolve => setTimeout(resolve, 1500));
      let transcript = mockTranscripts['pt-eval'];
      if (frameworkId.startsWith('med-')) {
        transcript = mockTranscripts['soap-followup'];
      } else if (frameworkId.startsWith('bh-')) {
        transcript = mockTranscripts['bh-intake'];
      }
      return NextResponse.json({
        success: true,
        transcript,
        duration: 58,
        wordCount: transcript.split(/\s+/).length,
        confidence: 0.96,
        source: 'mock',
      });
    }

    // Real transcription via Groq Whisper
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    const audioBuffer = await audioFile.arrayBuffer();
    const mimeType = (audioFile.type || 'audio/wav').split(';')[0];
    const fileSize = audioBuffer.byteLength;

    appLog('info', 'Transcribe', 'Starting transcription', { sizeBytes: fileSize, mimeType });

    // ── Size-based routing ──
    if (fileSize > SIZE_LIMIT) {
      if (isWavFile(audioBuffer)) {
        // Large WAV → chunk and transcribe sequentially
        return await transcribeChunked(audioBuffer, audioFile.name || 'recording.wav', apiKey);
      } else {
        // Large non-WAV → reject (server-side conversion would require FFmpeg)
        const sizeMB = (fileSize / (1024 * 1024)).toFixed(1);
        return NextResponse.json(
          {
            success: false,
            error: `File is ${sizeMB}MB which exceeds the 24MB limit. Only WAV files can be automatically split into chunks. Please convert to WAV format, or use a shorter recording.`,
          },
          { status: 413 }
        );
      }
    }

    // ── Standard single-request path (≤ 24MB) ──
    return await transcribeSingle(audioBuffer, mimeType, audioFile.name || 'recording.wav', apiKey);

  } catch (error) {
    const code = errorCode();
    appLog('error', 'Transcribe', 'Unhandled error', { code, error: scrubError(error) });
    return NextResponse.json(
      { success: false, error: 'Transcription service error', code },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

// ── Single Groq Whisper request ──
async function transcribeSingle(
  audioBuffer: ArrayBuffer,
  mimeType: string,
  fileName: string,
  apiKey: string,
): Promise<NextResponse> {
  const groqFormData = new FormData();
  groqFormData.append('file', new Blob([audioBuffer], { type: mimeType }), fileName);
  groqFormData.append('model', 'whisper-large-v3-turbo');
  groqFormData.append('response_format', 'verbose_json');
  groqFormData.append('language', 'en');
  groqFormData.append('timestamp_granularities[]', 'word');
  groqFormData.append('prompt', MEDICAL_PROMPT);

  assertPhiApprovedEndpoint(GROQ_URL);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  const groqResponse = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: groqFormData,
    signal: controller.signal,
  });
  clearTimeout(timeout);

  if (!groqResponse.ok) {
    const code = errorCode();
    appLog('error', 'Transcribe', 'Groq Whisper request failed', { status: groqResponse.status, code });
    return NextResponse.json(
      { success: false, error: 'Transcription failed', code },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const groqResult = await groqResponse.json();
  const transcript: string = groqResult.text || '';
  const duration: number = groqResult.duration || 0;
  const wordCount = transcript.split(/\s+/).filter(Boolean).length;

  appLog('info', 'Transcribe', 'Success', {
    wordCount, durationSec: Math.round(duration),
  });

  return NextResponse.json({
    success: true,
    transcript: transcript.trim(),
    duration: Math.round(duration),
    wordCount,
    confidence: 0.95,
    source: 'groq-whisper',
  }, { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Pragma': 'no-cache' } });
}

// ── Chunked WAV transcription for files > 24MB ──
async function transcribeChunked(
  wavBuffer: ArrayBuffer,
  fileName: string,
  apiKey: string,
): Promise<NextResponse> {
  const chunks = splitWavFile(wavBuffer);
  const sizeMB = (wavBuffer.byteLength / (1024 * 1024)).toFixed(1);

  appLog('info', 'Transcribe', 'Chunked transcription starting', {
    sizeMB: Number(sizeMB),
    chunkCount: chunks.length,
  });

  assertPhiApprovedEndpoint(GROQ_URL);

  const transcripts: string[] = [];
  let totalDuration = 0;
  let lastSentence = '';

  for (const chunk of chunks) {
    // Build prompt with context from previous chunk for continuity
    const prompt = lastSentence
      ? `${MEDICAL_PROMPT} ${lastSentence}`
      : MEDICAL_PROMPT;

    const groqFormData = new FormData();
    const chunkName = `${fileName.replace(/\.wav$/i, '')}_chunk${chunk.index}.wav`;
    groqFormData.append('file', new Blob([chunk.buffer], { type: 'audio/wav' }), chunkName);
    groqFormData.append('model', 'whisper-large-v3-turbo');
    groqFormData.append('response_format', 'verbose_json');
    groqFormData.append('language', 'en');
    groqFormData.append('timestamp_granularities[]', 'word');
    groqFormData.append('prompt', prompt);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);

    const groqResponse = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: groqFormData,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!groqResponse.ok) {
      const code = errorCode();
      appLog('error', 'Transcribe', 'Chunk transcription failed', {
        chunkIndex: chunk.index,
        chunkCount: chunks.length,
        status: groqResponse.status,
        code,
      });
      return NextResponse.json(
        { success: false, error: `Transcription failed on chunk ${chunk.index + 1} of ${chunks.length}`, code },
        { status: 500, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const groqResult = await groqResponse.json();
    const text: string = (groqResult.text || '').trim();
    const chunkDuration: number = groqResult.duration || chunk.durationSec;

    transcripts.push(text);
    totalDuration += chunkDuration;

    // Extract last sentence for context continuity
    if (text) {
      const sentences = text.match(/[^.!?]+[.!?]+/g);
      lastSentence = sentences ? sentences[sentences.length - 1].trim() : text.slice(-200);
    }

    appLog('info', 'Transcribe', 'Chunk complete', {
      chunkIndex: chunk.index,
      chunkCount: chunks.length,
      chunkWords: text.split(/\s+/).filter(Boolean).length,
    });

    // Rate limit safety — 500ms delay between chunks (skip after last)
    if (chunk.index < chunks.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  const fullTranscript = transcripts.join(' ').trim();
  const wordCount = fullTranscript.split(/\s+/).filter(Boolean).length;

  appLog('info', 'Transcribe', 'Chunked transcription complete', {
    chunkCount: chunks.length,
    wordCount,
    durationSec: Math.round(totalDuration),
  });

  return NextResponse.json({
    success: true,
    transcript: fullTranscript,
    duration: Math.round(totalDuration),
    wordCount,
    confidence: 0.95,
    source: 'groq-whisper-chunked',
  }, { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Pragma': 'no-cache' } });
}
