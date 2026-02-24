import { auth } from "@/lib/auth";
import { assertPhiApprovedEndpoint } from "@/lib/phi-boundaries";
import { appLog, scrubError, errorCode } from "@/lib/logger";
export const maxDuration = 300;
import { NextRequest, NextResponse } from 'next/server';
import { mockTranscripts } from '@/lib/mock-data';

// Medical terminology priming for Whisper prompt
const MEDICAL_PROMPT =
  "Medical clinical encounter. Terms: ROM, MMT, AROM, PROM, PHQ-9, GAD-7, " +
  "C-SSRS, AUDIT-C, ADL, IADL, goniometer, dorsiflexion, plantarflexion, " +
  "supination, pronation, flexion, extension, abduction, adduction, " +
  "WNL, BID, TID, QID, PRN, SOAP, HPI, ROS, CPT, ICD-10, E/M, " +
  "hemoglobin, creatinine, troponin, systolic, diastolic, A1C, " +
  "SSRI, benzodiazepine, psychosis, suicidal ideation, DSM-5.";

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

    appLog('info', 'Transcribe', 'Starting Groq Whisper request', { sizeBytes: audioBuffer.byteLength, mimeType });

    // Groq Whisper API (OpenAI-compatible)
    const groqFormData = new FormData();
    groqFormData.append('file', new Blob([audioBuffer], { type: mimeType }), audioFile.name || 'recording.wav');
    groqFormData.append('model', 'whisper-large-v3-turbo');
    groqFormData.append('response_format', 'verbose_json');
    groqFormData.append('language', 'en');
    groqFormData.append('timestamp_granularities[]', 'word');
    groqFormData.append('prompt', MEDICAL_PROMPT);

    const groqUrl = 'https://api.groq.com/openai/v1/audio/transcriptions';
    assertPhiApprovedEndpoint(groqUrl);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);

    const groqResponse = await fetch(groqUrl, {
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

  } catch (error) {
    const code = errorCode();
    appLog('error', 'Transcribe', 'Unhandled error', { code, error: scrubError(error) });
    return NextResponse.json(
      { success: false, error: 'Transcription service error', code },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
