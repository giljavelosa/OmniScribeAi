'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { isVoiceActive } from '@/lib/vad';
import { encodeWAV, extractPCMSlice } from '@/lib/wav-encoder';
import {
  createInitialEncounterState,
  mergeExtractionResult,
  formatDiarizedTranscript,
  type EncounterState,
  type ChunkResult,
  type ExtractionResult,
  type SilenceStats,
} from '@/lib/encounter-state';
import { frameworks } from '@/lib/frameworks';

// ─── Constants ───────────────────────────────────────────────────────────────
const SESSION_LIMIT_SEC  = 90 * 60;   // 1 h 30 m — VAD auto-stop threshold
const CHUNK_INTERVAL_MS  = 10_000;    // flush + upload every 10 s
const VAD_POLL_MS        = 2_000;     // check voice every 2 s
const SILENCE_TIMEOUT_MS = 5 * 60 * 1000; // 5 min silence → auto-stop (after 90 min)
const TOAST_DURATION_MS  = 5_000;     // auto-dismiss toast after 5 s
const MIN_SPEECH_SEC     = 10;        // minimum speech duration before sending chunk
const MAX_SPEECH_SEC     = 30;        // force send after 30s of continuous speech
const SAMPLE_RATE        = 16_000;    // PCM capture sample rate

type PreflightStatus = 'idle' | 'checking' | 'ok' | 'warn' | 'error';
interface PreflightResult { status: PreflightStatus; message: string; detail?: string; }

export type { SilenceStats };

interface AudioRecorderProps {
  onRecordingComplete: (
    blob: Blob,
    sessionId: string,
    silenceStats?: SilenceStats,
    encounterState?: EncounterState,
    chunkResults?: ChunkResult[],
    pcmData?: { samples: Float32Array; sampleRate: number },
  ) => void;
  onPartialTranscript?: (transcript: string, wordCount: number, encounterState: EncounterState) => void;
  frameworkId?: string;
  disabled?: boolean;
}

interface TaggedChunk {
  blob: Blob;
  hasVoice: boolean;
}

// ─── Codec ───────────────────────────────────────────────────────────────────
function getSupportedMimeType(): string {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', ''];
  for (const t of types) if (!t || MediaRecorder.isTypeSupported(t)) return t;
  return '';
}

// ─── Pre-flight (no live mic probe — avoids blocking re-acquire) ─────────────
async function runPreflight(): Promise<PreflightResult> {
  if (typeof MediaRecorder === 'undefined')
    return { status: 'error', message: 'MediaRecorder not supported in this browser.', detail: 'Use Chrome, Edge, or Firefox on desktop.' };

  const mime = getSupportedMimeType();
  if (!mime)
    return { status: 'warn', message: 'No preferred audio codec found — recording may use browser default.', detail: 'Chrome with opus/webm gives best results.' };

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    if (!devices.some((d) => d.kind === 'audioinput'))
      return { status: 'error', message: 'No microphone detected.', detail: 'Connect a microphone and reload.' };
  } catch { /* enumerateDevices blocked — not fatal */ }

  const nav = navigator as Navigator & { deviceMemory?: number };
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 2)
    return { status: 'warn', message: `Low device memory (${nav.deviceMemory} GB). Close other tabs before long sessions.` };

  return { status: 'ok', message: 'Ready — microphone detected, codec supported, smart auto-stop enabled.' };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return h > 0 ? `${h}:${m}:${sec}` : `${m}:${sec}`;
}

