'use client';
import { fetchNoteSSE } from '@/lib/sse-fetch';
import { setPhiItem } from '@/lib/phi-storage';

import { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import AudioRecorder, { SilenceStats } from '@/components/AudioRecorder';
import FrameworkSelector from '@/components/FrameworkSelector';
import { ProviderType } from '@/lib/types';
import { getSuggestedDomain } from '@/lib/frameworks';
import { appLog } from '@/lib/logger';
import type { EncounterState } from '@/lib/encounter-state';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const providerTypes: ProviderType[] = ['MD', 'DO', 'PA-C', 'NP', 'PT', 'OT', 'SLP', 'LCSW', 'PhD', 'PsyD'];

const ACCEPTED_AUDIO = '.mp3,.mp4,.m4a,.wav,.webm,.ogg,.aac,.flac,.wma';

// Save a framework ID to the recent-frameworks list in localStorage (non-PHI, no TTL)
function saveRecentFramework(fwId: string): void {
  if (typeof window === 'undefined' || !fwId) return;
  try {
    const key = 'omniscribe-recent-frameworks';
    const raw = localStorage.getItem(key);
    let recent: { frameworkId: string; usedAt: number }[] = raw ? JSON.parse(raw) : [];
    // Remove existing entry for this framework
    recent = recent.filter(r => r.frameworkId !== fwId);
    // Add to front
    recent.unshift({ frameworkId: fwId, usedAt: Date.now() });
    // Keep max 5
    recent = recent.slice(0, 5);
    localStorage.setItem(key, JSON.stringify(recent));
  } catch { /* storage error — non-critical */ }
}

export default function NewVisitPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Sidebar />
        <main className="lg:ml-64 pt-16">
          <div className="p-6 md:p-8 max-w-3xl mx-auto">
            <div className="text-center text-gray-400">Loading...</div>
          </div>
        </main>
      </div>
    }>
      <NewVisitContent />
    </Suspense>
  );
}

interface PatientResult {
  id: string;
  identifier: string;
  firstName: string | null;
  lastName: string | null;
  _count?: { visits: number };
}

function NewVisitContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastBlobRef      = useRef<Blob | null>(null);   // retained for retry after failure
  const lastSessionIdRef = useRef<string>('');
  const abortRef         = useRef<AbortController | null>(null);
  const partialTranscriptRef = useRef<string>(''); // saved transcript if cancel mid-generation
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [patientResults, setPatientResults] = useState<PatientResult[]>([]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [searchingPatients, setSearchingPatients] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [providerType, setProviderType] = useState<ProviderType>('PT');
  const [frameworkId, setFrameworkId] = useState('');
  const [inputMode, setInputMode] = useState<'record' | 'upload'>('record');
  const [step, setStep] = useState<'setup' | 'recording' | 'processing' | 'error'>('setup');
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [processingSteps, setProcessingSteps] = useState<{ label: string; status: 'pending' | 'active' | 'done' }[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [transcriptWordCount, setTranscriptWordCount] = useState(0);
  const [recordingReady, setRecordingReady] = useState(false);
  const pendingEncounterRef = useRef<EncounterState | null>(null);
  const encounterStateRef = useRef<EncounterState | null>(null);

  // Pre-select framework from URL query param (e.g., /visit/new?frameworkId=rehab-pt-eval)
  useEffect(() => {
    const fwParam = searchParams.get('frameworkId');
    if (fwParam && !frameworkId) {
      setFrameworkId(fwParam);
    }
  }, [searchParams, frameworkId]);

  // Debounced patient search
  const searchPatients = useCallback((query: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (query.trim().length < 2) {
      setPatientResults([]);
      setShowPatientDropdown(false);
      return;
    }
    setSearchingPatients(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/patients?q=${encodeURIComponent(query.trim())}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setPatientResults(data.patients || []);
          setShowPatientDropdown(true);
        }
      } catch { /* network error — fail silently */ }
      setSearchingPatients(false);
    }, 300);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowPatientDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePatientInputChange = (value: string) => {
    setPatientSearch(value);
    setPatientName(value);
    // Clear linked patient if user edits after selecting
    if (patientId) setPatientId('');
    searchPatients(value);
  };

  const selectPatient = (patient: PatientResult) => {
    const name = [patient.firstName, patient.lastName].filter(Boolean).join(' ') || patient.identifier;
    setPatientName(name);
    setPatientSearch(name);
    setPatientId(patient.id);
    setShowPatientDropdown(false);
    setPatientResults([]);
  };

  // Helper to advance processing step indicator
  const advanceStep = useCallback((stepIndex: number, steps: { label: string; status: 'pending' | 'active' | 'done' }[]) => {
    const updated = steps.map((s, i) => ({
      ...s,
      status: (i < stepIndex ? 'done' : i === stepIndex ? 'active' : 'pending') as 'pending' | 'active' | 'done',
    }));
    setProcessingSteps(updated);
    return updated;
  }, []);

  const canGenerate = patientName.trim() !== '' && frameworkId !== '';

  // Callback for live transcript updates during recording
  const handlePartialTranscript = useCallback((transcript: string, wordCount: number, state: EncounterState) => {
    setLiveTranscript(transcript);
    setTranscriptWordCount(wordCount);
    encounterStateRef.current = state;
  }, []);

  // Generate note from pre-built EncounterState (2-pass, 30-45s)
  const processWithEncounterState = async (encounterState: EncounterState) => {
    const steps: { label: string; status: 'pending' | 'active' | 'done' }[] = [
      { label: 'Validating clinical data', status: 'active' },
      { label: 'Generating clinical note', status: 'pending' },
      { label: 'Verifying accuracy', status: 'pending' },
      { label: 'Finalizing', status: 'pending' },
    ];
    setProcessingSteps(steps);
    setStep('processing');
    setProgress(10);
    setProgressText('Validating clinical data...');

    try {
      // Step 1: Generate note via encounter-state mode (SSE)
      advanceStep(1, steps);
      setProgress(20);
      setProgressText('Generating clinical note from encounter data...');

      const controller = new AbortController();
      abortRef.current = controller;
      const noteTimeout = setTimeout(() => controller.abort(), 300000);
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
          // Map SSE pass to step indicator
          if (pass >= 2) advanceStep(2, steps);
        },
        controller.signal,
      );
      clearTimeout(noteTimeout);

      if (!noteData.success) {
        throw new Error(String(noteData.error || 'Note generation failed'));
      }

      advanceStep(3, steps);
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
      saveRecentFramework(frameworkId);

      await new Promise(r => setTimeout(r, 500));
      router.push(`/visit/${visitId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (message === 'Aborted') {
        // User cancelled — go back to setup
        setStep('setup');
        setRecordingReady(true);
        return;
      }
      setErrorMsg(message);
      setStep('error');
    } finally {
      abortRef.current = null;
    }
  };

  // Legacy flow: transcribe full audio blob then generate note (6-pass)
  const processAudio = async (audioBlob: Blob) => {
    const steps: { label: string; status: 'pending' | 'active' | 'done' }[] = [
      { label: 'Transcribing audio', status: 'active' },
      { label: 'Generating clinical note', status: 'pending' },
      { label: 'Verifying accuracy', status: 'pending' },
      { label: 'Finalizing', status: 'pending' },
    ];
    setProcessingSteps(steps);
    setStep('processing');
    setProgress(0);

    const SIZE_LIMIT_BYTES = 24 * 1024 * 1024;
    if (audioBlob.size > SIZE_LIMIT_BYTES) {
      const sizeMB = (audioBlob.size / (1024 * 1024)).toFixed(0);
      setProgressText(`Transcribing large audio file (${sizeMB}MB) — splitting into chunks...`);
    } else {
      setProgressText('Transcribing audio with medical speech recognition...');
    }

    try {
      // Step 1: Transcribe
      setProgress(10);
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('frameworkId', frameworkId);

      const controller = new AbortController();
      abortRef.current = controller;
      const transcribeTimeout = setTimeout(() => controller.abort(), 600000); // 10 min (allows for large file upload + Deepgram processing)
      const transcribeRes = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(transcribeTimeout);

      const transcribeData = await transcribeRes.json();
      if (!transcribeData.success) {
        throw new Error(transcribeData.error || 'Transcription failed');
      }

      advanceStep(1, steps);
      setProgress(40);
      setProgressText('Generating clinical note...');

      // Save transcript in case user cancels during note generation
      partialTranscriptRef.current = transcribeData.transcript;

      // Step 2: Generate note (SSE streaming to keep connection alive)
      const noteTimeout = setTimeout(() => controller.abort(), 600000); // 10 min — complex frameworks need time
      const noteData = await fetchNoteSSE(
        { transcript: transcribeData.transcript, frameworkId, useMock: false },
        (pass, total, message) => {
          const pct = 40 + Math.round((pass / total) * 40);
          setProgress(pct);
          setProgressText(message);
          if (pass >= 2) advanceStep(2, steps);
        },
        controller.signal
      );
      clearTimeout(noteTimeout);
      if (!noteData.success) {
        throw new Error(String(noteData.error || 'Note generation failed'));
      }

      advanceStep(3, steps);
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
      saveRecentFramework(frameworkId);

      await new Promise(r => setTimeout(r, 500));
      router.push(`/visit/${visitId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (message === 'Aborted') {
        // User cancelled — save draft if we have a transcript
        if (partialTranscriptRef.current) {
          const draftId = `visit-draft-${Date.now()}`;
          setPhiItem(`omniscribe-visit-${draftId}`, {
            id: draftId,
            patientName,
            providerType,
            frameworkId,
            transcript: partialTranscriptRef.current,
            transcriptSource: 'groq-whisper',
            status: 'draft',
            createdAt: new Date().toISOString(),
          });
          partialTranscriptRef.current = '';
        }
        setStep('setup');
        setRecordingReady(!!lastBlobRef.current);
        return;
      }
      setErrorMsg(message);
      setStep('error');
    } finally {
      abortRef.current = null;
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
    pendingEncounterRef.current = encounterState ?? null;
    if (silenceStats) {
      appLog('info', 'NewVisit', 'Silence stripped', { silenceStrippedSec: silenceStats.silenceStrippedSec, originalDurationSec: silenceStats.originalDurationSec });
    }

    // If patient name or framework not yet set, hold the recording and wait
    if (!patientName.trim() || !frameworkId) {
      setRecordingReady(true);
      return;
    }

    // Use encounter-state mode if real-time extraction produced data
    if (encounterState && encounterState.chunk_count > 0) {
      appLog('info', 'NewVisit', 'Using encounter-state mode', { chunkCount: encounterState.chunk_count, statementCount: encounterState.diarized_transcript.length });
      await processWithEncounterState(encounterState);
    } else {
      // Fallback to legacy transcribe-then-generate flow
      await processAudio(blob);
    }
  };

  // Process a completed recording that was waiting for patient/framework
  const handleGenerateFromRecording = async () => {
    if (!lastBlobRef.current || !canGenerate) return;
    setRecordingReady(false);
    const enc = pendingEncounterRef.current;
    if (enc && enc.chunk_count > 0) {
      await processWithEncounterState(enc);
    } else {
      await processAudio(lastBlobRef.current);
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

    // Early reject non-WAV files > 24MB client-side (avoids uploading 100MB+ just to get a 413)
    const SIZE_LIMIT = 24 * 1024 * 1024;
    if (uploadedFile.size > SIZE_LIMIT) {
      const ext = uploadedFile.name.split('.').pop()?.toLowerCase();
      if (ext !== 'wav') {
        const sizeMB = (uploadedFile.size / (1024 * 1024)).toFixed(1);
        setErrorMsg(
          `This ${ext?.toUpperCase() || 'audio'} file is ${sizeMB}MB, which exceeds the 24MB limit. ` +
          `Only WAV files can be automatically split into chunks for large recordings. ` +
          `Please convert to WAV format, or use a shorter recording.`
        );
        setStep('error');
        return;
      }
    }

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
            <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Generating your clinical note...</h2>

              {/* Step indicator */}
              <div className="max-w-sm mx-auto mb-8 space-y-3">
                {processingSteps.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {s.status === 'done' ? (
                      <div className="w-7 h-7 rounded-full bg-[#0d9488] flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    ) : s.status === 'active' ? (
                      <div className="w-7 h-7 rounded-full bg-[#0d9488]/10 flex items-center justify-center shrink-0">
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      </div>
                    )}
                    <span className={`text-sm ${
                      s.status === 'done' ? 'text-[#0d9488] font-medium' :
                      s.status === 'active' ? 'text-gray-900 font-medium' :
                      'text-gray-400'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="text-center">
                <p className="text-gray-500 mb-3 text-xs">{progressText}</p>
                <div className="w-full max-w-md mx-auto h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0d9488] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <div className="text-xs text-gray-400 mt-1.5">{progress}%</div>
              </div>

              {/* Cancel button */}
              <div className="text-center mt-6">
                <button
                  onClick={() => abortRef.current?.abort()}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <p className="text-[10px] text-gray-400 mt-1">
                  {partialTranscriptRef.current ? 'Transcript will be saved as draft' : 'Recording is preserved for retry'}
                </p>
              </div>
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
                  <div ref={dropdownRef} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={patientSearch}
                        onChange={(e) => handlePatientInputChange(e.target.value)}
                        onFocus={() => { if (patientResults.length > 0 && !patientId) setShowPatientDropdown(true); }}
                        placeholder="Search existing or type new name..."
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] transition-colors ${
                          patientId ? 'border-[#0d9488] bg-[#0d9488]/5' : 'border-gray-300'
                        }`}
                      />
                      {patientId && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded bg-[#0d9488]/10 text-[#0d9488] font-medium">
                          Linked
                        </span>
                      )}
                      {searchingPatients && !patientId && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">...</span>
                      )}
                    </div>
                    {/* Autocomplete dropdown */}
                    {showPatientDropdown && patientResults.length > 0 && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {patientResults.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => selectPatient(p)}
                            className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                          >
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {[p.firstName, p.lastName].filter(Boolean).join(' ') || p.identifier}
                              </div>
                              <div className="text-xs text-gray-400">ID: {p.identifier}</div>
                            </div>
                            {p._count?.visits !== undefined && (
                              <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                                {p._count.visits} visit{p._count.visits !== 1 ? 's' : ''}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    {showPatientDropdown && patientResults.length === 0 && patientSearch.trim().length >= 2 && !searchingPatients && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2.5">
                        <div className="text-xs text-gray-500">No matching patients. Name will be used for a new record.</div>
                      </div>
                    )}
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
                <FrameworkSelector onSelect={setFrameworkId} selectedId={frameworkId} suggestedDomain={getSuggestedDomain(providerType)} />
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

                {!canGenerate && (
                  <div className="text-center text-sm text-gray-400 mb-4">
                    You can start recording now — fill in patient name and framework before or during recording
                  </div>
                )}

                {inputMode === 'record' ? (
                  <div className="space-y-4">
                    <AudioRecorder
                      onRecordingComplete={handleRecordingComplete}
                      onPartialTranscript={handlePartialTranscript}
                      frameworkId={frameworkId}
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
                            __html: escapeHtml(liveTranscript)
                              .replace(/\*\*(Clinician|Patient|Speaker):\*\*/g, '<strong class="text-[#1e3a5f]">$1:</strong>')
                              .replace(/_\[silence[^]]*?\]_/g, '<span class="text-gray-400 italic text-xs">$&</span>')
                          }}
                        />
                      </div>
                    )}
                    {/* Recording complete — waiting for patient/framework */}
                    {recordingReady && (
                      <div className="bg-[#0d9488]/5 border border-[#0d9488]/20 rounded-xl p-4 text-center">
                        <p className="text-sm font-medium text-gray-900 mb-1">Recording complete!</p>
                        {canGenerate ? (
                          <button
                            onClick={handleGenerateFromRecording}
                            className="mt-2 px-6 py-2.5 bg-[#0d9488] text-white rounded-lg text-sm font-medium hover:bg-[#0f766e] transition-colors"
                          >
                            Generate Clinical Note
                          </button>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Fill in {!patientName.trim() ? 'patient name' : ''}{!patientName.trim() && !frameworkId ? ' and ' : ''}{!frameworkId ? 'framework' : ''} above, then generate your note.
                          </p>
                        )}
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
                        disabled={!canGenerate}
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
                          disabled={!canGenerate || !uploadedFile}
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
