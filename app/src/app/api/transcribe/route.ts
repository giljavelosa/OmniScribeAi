export const maxDuration = 300;
import { NextRequest, NextResponse } from 'next/server';
import { mockTranscripts } from '@/lib/mock-data';


export const config = {
  api: { bodyParser: false },
};

// Map common audio extensions to MIME types Deepgram accepts
function getAudioMimeType(file: File): string {
  const name = file.name?.toLowerCase() || '';
  if (name.endsWith('.wav')) return 'audio/wav';
  if (name.endsWith('.mp3')) return 'audio/mpeg';
  if (name.endsWith('.m4a')) return 'audio/mp4';
  if (name.endsWith('.mp4')) return 'audio/mp4';
  if (name.endsWith('.flac')) return 'audio/flac';
  if (name.endsWith('.ogg')) return 'audio/ogg';
  if (name.endsWith('.webm')) return 'audio/webm';
  if (name.endsWith('.aac')) return 'audio/aac';
  if (name.endsWith('.wma')) return 'audio/x-ms-wma';
  return (file.type || 'audio/wav').split(';')[0];
}

export async function POST(request: NextRequest) {
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

    // Real transcription via Deepgram
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Deepgram API key not configured' },
        { status: 500 }
      );
    }

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const mimeType = getAudioMimeType(audioFile);
    
    console.log(`[Transcribe] File: ${audioFile.name}, Size: ${audioBuffer.length} bytes, Type: ${audioFile.type}, Resolved MIME: ${mimeType}`);

    const dgResponse = await fetch(
      'https://api.deepgram.com/v1/listen?model=nova-3-medical&smart_format=true&diarize=true&punctuate=true&paragraphs=true&utterances=true&language=en-US&keyterm=ROM:2&keyterm=MMT:2&keyterm=goniometer:2&keyterm=flexion:1&keyterm=extension:1&keyterm=rotation:1&keyterm=abduction:1&keyterm=adduction:1&keyterm=dorsiflexion:1&keyterm=plantarflexion:1&keyterm=supination:1&keyterm=pronation:1&keyterm=AROM:2&keyterm=PROM:2&keyterm=ADL:2&keyterm=IADL:2&keyterm=systolic:1&keyterm=diastolic:1&keyterm=A1C:2&keyterm=hemoglobin:1&keyterm=creatinine:1&keyterm=troponin:2&keyterm=EKG:2&keyterm=triage:1&keyterm=EMTALA:2&keyterm=PHQ-9:2&keyterm=GAD-7:2&keyterm=AUDIT-C:2&keyterm=C-SSRS:2&keyterm=suicidal:1&keyterm=ideation:1&keyterm=DSM:2&keyterm=psychosis:1&keyterm=SSRI:2&keyterm=benzodiazepine:1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': mimeType,
        },
        body: audioBuffer,
      }
    );

    if (!dgResponse.ok) {
      const errorText = await dgResponse.text();
      console.error(`[Transcribe] Deepgram error (${dgResponse.status}):`, errorText);
      return NextResponse.json(
        { success: false, error: `Transcription failed (${dgResponse.status})`, details: errorText },
        { status: 500 }
      );
    }

    const dgResult = await dgResponse.json();
    const channels = dgResult.results?.channels;

    if (!channels || channels.length === 0) {
      console.error('[Transcribe] No channels in Deepgram response');
      return NextResponse.json(
        { success: false, error: 'No transcription results' },
        { status: 500 }
      );
    }

    // Extract transcript with speaker diarization
    const paragraphs = channels[0]?.alternatives?.[0]?.paragraphs?.paragraphs;
    let formattedTranscript = '';
    let speakerCount = 0;

    if (paragraphs) {
      // Count unique speakers
      const speakers = new Set(paragraphs.map((p: any) => p.speaker).filter((s: any) => s !== undefined));
      speakerCount = speakers.size;

      // Neutral labels — clinician can swap via UI
      const speakerLabel = (id: number) => {
        return `Speaker ${id + 1}`;
      };

      for (const paragraph of paragraphs) {
        const label = paragraph.speaker !== undefined ? `**${speakerLabel(paragraph.speaker)}:** ` : '';
        const sentences = paragraph.sentences?.map((s: { text: string }) => s.text).join(' ') || '';
        formattedTranscript += `${label}${sentences}\n\n`;
      }
    } else {
      formattedTranscript = channels[0]?.alternatives?.[0]?.transcript || '';
    }

    const duration = dgResult.metadata?.duration || 0;
    const confidence = channels[0]?.alternatives?.[0]?.confidence || 0;
    const wordCount = formattedTranscript.split(/\s+/).filter(Boolean).length;

    console.log(`[Transcribe] Success: ${wordCount} words, ${Math.round(duration)}s, confidence ${confidence}`);

    return NextResponse.json({
      success: true,
      transcript: formattedTranscript.trim(),
      duration: Math.round(duration),
      wordCount,
      confidence: Math.round(confidence * 100) / 100,
      source: 'deepgram',
      speakers: speakerCount,
    });
  } catch (error) {
    console.error('[Transcribe] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Transcription service error', details: String(error) },
      { status: 500 }
    );
  }
}