function makeSessionId(): string {
  return `rec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AudioRecorder({ onRecordingComplete, onPartialTranscript, frameworkId, disabled }: AudioRecorderProps) {
  const [recState, setRecState]     = useState<'idle' | 'recording' | 'paused'>('idle');
  const [elapsed, setElapsed]       = useState(0);
  const [levels, setLevels]         = useState<number[]>(new Array(40).fill(0));
  const [error, setError]           = useState<string | null>(null);
  const [preflight, setPreflight]   = useState<PreflightResult>({ status: 'checking', message: 'Checking recording readiness…' });
  const [savedChunks, setSavedChunks]     = useState(0);
  const [failedChunks, setFailedChunks]   = useState(0);
  const [toastMessage, setToastMessage]   = useState<string | null>(null);
  const [processingChunks, setProcessingChunks] = useState(0);
  const [isRealtimeMode, setIsRealtimeMode] = useState(false);
  const [transcribedChunks, setTranscribedChunks] = useState(0);

  // Refs
  const mediaRecorder   = useRef<MediaRecorder | null>(null);
  const streamRef       = useRef<MediaStream | null>(null);
  const audioCtxRef     = useRef<AudioContext | null>(null);
  const chunks          = useRef<TaggedChunk[]>([]);
  const chunkIndexRef   = useRef(0);
  const sessionIdRef    = useRef('');
  const timerRef        = useRef<ReturnType<typeof setInterval> | null>(null);
  const analyserRef     = useRef<AnalyserNode | null>(null);
  const animFrameRef    = useRef<number>(0);
  const mimeRef         = useRef('');
  const elapsedRef      = useRef(0);

  // VAD refs
  const vadIntervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastVoiceTimeRef  = useRef(0);
  const chunkHasVoiceRef  = useRef(false);
  const toastTimeoutRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoStopToastShownRef = useRef(false);

  // PCM capture refs (real-time transcription pipeline)
  const pcmBufferRef          = useRef<Float32Array[]>([]);
  const pcmSampleCountRef     = useRef(0);
  const speechStartSampleRef  = useRef(-1);
  const encounterStateRef     = useRef<EncounterState | null>(null);
  const chunkResultsRef       = useRef<ChunkResult[]>([]);
  const lastChunkTextRef      = useRef('');
  const workletNodeRef        = useRef<AudioWorkletNode | null>(null);
  const transcribeChunkIdxRef = useRef(0);
  const isRealtimeModeRef     = useRef(false);

  // Pre-flight on mount
  useEffect(() => {
    runPreflight().then(setPreflight);
  }, []);

  // Waveform — update only (scheduling handled at call sites to avoid self-reference)
  const updateLevels = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const step = Math.floor(data.length / 40);
    const lv: number[] = [];
    for (let i = 0; i < 40; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) sum += data[i * step + j];
      lv.push(sum / step / 255);
    }
    setLevels(lv);
  }, []);

  // Show auto-dismiss toast
  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
  }, []);

  // Send a PCM chunk for transcription + extraction (non-blocking)
  const sendChunkForProcessing = useCallback((startSample: number, endSample: number) => {
    if (!isRealtimeModeRef.current || !frameworkId) return;

    const pcmSlice = extractPCMSlice(pcmBufferRef.current, startSample, endSample);
    if (pcmSlice.length === 0) return;

    const wavBlob = encodeWAV(pcmSlice, SAMPLE_RATE);
    const chunkIdx = transcribeChunkIdxRef.current++;
    const globalStartSec = startSample / SAMPLE_RATE;

    setProcessingChunks(n => n + 1);

    // Step 1: Transcribe via Groq Whisper
    const fd = new FormData();
    fd.append('audio', wavBlob, `chunk_${chunkIdx}.wav`);
    fd.append('prompt', lastChunkTextRef.current);
    fd.append('chunkIndex', String(chunkIdx));
    fd.append('globalStartSec', String(globalStartSec));

    fetch('/api/transcribe-chunk', { method: 'POST', body: fd })
      .then(r => r.json())
      .then(transcribeResult => {
        if (!transcribeResult.success) {
          console.warn('[AudioRecorder] Transcribe-chunk failed:', transcribeResult.error);
          setProcessingChunks(n => Math.max(0, n - 1));
          return;
        }

        // Store chunk result for word timestamps
        chunkResultsRef.current.push({
          text: transcribeResult.text,
          words: transcribeResult.words,
          globalStartSec: transcribeResult.globalStartSec,
          duration: transcribeResult.duration,
          chunkIndex: chunkIdx,
        });

        // Update last chunk text for Whisper prompt continuity
        const lastSentence = transcribeResult.text.slice(-200);
        lastChunkTextRef.current = lastSentence;

        // Step 2: Extract facts + diarize via LLM
        return fetch('/api/extract-chunk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: transcribeResult.text,
            words: transcribeResult.words,
            globalStartSec: transcribeResult.globalStartSec,
            frameworkId,
            previousContext: encounterStateRef.current?.last_context,
          }),
        });
      })
      .then(r => r?.json())
      .then(extractResult => {
        if (!extractResult?.success || !extractResult.extraction) {
          setProcessingChunks(n => Math.max(0, n - 1));
          return;
        }

        // Merge extraction into EncounterState
        const extraction: ExtractionResult = extractResult.extraction;
        if (encounterStateRef.current) {
          encounterStateRef.current = mergeExtractionResult(
            encounterStateRef.current,
            extraction,
          );

          setTranscribedChunks(encounterStateRef.current.chunk_count);

          // Notify parent with live transcript
          if (onPartialTranscript) {
            const transcript = formatDiarizedTranscript(encounterStateRef.current);
            const wordCount = transcript.split(/\s+/).filter(Boolean).length;
            onPartialTranscript(transcript, wordCount, encounterStateRef.current);
          }
        }

        setProcessingChunks(n => Math.max(0, n - 1));
      })
      .catch(err => {
        console.warn('[AudioRecorder] Chunk processing error:', err);
        setProcessingChunks(n => Math.max(0, n - 1));
      });
  }, [frameworkId, onPartialTranscript]);

  // Cleanup
  const cleanup = useCallback(() => {
    if (timerRef.current)       clearInterval(timerRef.current);
    if (vadIntervalRef.current) clearInterval(vadIntervalRef.current);
    if (animFrameRef.current)   cancelAnimationFrame(animFrameRef.current);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    if (workletNodeRef.current) { workletNodeRef.current.disconnect(); workletNodeRef.current = null; }
    if (streamRef.current)      streamRef.current.getTracks().forEach((t) => t.stop());
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') audioCtxRef.current.close();
    setLevels(new Array(40).fill(0));
    setToastMessage(null);
  }, []);

  // Auto-stop recording (triggered by VAD when silence exceeds threshold after 90 min)
  const autoStopRecording = useCallback(() => {
    const rec = mediaRecorder.current;
    if (!rec || rec.state === 'inactive') return;
    console.log('[AudioRecorder] Auto-stopping — no voice detected for 5+ min past 90 min mark');
    rec.requestData(); // flush final chunk
    rec.stop();        // triggers onstop → blob assembly → processing
    setRecState('idle');
    setElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
    if (vadIntervalRef.current) clearInterval(vadIntervalRef.current);
  }, []);

  // Upload a chunk to the server in the background (non-blocking, visible failures)
  const uploadChunk = (data: Blob, idx: number, sid: string) => {
    const fd = new FormData();
    fd.append('sessionId', sid);
    fd.append('chunkIndex', String(idx));
    fd.append('chunk', data, `chunk_${String(idx).padStart(6, '0')}.bin`);
    fetch('/api/recordings/chunk', { method: 'POST', body: fd })
      .then((r) => {
        if (r.ok) setSavedChunks((n) => n + 1);
        else setFailedChunks((n) => n + 1);
      })
      .catch(() => setFailedChunks((n) => n + 1));
  };

  // ── Start ────────────────────────────────────────────────────────────────
  const startRecording = async () => {
    setError(null);
    setToastMessage(null);
    setSavedChunks(0);
    setFailedChunks(0);
    chunkIndexRef.current = 0;
    sessionIdRef.current = makeSessionId();
    chunks.current = [];
    elapsedRef.current = 0;
    lastVoiceTimeRef.current = Date.now();
    chunkHasVoiceRef.current = false;
    autoStopToastShownRef.current = false;
    pcmBufferRef.current = [];
    pcmSampleCountRef.current = 0;
    speechStartSampleRef.current = -1;
    chunkResultsRef.current = [];
    lastChunkTextRef.current = '';
    transcribeChunkIdxRef.current = 0;
    setProcessingChunks(0);

    // Initialize EncounterState if we have a framework and real-time mode is enabled
    const isRealtime = (process.env.NEXT_PUBLIC_TRANSCRIPTION_PROVIDER || 'groq') === 'groq' && !!frameworkId;
    isRealtimeModeRef.current = isRealtime;
    setIsRealtimeMode(isRealtime);
    setTranscribedChunks(0);

    if (isRealtime && frameworkId) {
      const framework = frameworks.find(f => f.id === frameworkId);
      if (framework) {
        encounterStateRef.current = createInitialEncounterState(framework.sections);
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      });
      streamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: SAMPLE_RATE });
      audioCtxRef.current = audioCtx;
      const source   = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // PCM capture via AudioWorklet (for real-time transcription pipeline)
      if (isRealtime) {
        try {
          await audioCtx.audioWorklet.addModule('/pcm-capture-processor.js');
          const workletNode = new AudioWorkletNode(audioCtx, 'pcm-capture-processor');
          workletNode.port.onmessage = (e: MessageEvent<{ samples: Float32Array }>) => {
            pcmBufferRef.current.push(e.data.samples);
            pcmSampleCountRef.current += e.data.samples.length;
          };
          source.connect(workletNode);
          workletNodeRef.current = workletNode;
        } catch (workletErr) {
          console.warn('[AudioRecorder] AudioWorklet failed, falling back to legacy mode:', workletErr);
          isRealtimeModeRef.current = false;
          setIsRealtimeMode(false);
        }
      }

      const mimeType = getSupportedMimeType();
      mimeRef.current = mimeType;
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};

      const recorder = new MediaRecorder(stream, options);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          const idx = chunkIndexRef.current++;
          chunks.current.push({ blob: e.data, hasVoice: chunkHasVoiceRef.current });
          chunkHasVoiceRef.current = false; // reset for next chunk window
          // Upload chunk to server — fire and forget (local array is the source of truth)
          uploadChunk(e.data, idx, sessionIdRef.current);
        }
      };

      recorder.onstop = () => {
        // Send any remaining speech as final chunk
        if (isRealtimeModeRef.current && speechStartSampleRef.current >= 0) {
          const speechSamples = pcmSampleCountRef.current - speechStartSampleRef.current;
          if (speechSamples / SAMPLE_RATE >= 2) { // at least 2s
            sendChunkForProcessing(speechStartSampleRef.current, pcmSampleCountRef.current);
          }
          speechStartSampleRef.current = -1;
        }

        const allChunks = chunks.current;
        const voiceChunks = allChunks.filter(c => c.hasVoice);
        const baseMime = (mimeRef.current || 'audio/webm').split(';')[0];

        // Use filtered blob for processing (smaller = cheaper Deepgram + AI)
        const filteredBlob = new Blob(voiceChunks.map(c => c.blob), { type: baseMime });

        const silenceStats: SilenceStats = {
          totalChunks: allChunks.length,
          voiceChunks: voiceChunks.length,
          silentChunks: allChunks.length - voiceChunks.length,
          silenceStrippedSec: (allChunks.length - voiceChunks.length) * 10,
          originalDurationSec: allChunks.length * 10,
        };

        console.log(
          `[AudioRecorder] Stop: ${filteredBlob.size} bytes (filtered from ${allChunks.length} to ${voiceChunks.length} chunks), ` +
          `stripped ${silenceStats.silenceStrippedSec}s silence, session=${sessionIdRef.current}` +
          (isRealtimeModeRef.current ? `, encounterState chunks=${encounterStateRef.current?.chunk_count}` : '')
        );

        onRecordingComplete(
          filteredBlob,
          sessionIdRef.current,
          silenceStats,
          isRealtimeModeRef.current ? encounterStateRef.current ?? undefined : undefined,
          isRealtimeModeRef.current ? chunkResultsRef.current : undefined,
        );
        cleanup();
      };

      recorder.onerror = (ev) => {
        console.error('[AudioRecorder] recorder.onerror:', ev);
        setError('Recording error. Please stop and try again.');
        setRecState('idle');
        cleanup();
      };

      // Flush + upload every 10 s; local array accumulates all chunks for final blob
      recorder.start(CHUNK_INTERVAL_MS);
      mediaRecorder.current = recorder;
      setRecState('recording');
      setElapsed(0);

      // ── VAD polling — every 2 s (+ real-time chunk trigger) ──────────
      vadIntervalRef.current = setInterval(() => {
        const voiceActive = analyserRef.current && isVoiceActive(analyserRef.current);
        if (voiceActive) {
          lastVoiceTimeRef.current = Date.now();
          chunkHasVoiceRef.current = true;

          // Real-time: mark speech start
          if (isRealtimeModeRef.current && speechStartSampleRef.current === -1) {
            speechStartSampleRef.current = pcmSampleCountRef.current;
          }
        } else if (isRealtimeModeRef.current && speechStartSampleRef.current >= 0) {
          // Silence after speech — check if enough accumulated
          const speechSamples = pcmSampleCountRef.current - speechStartSampleRef.current;
          const speechSec = speechSamples / SAMPLE_RATE;
          if (speechSec >= MIN_SPEECH_SEC) {
            sendChunkForProcessing(speechStartSampleRef.current, pcmSampleCountRef.current);
            speechStartSampleRef.current = -1;
          }
        }

        // Force send if continuous speech hits MAX_SPEECH_SEC
        if (isRealtimeModeRef.current && speechStartSampleRef.current >= 0) {
          const dur = (pcmSampleCountRef.current - speechStartSampleRef.current) / SAMPLE_RATE;
          if (dur >= MAX_SPEECH_SEC) {
            sendChunkForProcessing(speechStartSampleRef.current, pcmSampleCountRef.current);
            speechStartSampleRef.current = pcmSampleCountRef.current;
          }
        }
      }, VAD_POLL_MS);

      // ── Elapsed counter + smart auto-stop logic ──────────────────────
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          elapsedRef.current = next;

          // Keep-alive: dispatch heartbeat every 60 s to prevent session timeout
          if (next % 60 === 0) {
            document.dispatchEvent(new CustomEvent('recording-heartbeat'));
          }

          // Smart auto-stop logic (only after 90 min)
          if (next >= SESSION_LIMIT_SEC) {
            const silenceDuration = Date.now() - lastVoiceTimeRef.current;

            if (silenceDuration >= SILENCE_TIMEOUT_MS) {
              // No voice for 5+ min past 90 min → auto-stop
              autoStopRecording();
            } else if (!autoStopToastShownRef.current) {
              // Voice still active past 90 min → subtle toast (once)
              autoStopToastShownRef.current = true;
              showToast('Recording extended — voice still active');
            }
          }

          return next;
        });
      }, 1000);

      const levelLoop = () => { updateLevels(); animFrameRef.current = requestAnimationFrame(levelLoop); };
      animFrameRef.current = requestAnimationFrame(levelLoop);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('NotAllowed') || msg.includes('Permission'))
        setError('Microphone permission denied. Allow it in browser settings and reload.');
      else if (msg.includes('NotFound') || msg.includes('Devices') || msg.includes('no audio'))
        setError('No microphone found. Connect one and try again.');
      else if (msg.includes('NotReadable'))
        setError('Microphone in use by another app. Close other apps and retry.');
      else
        setError(`Microphone error: ${msg}`);
    }
  };

  // ── Pause / Resume ───────────────────────────────────────────────────────
  const pauseRecording = () => {
    if (mediaRecorder.current && recState === 'recording') {
      mediaRecorder.current.pause();
      setRecState('paused');
      if (timerRef.current)      clearInterval(timerRef.current);
      if (vadIntervalRef.current) clearInterval(vadIntervalRef.current);
      if (animFrameRef.current)  cancelAnimationFrame(animFrameRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder.current && recState === 'paused') {
      mediaRecorder.current.resume();
      setRecState('recording');
      lastVoiceTimeRef.current = Date.now(); // reset voice timer on resume

      // Restart VAD polling (with real-time chunk logic)
      vadIntervalRef.current = setInterval(() => {
        const voiceActive = analyserRef.current && isVoiceActive(analyserRef.current);
        if (voiceActive) {
          lastVoiceTimeRef.current = Date.now();
          chunkHasVoiceRef.current = true;
          if (isRealtimeModeRef.current && speechStartSampleRef.current === -1) {
            speechStartSampleRef.current = pcmSampleCountRef.current;
          }
        } else if (isRealtimeModeRef.current && speechStartSampleRef.current >= 0) {
          const speechSec = (pcmSampleCountRef.current - speechStartSampleRef.current) / SAMPLE_RATE;
          if (speechSec >= MIN_SPEECH_SEC) {
            sendChunkForProcessing(speechStartSampleRef.current, pcmSampleCountRef.current);
            speechStartSampleRef.current = -1;
          }
        }
        if (isRealtimeModeRef.current && speechStartSampleRef.current >= 0) {
          const dur = (pcmSampleCountRef.current - speechStartSampleRef.current) / SAMPLE_RATE;
          if (dur >= MAX_SPEECH_SEC) {
            sendChunkForProcessing(speechStartSampleRef.current, pcmSampleCountRef.current);
            speechStartSampleRef.current = pcmSampleCountRef.current;
          }
        }
      }, VAD_POLL_MS);

      // Recreate timer with smart auto-stop logic + heartbeat
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          elapsedRef.current = next;
          if (next % 60 === 0) {
            document.dispatchEvent(new CustomEvent('recording-heartbeat'));
          }
          if (next >= SESSION_LIMIT_SEC) {
            const silenceDuration = Date.now() - lastVoiceTimeRef.current;
            if (silenceDuration >= SILENCE_TIMEOUT_MS) {
              autoStopRecording();
            } else if (!autoStopToastShownRef.current) {
              autoStopToastShownRef.current = true;
              showToast('Recording extended — voice still active');
            }
          }
          return next;
        });
      }, 1000);
      const levelLoop = () => { updateLevels(); animFrameRef.current = requestAnimationFrame(levelLoop); };
      animFrameRef.current = requestAnimationFrame(levelLoop);
    }
  };

  // ── Stop ─────────────────────────────────────────────────────────────────
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.requestData(); // flush last partial chunk
      mediaRecorder.current.stop();
      setRecState('idle');
      setElapsed(0);
      if (timerRef.current) clearInterval(timerRef.current);
      if (vadIntervalRef.current) clearInterval(vadIntervalRef.current);
    }
  };

  useEffect(() => () => cleanup(), [cleanup]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  // Preflight banner
  const preflightBanner = (() => {
    if (preflight.status === 'idle') return null;
    if (preflight.status === 'checking')
      return (
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          Checking recording readiness…
        </div>
      );
    if (preflight.status === 'ok')
      return (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <span>{preflight.message}</span>
        </div>
      );
    if (preflight.status === 'warn')
      return (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <p className="font-semibold">{preflight.message}</p>
          {preflight.detail && <p className="mt-0.5 text-amber-600">{preflight.detail}</p>}
        </div>
      );
    return (
      <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
        <p className="font-semibold">{preflight.message}</p>
        {preflight.detail && <p className="mt-0.5 text-red-600">{preflight.detail}</p>}
      </div>
    );
  })();

  // Subtle amber toast (auto-dismiss)
  const toastBanner = toastMessage ? (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-amber-50 border border-amber-300 rounded-lg shadow-md px-4 py-2 text-sm text-amber-700 animate-fade-in">
      {toastMessage}
    </div>
  ) : null;

  // ── Idle ─────────────────────────────────────────────────────────────────
  if (recState === 'idle') {
    return (
      <div className="flex flex-col items-center gap-4 w-full">
        {preflightBanner}

        <button
          onClick={startRecording}
          disabled={disabled || preflight.status === 'error'}
          className="w-32 h-32 rounded-full bg-[#0d9488] hover:bg-[#0f766e] disabled:bg-gray-300 disabled:cursor-not-allowed text-white flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl mt-2"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
          <span className="text-xs font-medium mt-1">Start Recording</span>
        </button>

        <p className="text-sm text-gray-500">Click to begin recording your clinical encounter</p>
        <p className="text-xs text-gray-400">Up to 90 min uninterrupted · Auto-stops when silent · Audio saved every 10 s</p>

        {error && (
          <div className="max-w-md p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    );
  }

  // ── Recording / Paused ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-5 w-full">

      {toastBanner}

      {/* Timer */}
      <div className="text-center">
        <div className="text-4xl font-mono font-bold text-[#1e3a5f]">
          {formatTime(elapsed)}
        </div>
        <div className={`text-sm font-medium mt-1 ${recState === 'paused' ? 'text-amber-500' : 'text-red-500'}`}>
          {recState === 'paused' ? 'Paused' : 'Recording'}
        </div>
        {/* Save status */}
        <div className="text-xs mt-1">
          {failedChunks > 0 ? (
            <span className="text-red-500 font-medium">{failedChunks} segment{failedChunks !== 1 ? 's' : ''} failed to save — audio preserved locally</span>
          ) : savedChunks > 0 ? (
            <span className="text-emerald-600">{savedChunks} segment{savedChunks !== 1 ? 's' : ''} saved to server</span>
          ) : (
            <span className="text-gray-400">Saving to server every 10 s…</span>
          )}
        </div>
        {/* Real-time transcription indicator */}
        {isRealtimeMode && (
          <div className="text-xs mt-0.5">
            {processingChunks > 0 ? (
              <span className="text-blue-500 animate-pulse">Transcribing…</span>
            ) : transcribedChunks > 0 ? (
              <span className="text-emerald-600">{transcribedChunks} chunk{transcribedChunks !== 1 ? 's' : ''} transcribed</span>
            ) : (
              <span className="text-gray-400">Real-time transcription active</span>
            )}
          </div>
        )}
      </div>

      {/* Waveform */}
      <div className="flex items-center gap-0.5 h-16 w-full max-w-md">
        {levels.map((level, i) => (
          <div
            key={i}
            className="flex-1 rounded-full transition-all duration-75"
            style={{
              height: `${Math.max(4, level * 64)}px`,
              backgroundColor: recState === 'paused' ? '#f59e0b' : '#0d9488',
              opacity: 0.6 + level * 0.4,
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {recState === 'recording' ? (
          <button onClick={pauseRecording} className="w-14 h-14 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-600 flex items-center justify-center transition-colors" title="Pause">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
            </svg>
          </button>
        ) : (
          <button onClick={resumeRecording} className="w-14 h-14 rounded-full bg-[#0d9488]/10 hover:bg-[#0d9488]/20 text-[#0d9488] flex items-center justify-center transition-colors" title="Resume">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
        )}
        <button onClick={stopRecording} className="w-14 h-14 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors" title="Stop & process">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
        </button>
      </div>

      <div className="text-xs text-gray-400">
        {recState === 'paused' ? 'Resume or stop recording' : 'Pause or stop when the encounter is complete'}
      </div>
    </div>
  );
}
