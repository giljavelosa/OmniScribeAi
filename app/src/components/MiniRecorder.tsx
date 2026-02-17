'use client';

import { useState, useRef, useEffect } from 'react';

interface MiniRecorderProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export default function MiniRecorder({ onTranscript, disabled }: MiniRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType });
      
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);

        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (blob.size < 1000) {
          setProcessing(false);
          return; // Too short
        }

        setProcessing(true);
        try {
          const formData = new FormData();
          formData.append('audio', blob, `dictation.${mimeType.includes('webm') ? 'webm' : 'm4a'}`);
          
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });
          
          const data = await response.json();
          if (data.transcript) {
            onTranscript(data.transcript);
          }
        } catch (err) {
          console.error('Transcription error:', err);
        } finally {
          setProcessing(false);
          setDuration(0);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch (err) {
      console.error('Mic access error:', err);
      alert('Could not access microphone. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (processing) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="animate-spin w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full" />
        <span className="text-sm text-amber-700 font-medium">Transcribing...</span>
      </div>
    );
  }

  if (recording) {
    return (
      <button
        onClick={stopRecording}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors animate-pulse"
      >
        <div className="w-3 h-3 bg-white rounded-sm" />
        Stop · {formatTime(duration)}
      </button>
    );
  }

  return (
    <button
      onClick={startRecording}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-[#0d9488] text-white hover:bg-[#0f766e]'
      }`}
    >
      🎙 Add to Record
    </button>
  );
}
