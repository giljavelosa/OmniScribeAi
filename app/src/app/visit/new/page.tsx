'use client';
import { fetchNoteSSE } from '@/lib/sse-fetch';
import { setPhiItem } from '@/lib/phi-storage';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import AudioRecorder, { SilenceStats } from '@/components/AudioRecorder';
import FrameworkSelector from '@/components/FrameworkSelector';
import { ProviderType } from '@/lib/types';
import type { EncounterState } from '@/lib/encounter-state';

const providerTypes: ProviderType[] = ['MD', 'DO', 'PA-C', 'NP', 'PT', 'OT', 'SLP', 'LCSW', 'PhD', 'PsyD'];

const ACCEPTED_AUDIO = '.mp3,.mp4,.m4a,.wav,.webm,.ogg,.aac,.flac,.wma';

export default function NewVisitPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastBlobRef      = useRef<Blob | null>(null);   // retained for retry after failure
  const lastSessionIdRef = useRef<string>('');
  const [patientName, setPatientName] = useState('');
  const [providerType, setProviderType] = useState<ProviderType>('PT');
  const [frameworkId, setFrameworkId] = useState('');
  const [inputMode, setInputMode] = useState<'record' | 'upload'>('record');
  const [step, setStep] = useState<'setup' | 'recording' | 'processing' | 'error'>('setup');
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [transcriptWordCount, setTranscriptWordCount] = useState(0);
  const encounterStateRef = useRef<EncounterState | null>(null);

  const canRecord = patientName.trim() !== '' && frameworkId !== '';

  // Callback for live transcript updates during recording
  const handlePartialTranscript = useCallback((transcript: string, wordCount: number, state: EncounterState) => {
    setLiveTranscript(transcript);
    setTranscriptWordCount(wordCount);
    encounterStateRef.current = state;
  }, []);

  // Generate note from pre-built EncounterState (2-pass, 30-45s)
  const processWithEncounterState = async (encounterState: EncounterState) => {
    setStep('processing');
    setProgress(10);
    setProgressText('Validating clinical data...');

    try {
      // Step 1: Generate note via encounter-state mode (SSE)
      setProgress(20);
      setProgressText('Generating clinical note from encounter data...');

      const noteController = new AbortController();
      const noteTimeout = setTimeout(() => noteController.abort(), 300000);
      const noteData = await fetchNoteSSE(
        {
          frameworkId,
          useMock: false,
          mode: 'encounter-state',
          encounterState,
        },
        (pass, total, message) => {
          const pct = 20 + Math.round((pass / total) * 60);
          setProgress(pct);
          setProgressText(message);
        },
        noteController.signal,
      );
      clearTimeout(noteTimeout);

      if (!noteData.success) {
        throw new Error(String(noteData.error || 'Note generation failed'));
      }

      setProgress(85);
      setProgressText('Finalizing clinical note...');

      // Format the diarized transcript from EncounterState
      const diarizedLines: string[] = [];
      let lastSpeaker: string | null = null;
      for (const stmt of encounterState.diarized_transcript) {
        if (stmt.speaker !== lastSpeaker) {
          const label = stmt.speaker === 'CLINICIAN' ? 'Clinician' : stmt.speaker === 'PATIENT' ? 'Patient' : 'Speaker';
          diarizedLines.push(`**${label}:** ${stmt.text}`);
        } else {
          diarizedLines.push(stmt.text);
        }
        lastSpeaker = stmt.speaker;
      }
      const formattedTranscript = diarizedLines.join('\n\n');

      // Store visit data
      const visitId = `visit-${Date.now()}`;
      const visitData = {
        id: visitId,
        patientName,
        providerType,
        frameworkId,
        transcript: formattedTranscript,
        transcriptSource: 'groq-realtime',
        transcriptDuration: Math.round(encounterState.diarized_transcript.length > 0
          ? encounterState.diarized_transcript[encounterState.diarized_transcript.length - 1].t1
          : 0),
        parsedData: noteData.parsedData,
        clinicalNote: noteData.clinicalNote,
        summary: noteData.summary,
        compliance: noteData.compliance,
        auditClean: noteData.auditClean,
        auditIssues: noteData.auditIssues,
        validation: noteData.validation,
        source: noteData.source,
        generationTime: noteData.generationTime,
        mode: 'encounter-state',
        createdAt: new Date().toISOString(),
      };

      setPhiItem(`omniscribe-visit-${visitId}`, visitData);

      setProgress(100);
      setProgressText('Done!');

      await new Promise(r => setTimeout(r, 500));
      router.push(`/visit/${visitId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setErrorMsg(message);
      setStep('error');
    }
  };

  // Legacy flow: transcribe full audio blob then generate note (6-pass)
  const processAudio = async (audioBlob: Blob) => {
    setStep('processing');
    setProgress(0);
    setProgressText('Transcribing audio with medical speech recognition...');

    try {
      // Step 1: Transcribe
      setProgress(10);
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('frameworkId', frameworkId);

      const transcribeController = new AbortController();
      const transcribeTimeout = setTimeout(() => transcribeController.abort(), 600000); // 10 min (allows for large file upload + Deepgram processing)
      const transcribeRes = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
        signal: transcribeController.signal,
      });
      clearTimeout(transcribeTimeout);

      const transcribeData = await transcribeRes.json();
      if (!transcribeData.success) {
        throw new Error(transcribeData.error || 'Transcription failed');
      }

      setProgress(40);
      setProgressText('Extracting clinical facts from transcript...');

      // Step 2: Generate note (SSE streaming to keep connection alive)
      const noteController = new AbortController();
      const noteTimeout = setTimeout(() => noteController.abort(), 600000); // 10 min — complex frameworks need time
      const noteData = await fetchNoteSSE(
        { transcript: transcribeData.transcript, frameworkId, useMock: false },
        (pass, total, message) => {
          const pct = 40 + Math.round((pass / total) * 40);
          setProgress(pct);
          setProgressText(message);
        },
        noteController.signal
      );
      clearTimeout(noteTimeout);
      if (!noteData.success) {
        throw new Error(String(noteData.error || 'Note generation failed'));
      }

      setProgress(80);
      setProgressText('Finalizing clinical note...');

      // Step 3: Store in localStorage for the visit page to pick up
      const visitId = `visit-${Date.now()}`;
      const visitData = {
        id: visitId,
        patientName,
        providerType,
        frameworkId,
        transcript: transcribeData.transcript,
        transcriptSource: transcribeData.source,
        transcriptDuration: transcribeData.duration,
        transcriptConfidence: transcribeData.confidence,
        parsedData: noteData.parsedData,
        clinicalNote: noteData.clinicalNote,
        summary: noteData.summary,
        extractedFacts: noteData.extractedFacts,
        clinicalSynthesis: noteData.clinicalSynthesis,
        compliance: noteData.compliance,
        auditResult: noteData.auditResult,
        source: noteData.source,
        generationTime: noteData.generationTime,
        createdAt: new Date().toISOString(),
      };

      setPhiItem(`omniscribe-visit-${visitId}`, visitData);

      setProgress(100);
      setProgressText('Done!');

      await new Promise(r => setTimeout(r, 500));
      router.push(`/visit/${visitId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setErrorMsg(message);
      setStep('error');
    }
  };

  const handleRecordingComplete = async (
    blob: Blob,
    sessionId: string,
    silenceStats?: SilenceStats,
    encounterState?: EncounterState,
  ) => {
    lastBlobRef.current = blob;
    lastSessionIdRef.current = sessionId;
    if (silenceStats) {
      console.log(`[NewVisit] Silence stripped: ${silenceStats.silenceStrippedSec}s of ${silenceStats.originalDurationSec}s total`);
    }

    // Use encounter-state mode if real-time extraction produced data
    if (encounterState && encounterState.chunk_count > 0) {
      console.log(`[NewVisit] Using encounter-state mode (${encounterState.chunk_count} chunks, ${encounterState.diarized_transcript.length} statements)`);
      await processWithEncounterState(encounterState);
    } else {
      // Fallback to legacy transcribe-then-generate flow
      await processAudio(blob);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadedFile) return;
    await processAudio(uploadedFile);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">New Visit</h1>
            <p className="text-gray-500">Set up and record your clinical encounter.</p>
          </div>

          {step === 'processing' ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#0d9488]/10 flex items-center justify-center mx-auto mb-6">
                <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Generating your clinical note...</h2>
              <p className="text-gray-500 mb-6 text-sm">{progressText}</p>
              <div className="w-full max-w-md mx-auto h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0d9488] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-xs text-gray-400 mt-2">{progress}%</div>
            </div>
          ) : step === 'error' ? (
            <div className="bg-white rounded-2xl border border-red-200 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
              <p className="text-red-600 mb-6 text-sm">{errorMsg}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* Retry with the retained blob */}
                {lastBlobRef.current && (
                  <button
                    onClick={() => { setStep('processing'); setErrorMsg(''); if (lastBlobRef.current) processAudio(lastBlobRef.current); }}
                    className="px-6 py-2.5 bg-[#0d9488] text-white rounded-lg text-sm font-medium hover:bg-[#0f766e] transition-colors"
                  >
                    Retry Processing
                  </button>
                )}
                <button onClick={() => { setStep('setup'); setErrorMsg(''); }} className="px-6 py-2.5 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors">
                  Start Over
                </button>
                {/* Emergency download — preserves the recording even if processing keeps failing */}
                {lastBlobRef.current && (
                  <a
                    href={URL.createObjectURL(lastBlobRef.current)}
                    download={`recording-${lastSessionIdRef.current || Date.now()}.webm`}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    ⬇ Download Recording
                  </a>
                )}
              </div>
              {lastBlobRef.current && (
                <p className="text-xs text-gray-400 mt-4">Your recording is intact. Use Retry or download it to prevent data loss.</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Patient & Provider */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Patient & Provider</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient Name</label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g., Robert Johnson"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Provider Type</label>
                    <div className="flex flex-wrap gap-1.5">
                      {providerTypes.map((pt) => (
                        <button
                          key={pt}
                          onClick={() => setProviderType(pt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            providerType === pt ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {pt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Framework */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Documentation Framework</h2>
                <FrameworkSelector onSelect={setFrameworkId} selectedId={frameworkId} />
              </div>

              {/* Input Mode Toggle */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-gray-900">Audio Input</h2>
                  <div className="flex bg-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setInputMode('record')}
                      className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        inputMode === 'record' ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      🎙 Record Live
                    </button>
                    <button
                      onClick={() => setInputMode('upload')}
                      className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        inputMode === 'upload' ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      📁 Upload File
                    </button>
                  </div>
                </div>

                {!canRecord && (
                  <div className="text-center text-sm text-gray-400 mb-4">
                    Enter patient name and select a framework to continue
                  </div>
                )}

                {inputMode === 'record' ? (
                  <div className="space-y-4">
                    <AudioRecorder
                      onRecordingComplete={handleRecordingComplete}
                      onPartialTranscript={handlePartialTranscript}
                      frameworkId={frameworkId}
                      disabled={!canRecord}
                    />
                    {/* Live transcript panel */}
                    {liveTranscript && (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-60 overflow-y-auto">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live Transcript</h3>
                          <span className="text-xs text-gray-400">{transcriptWordCount} words</span>
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: liveTranscript
                              .replace(/\*\*(Clinician|Patient|Speaker):\*\*/g, '<strong class="text-[#1e3a5f]">$1:</strong>')
                              .replace(/_\[silence[^]]*?\]_/g, '<span class="text-gray-400 italic text-xs">$&</span>')
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ACCEPTED_AUDIO}
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {!uploadedFile ? (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!canRecord}
                        className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-[#0d9488] hover:bg-[#0d9488]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Click to upload audio file</p>
                            <p className="text-xs text-gray-400 mt-1">MP3, MP4, M4A, WAV, WebM, OGG, AAC, FLAC, WMA</p>
                          </div>
                        </div>
                      </button>
                    ) : (
                      <div className="w-full max-w-md">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="w-10 h-10 rounded-lg bg-[#0d9488]/10 flex items-center justify-center flex-shrink-0">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0d9488">
                              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile.name}</p>
                            <p className="text-xs text-gray-400">{formatFileSize(uploadedFile.size)}</p>
                          </div>
                          <button onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="text-gray-400 hover:text-red-500 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <button
                          onClick={handleUploadSubmit}
                          disabled={!canRecord || !uploadedFile}
                          className="w-full mt-4 px-6 py-3 bg-[#0d9488] text-white rounded-xl text-sm font-medium hover:bg-[#0f766e] transition-colors shadow-md hover:shadow-lg"
                        >
                          Generate Clinical Note
                        </button>
                      </div>
                    )}

                    <p className="text-xs text-gray-400 text-center max-w-sm">
                      Upload a recording of your clinical encounter. Supports most audio formats. Files are processed securely and not stored permanently.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
