'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
}

function getSupportedMimeType(): string {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    '',
  ];
  for (const type of types) {
    if (type === '' || MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return '';
}

export default function AudioRecorder({ onRecordingComplete, disabled }: AudioRecorderProps) {
  const [state, setState] = useState<'idle' | 'recording' | 'paused'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [levels, setLevels] = useState<number[]>(new Array(40).fill(0));
  const [error, setError] = useState<string | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const mimeRef = useRef<string>('');

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const updateLevels = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);

    const newLevels: number[] = [];
    const step = Math.floor(data.length / 40);
    for (let i = 0; i < 40; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) {
        sum += data[i * step + j];
      }
      newLevels.push(sum / step / 255);
    }
    setLevels(newLevels);
    animFrameRef.current = requestAnimationFrame(updateLevels);
  }, []);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') audioCtxRef.current.close();
    setLevels(new Array(40).fill(0));
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        } 
      });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mimeType = getSupportedMimeType();
      mimeRef.current = mimeType;
      const options: MediaRecorderOptions = {};
      if (mimeType) options.mimeType = mimeType;

      const recorder = new MediaRecorder(stream, options);
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = () => {
        // Use base MIME without codecs param for the blob
        const baseMime = (mimeRef.current || 'audio/webm').split(';')[0];
        const blob = new Blob(chunks.current, { type: baseMime });
        console.log(`Recording complete: ${blob.size} bytes, type: ${baseMime}, chunks: ${chunks.current.length}`);
        onRecordingComplete(blob);
        cleanup();
      };

      recorder.onerror = () => {
        setError('Recording error occurred. Please try again.');
        setState('idle');
        cleanup();
      };

      // Do NOT use timeslice — let the browser collect all data into one clean blob
      recorder.start();
      mediaRecorder.current = recorder;
      setState('recording');
      setElapsed(0);

      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
      animFrameRef.current = requestAnimationFrame(updateLevels);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (message.includes('NotAllowedError') || message.includes('Permission')) {
        setError('Microphone permission denied. Please allow microphone access in your browser settings and reload the page.');
      } else if (message.includes('NotFoundError') || message.includes('no audio')) {
        setError('No microphone found. Please connect a microphone and try again.');
      } else if (message.includes('NotReadableError')) {
        setError('Microphone is in use by another app. Close other apps using the mic and try again.');
      } else {
        setError(`Microphone error: ${message}. Try using Chrome or Safari.`);
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder.current && state === 'recording') {
      mediaRecorder.current.pause();
      setState('paused');
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder.current && state === 'paused') {
      mediaRecorder.current.resume();
      setState('recording');
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
      animFrameRef.current = requestAnimationFrame(updateLevels);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      // Request any remaining data before stopping
      mediaRecorder.current.requestData();
      mediaRecorder.current.stop();
      setState('idle');
      setElapsed(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  if (state === 'idle') {
    return (
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={startRecording}
          disabled={disabled}
          className="w-32 h-32 rounded-full bg-[#0d9488] hover:bg-[#0f766e] disabled:bg-gray-300 disabled:cursor-not-allowed text-white flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
          <span className="text-xs font-medium mt-1">Start Recording</span>
        </button>
        <p className="text-sm text-gray-500">Click to begin recording your clinical encounter</p>
        {error && (
          <div className="max-w-md p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <div className="text-4xl font-mono font-bold text-[#1e3a5f]">{formatTime(elapsed)}</div>
        <div className={`text-sm font-medium mt-1 ${state === 'paused' ? 'text-amber-500' : 'text-red-500'}`}>
          {state === 'paused' ? '⏸ Paused' : '● Recording'}
        </div>
      </div>

      <div className="flex items-center gap-0.5 h-16 w-full max-w-md">
        {levels.map((level, i) => (
          <div
            key={i}
            className="flex-1 rounded-full transition-all duration-75"
            style={{
              height: `${Math.max(4, level * 64)}px`,
              backgroundColor: state === 'paused' ? '#f59e0b' : '#0d9488',
              opacity: 0.6 + level * 0.4,
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        {state === 'recording' ? (
          <button
            onClick={pauseRecording}
            className="w-14 h-14 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-600 flex items-center justify-center transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
            </svg>
          </button>
        ) : (
          <button
            onClick={resumeRecording}
            className="w-14 h-14 rounded-full bg-[#0d9488]/10 hover:bg-[#0d9488]/20 text-[#0d9488] flex items-center justify-center transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
        )}
        <button
          onClick={stopRecording}
          className="w-14 h-14 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
        </button>
      </div>
      <div className="text-xs text-gray-400">
        {state === 'paused' ? 'Resume or stop recording' : 'Pause or stop when the encounter is complete'}
      </div>
    </div>
  );
}
