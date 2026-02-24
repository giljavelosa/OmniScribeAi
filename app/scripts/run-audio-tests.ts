#!/usr/bin/env tsx
/**
 * Audio End-to-End Test Suite
 *
 * Tests the full pipeline: audio file → Groq Whisper → transcript → Grok → clinical note.
 *
 * Short mode (default): 5 short WAV files from test-transcripts.ts
 * Long mode (--long):   5 long WAV files from mockTranscripts (duration/stability)
 *
 * Usage:
 *   npm run test:notes:audio                — short, full pipeline
 *   npm run test:notes:audio:transcribe     — short, transcription only
 *   npm run test:notes:audio:long           — long, duration/stability test
 *   npx tsx scripts/run-audio-tests.ts [--long] [--transcribe-only]
 *
 * Prerequisites:
 *   - Dev server running at localhost:3000
 *   - Audio files generated: npm run test:audio:generate [--long]
 *   - demo@omniscribe.ai account seeded in DB
 *   - GROQ_API_KEY configured (for transcription)
 *   - XAI_API_KEY configured (for note generation, unless --transcribe-only)
 */

import { testTranscripts } from '../src/lib/test-transcripts';
import { mockTranscripts } from '../src/lib/mock-data';
import { parseResponse, extractResult, extractError } from './lib/sse-parser';
import {
  scoreFactRecall,
  scoreHallucinations,
  computeComposite,
  flattenNote,
} from './lib/test-scoring';
import { scoreTranscription, MEDICAL_TERMS, LONG_MEDICAL_TERMS, type TranscriptionScore } from './lib/transcription-scoring';
import * as fs from 'fs';
import * as path from 'path';

// ─── Config ──────────────────────────────────────────────────

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const CREDENTIALS = {
  email: 'demo@omniscribe.ai',
  password: 'Demo2026!',
};
const TRANSCRIBE_ONLY = process.argv.includes('--transcribe-only');
const LONG_MODE = process.argv.includes('--long');
const TRANSCRIBE_TIMEOUT_MS = LONG_MODE ? 300_000 : 180_000;
const NOTE_TIMEOUT_MS = 120_000;
const AUDIO_DIR = path.resolve(__dirname, '../test-audio');

// ─── Test case definitions ───────────────────────────────────

interface AudioTestCase {
  key: string;           // audio file key (maps to test-audio/<key>.wav)
  label: string;         // display name
  sourceText: string;    // original text for transcription scoring
  frameworkId?: string;  // if set, note generation is run
  domain: string;
  expectedFacts?: Record<string, string>;   // for fact recall scoring
  shouldNotAppear?: string[];               // for hallucination scoring
  concatOnly?: boolean;  // if true, transcription-only (multi-encounter)
}

// Short mode test cases
const SHORT_CASES: AudioTestCase[] = [
  'transcriptA', 'soapNew', 'hp', 'transcriptC', 'psychEval',
].map(k => {
  const t = testTranscripts[k];
  return {
    key: k,
    label: t.label,
    sourceText: t.text,
    frameworkId: t.frameworkId,
    domain: t.domain,
    expectedFacts: t.expectedFacts,
    shouldNotAppear: t.shouldNotAppear,
  };
});

// Long mode test cases
const LONG_CASES: AudioTestCase[] = [
  {
    key: 'long-bh-crisis',
    label: 'BH Crisis (long dialogue)',
    sourceText: mockTranscripts['bh-crisis'],
    frameworkId: 'bh-crisis',
    domain: 'bh',
  },
  {
    key: 'long-bh-intake',
    label: 'BH Intake (long dialogue)',
    sourceText: mockTranscripts['bh-intake'],
    frameworkId: 'bh-intake',
    domain: 'bh',
  },
  {
    key: 'long-med-ed',
    label: 'ED Note (long dialogue)',
    sourceText: mockTranscripts['med-ed'],
    frameworkId: 'med-ed',
    domain: 'medical',
  },
  {
    key: 'long-concat-medical',
    label: 'Concatenated Medical (3 encounters)',
    sourceText: [mockTranscripts['med-hp'], mockTranscripts['med-ed'], mockTranscripts['med-soap-new']].join('\n\n'),
    domain: 'medical',
    concatOnly: true,
  },
  {
    key: 'long-concat-bh',
    label: 'Concatenated BH (3 encounters)',
    sourceText: [mockTranscripts['bh-crisis'], mockTranscripts['bh-psych-eval'], mockTranscripts['bh-intake']].join('\n\n'),
    domain: 'bh',
    concatOnly: true,
  },
];

const TEST_CASES = LONG_MODE ? LONG_CASES : SHORT_CASES;
const OVERLAP_THRESHOLD = LONG_MODE ? 65 : 70;
const MED_TERM_THRESHOLD = 60;

// ─── Colors (ANSI) ───────────────────────────────────────────

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// ─── Types ───────────────────────────────────────────────────

interface NoteResult {
  status: 'pass' | 'fail' | 'error';
  latencyMs: number;
  compositeScore?: number;
  factRecall?: { total: number; found: number; score: number; missed: string[] };
  hallucinations?: { count: number; found: string[] };
  auditClean?: boolean;
  complianceGrade?: string;
  structuralPass?: boolean;
  sectionCount?: number;
  error?: string;
}

interface AudioTestResult {
  id: string;
  label: string;
  frameworkId: string;
  domain: string;
  transcription: {
    status: 'pass' | 'fail' | 'error';
    latencyMs: number;
    scoring: TranscriptionScore;
    whisperText: string;
    error?: string;
  };
  noteGeneration?: NoteResult;
  e2eLatencyMs: number;
  status: 'pass' | 'fail' | 'error';
}

// ─── Preflight ───────────────────────────────────────────────

async function preflight(): Promise<void> {
  console.log(`\n${C.cyan}Preflight:${C.reset} checking dev server at ${BASE_URL}...`);
  try {
    const res = await fetch(`${BASE_URL}/api/auth/csrf`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log(`${C.green}  ✓ Dev server is running${C.reset}`);
  } catch {
    console.error(`${C.red}  ✗ Dev server not reachable at ${BASE_URL}${C.reset}`);
    console.error(`  Start it with: cd app && npm run dev\n`);
    process.exit(1);
  }

  let missing = 0;
  for (const tc of TEST_CASES) {
    const wavPath = path.join(AUDIO_DIR, `${tc.key}.wav`);
    if (!fs.existsSync(wavPath)) {
      console.error(`${C.red}  ✗ Missing: ${wavPath}${C.reset}`);
      missing++;
    }
  }
  if (missing > 0) {
    const genCmd = LONG_MODE ? 'npm run test:audio:generate:long' : 'npm run test:audio:generate';
    console.error(`\n  Generate audio first: ${genCmd}\n`);
    process.exit(1);
  }
  console.log(`${C.green}  ✓ ${TEST_CASES.length} audio files found${C.reset}\n`);
}

// ─── Auth ────────────────────────────────────────────────────

interface AuthSession { cookies: string }

async function authenticate(): Promise<AuthSession> {
  console.log(`${C.cyan}Auth:${C.reset} logging in as ${CREDENTIALS.email}...`);

  const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`);
  const csrfData = await csrfRes.json() as { csrfToken: string };
  const csrfCookies = csrfRes.headers.getSetCookie?.() ?? [];

  const signInRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': csrfCookies.join('; '),
    },
    body: new URLSearchParams({
      csrfToken: csrfData.csrfToken,
      email: CREDENTIALS.email,
      password: CREDENTIALS.password,
    }).toString(),
    redirect: 'manual',
  });

  const signInCookies = signInRes.headers.getSetCookie?.() ?? [];
  const cookieString = [...csrfCookies, ...signInCookies]
    .map(c => c.split(';')[0])
    .filter(Boolean)
    .join('; ');

  const sessionRes = await fetch(`${BASE_URL}/api/auth/session`, {
    headers: { 'Cookie': cookieString },
  });
  const sessionData = await sessionRes.json() as Record<string, unknown>;

  if (!sessionData.user) {
    console.error(`${C.red}  ✗ Auth failed${C.reset}`);
    process.exit(1);
  }

  console.log(`${C.green}  ✓ Authenticated${C.reset}\n`);
  return { cookies: cookieString };
}

// ─── Structural note validation (for long mode without expectedFacts) ───

function validateNoteStructure(clinicalNote: unknown): { pass: boolean; sectionCount: number } {
  if (!Array.isArray(clinicalNote) || clinicalNote.length === 0) {
    return { pass: false, sectionCount: 0 };
  }
  for (const section of clinicalNote) {
    if (typeof section !== 'object' || section === null) return { pass: false, sectionCount: clinicalNote.length };
    const s = section as Record<string, unknown>;
    if (typeof s.title !== 'string' || s.title.trim().length === 0) return { pass: false, sectionCount: clinicalNote.length };
    if (typeof s.content !== 'string' || s.content.trim().length === 0) return { pass: false, sectionCount: clinicalNote.length };
  }
  return { pass: true, sectionCount: clinicalNote.length };
}

// ─── Run Single Audio Test ───────────────────────────────────

const EMPTY_SCORING: TranscriptionScore = { wordOverlap: 0, medicalTermAccuracy: 0, sourceWordCount: 0, transcribedWordCount: 0, missingMedTerms: [] };

async function runAudioTest(
  tc: AudioTestCase,
  auth: AuthSession,
  index: number,
  total: number,
): Promise<AudioTestResult> {
  const label = `[${index + 1}/${total}] ${tc.label}`;
  const e2eStart = Date.now();

  const baseResult = {
    id: tc.key,
    label: tc.label,
    frameworkId: tc.frameworkId ?? 'none',
    domain: tc.domain,
  };

  // ═══ PHASE 1: TRANSCRIPTION ═══
  process.stdout.write(`  ${C.dim}${label}${C.reset}\n`);
  process.stdout.write(`    ${C.dim}Transcribing...${C.reset} `);

  let whisperText = '';
  let transcribeLatency = 0;
  let transcriptionScoring: TranscriptionScore = EMPTY_SCORING;

  try {
    const wavPath = path.join(AUDIO_DIR, `${tc.key}.wav`);
    const audioBuffer = fs.readFileSync(wavPath);
    const fileSizeMB = (audioBuffer.byteLength / (1024 * 1024)).toFixed(1);
    const blob = new Blob([audioBuffer], { type: 'audio/wav' });

    const formData = new FormData();
    formData.append('audio', blob, `${tc.key}.wav`);
    if (tc.frameworkId) formData.append('frameworkId', tc.frameworkId);

    const tStart = Date.now();
    const res = await fetch(`${BASE_URL}/api/transcribe`, {
      method: 'POST',
      headers: { 'Cookie': auth.cookies },
      body: formData,
      signal: AbortSignal.timeout(TRANSCRIBE_TIMEOUT_MS),
    });
    transcribeLatency = Date.now() - tStart;

    if (!res.ok) {
      const body = await res.text();
      console.log(`${C.red}HTTP ${res.status}${C.reset}`);
      return { ...baseResult, transcription: { status: 'error', latencyMs: transcribeLatency, whisperText: '', scoring: EMPTY_SCORING, error: `HTTP ${res.status}: ${body.slice(0, 200)}` }, e2eLatencyMs: Date.now() - e2eStart, status: 'error' };
    }

    const data = await res.json() as Record<string, unknown>;
    if (!data.success) {
      console.log(`${C.red}API error: ${data.error}${C.reset}`);
      return { ...baseResult, transcription: { status: 'error', latencyMs: transcribeLatency, whisperText: '', scoring: EMPTY_SCORING, error: String(data.error) }, e2eLatencyMs: Date.now() - e2eStart, status: 'error' };
    }

    whisperText = String(data.transcript || '');
    const medTermsMap = LONG_MODE ? LONG_MEDICAL_TERMS : MEDICAL_TERMS;
    const medTerms = medTermsMap[tc.key] ?? [];
    transcriptionScoring = scoreTranscription(tc.sourceText, whisperText, medTerms);

    const txPass = transcriptionScoring.wordOverlap >= OVERLAP_THRESHOLD && transcriptionScoring.medicalTermAccuracy >= MED_TERM_THRESHOLD;
    const txStatus = txPass ? 'pass' : 'fail';
    const overlapColor = transcriptionScoring.wordOverlap >= 80 ? C.green : transcriptionScoring.wordOverlap >= OVERLAP_THRESHOLD ? C.yellow : C.red;
    const medColor = transcriptionScoring.medicalTermAccuracy >= 80 ? C.green : transcriptionScoring.medicalTermAccuracy >= MED_TERM_THRESHOLD ? C.yellow : C.red;
    const txIcon = txStatus === 'pass' ? `${C.green}✓${C.reset}` : `${C.red}✗${C.reset}`;

    console.log(`${txIcon} overlap:${overlapColor}${transcriptionScoring.wordOverlap}%${C.reset} medTerms:${medColor}${transcriptionScoring.medicalTermAccuracy}%${C.reset} ${C.dim}${(transcribeLatency / 1000).toFixed(1)}s ${fileSizeMB}MB${C.reset}`);

    if (transcriptionScoring.missingMedTerms.length > 0) {
      console.log(`      ${C.yellow}missed terms: ${transcriptionScoring.missingMedTerms.join(', ')}${C.reset}`);
    }

    // Skip note generation for concat-only or transcribe-only
    if (TRANSCRIBE_ONLY || tc.concatOnly) {
      if (tc.concatOnly) {
        console.log(`    ${C.dim}(concatenated — transcription only)${C.reset}`);
      }
      return { ...baseResult, transcription: { status: txStatus, latencyMs: transcribeLatency, scoring: transcriptionScoring, whisperText }, e2eLatencyMs: Date.now() - e2eStart, status: txStatus };
    }

    // ═══ PHASE 2: NOTE GENERATION ═══
    if (!tc.frameworkId) {
      return { ...baseResult, transcription: { status: txStatus, latencyMs: transcribeLatency, scoring: transcriptionScoring, whisperText }, e2eLatencyMs: Date.now() - e2eStart, status: txStatus };
    }

    process.stdout.write(`    ${C.dim}Generating note...${C.reset} `);

    const nStart = Date.now();
    const noteRes = await fetch(`${BASE_URL}/api/generate-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': auth.cookies },
      body: JSON.stringify({ transcript: whisperText, frameworkId: tc.frameworkId }),
      signal: AbortSignal.timeout(NOTE_TIMEOUT_MS),
    });
    const noteLatency = Date.now() - nStart;

    if (!noteRes.ok) {
      const body = await noteRes.text();
      console.log(`${C.red}HTTP ${noteRes.status}${C.reset}`);
      return { ...baseResult, transcription: { status: txStatus, latencyMs: transcribeLatency, scoring: transcriptionScoring, whisperText }, noteGeneration: { status: 'error', latencyMs: noteLatency, error: `HTTP ${noteRes.status}: ${body.slice(0, 200)}` }, e2eLatencyMs: Date.now() - e2eStart, status: 'error' };
    }

    const rawText = await noteRes.text();
    const contentType = noteRes.headers.get('content-type') ?? '';
    const events = parseResponse(rawText, contentType);

    const errorData = extractError(events);
    if (errorData) {
      console.log(`${C.red}API error${C.reset}`);
      return { ...baseResult, transcription: { status: txStatus, latencyMs: transcribeLatency, scoring: transcriptionScoring, whisperText }, noteGeneration: { status: 'error', latencyMs: noteLatency, error: String(errorData.error) }, e2eLatencyMs: Date.now() - e2eStart, status: 'error' };
    }

    const result = extractResult(events);
    if (!result || !result.success) {
      console.log(`${C.red}No result${C.reset}`);
      return { ...baseResult, transcription: { status: txStatus, latencyMs: transcribeLatency, scoring: transcriptionScoring, whisperText }, noteGeneration: { status: 'error', latencyMs: noteLatency, error: 'No result event in response' }, e2eLatencyMs: Date.now() - e2eStart, status: 'error' };
    }

    const clinicalNote = result.clinicalNote;

    // Long mode: structural validation only (no expectedFacts)
    if (LONG_MODE || !tc.expectedFacts) {
      const structural = validateNoteStructure(clinicalNote);
      const noteStatus = structural.pass ? 'pass' : 'fail';
      const noteIcon = noteStatus === 'pass' ? `${C.green}✓${C.reset}` : `${C.red}✗${C.reset}`;
      console.log(`${noteIcon} ${C.green}STRUCT${C.reset} sections:${structural.sectionCount} ${C.dim}${(noteLatency / 1000).toFixed(1)}s${C.reset}`);

      const overallStatus = txStatus === 'pass' && noteStatus === 'pass' ? 'pass' : 'fail';
      return {
        ...baseResult,
        transcription: { status: txStatus, latencyMs: transcribeLatency, scoring: transcriptionScoring, whisperText },
        noteGeneration: { status: noteStatus, latencyMs: noteLatency, structuralPass: structural.pass, sectionCount: structural.sectionCount },
        e2eLatencyMs: Date.now() - e2eStart,
        status: overallStatus,
      };
    }

    // Short mode: full fact recall + hallucination scoring
    const noteArray = clinicalNote as Array<{ title: string; content: string }>;
    const noteText = flattenNote(noteArray);

    const factRecall = scoreFactRecall(tc.expectedFacts, noteText);
    const hallucinations = scoreHallucinations(tc.shouldNotAppear ?? [], noteText);
    const auditClean = result.auditClean !== false;
    const complianceGrade = (result.compliance as Record<string, string>)?.grade ?? 'N/A';
    const generationTime = (result.generationTime as number) ?? (noteLatency / 1000);
    const tokensUsed = (result.tokensUsed as number) ?? 0;

    const scoring = computeComposite(factRecall, hallucinations, auditClean, complianceGrade, generationTime, tokensUsed);

    const notePassed = scoring.compositeScore >= 50 && hallucinations.count === 0;
    const noteStatus = notePassed ? 'pass' : 'fail';

    const scoreColor = scoring.compositeScore >= 85 ? C.green : scoring.compositeScore >= 50 ? C.yellow : C.red;
    const noteIcon = noteStatus === 'pass' ? `${C.green}✓${C.reset}` : `${C.red}✗${C.reset}`;
    console.log(`${noteIcon} ${scoreColor}${scoring.compositeScore}%${C.reset} recall:${factRecall.score}% halluc:${hallucinations.count} audit:${auditClean ? 'clean' : 'FLAG'} grade:${complianceGrade} ${C.dim}${(noteLatency / 1000).toFixed(1)}s${C.reset}`);

    if (factRecall.missed.length > 0) {
      console.log(`      ${C.yellow}missed facts: ${factRecall.missed.join(', ')}${C.reset}`);
    }
    if (hallucinations.found.length > 0) {
      console.log(`      ${C.red}hallucinated: ${hallucinations.found.join(', ')}${C.reset}`);
    }

    const overallStatus = txStatus === 'pass' && noteStatus === 'pass' ? 'pass' : 'fail';
    return {
      ...baseResult,
      transcription: { status: txStatus, latencyMs: transcribeLatency, scoring: transcriptionScoring, whisperText },
      noteGeneration: {
        status: noteStatus, latencyMs: noteLatency, compositeScore: scoring.compositeScore,
        factRecall: { total: factRecall.total, found: factRecall.found, score: factRecall.score, missed: factRecall.missed },
        hallucinations: { count: hallucinations.count, found: hallucinations.found },
        auditClean, complianceGrade,
      },
      e2eLatencyMs: Date.now() - e2eStart,
      status: overallStatus,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`${C.red}ERROR: ${msg}${C.reset}`);
    return { ...baseResult, transcription: { status: 'error', latencyMs: transcribeLatency || 0, whisperText, scoring: transcriptionScoring, error: msg }, e2eLatencyMs: Date.now() - e2eStart, status: 'error' };
  }
}

// ─── Summary Tables ──────────────────────────────────────────

function printSummary(results: AudioTestResult[]): void {
  const modeTag = LONG_MODE ? ' (LONG — duration/stability)' : '';

  // Transcription table
  console.log(`\n${'═'.repeat(85)}`);
  console.log(`${C.bold}${C.cyan}  TRANSCRIPTION RESULTS${modeTag}${C.reset}`);
  console.log(`${'═'.repeat(85)}`);

  const txHeader = [
    '#'.padEnd(3),
    'Test'.padEnd(35),
    'Overlap'.padEnd(9),
    'MedTerms'.padEnd(10),
    'Latency'.padEnd(9),
    'Status'.padEnd(6),
  ].join(' ');
  console.log(`  ${C.dim}${txHeader}${C.reset}`);
  console.log(`  ${'─'.repeat(72)}`);

  results.forEach((r, i) => {
    const tx = r.transcription;
    const overlapColor = tx.scoring.wordOverlap >= 80 ? C.green : tx.scoring.wordOverlap >= OVERLAP_THRESHOLD ? C.yellow : C.red;
    const medColor = tx.scoring.medicalTermAccuracy >= 80 ? C.green : tx.scoring.medicalTermAccuracy >= MED_TERM_THRESHOLD ? C.yellow : C.red;
    const statusIcon = tx.status === 'pass' ? `${C.green}PASS${C.reset}`
      : tx.status === 'fail' ? `${C.red}FAIL${C.reset}`
      : `${C.red}ERR ${C.reset}`;

    const row = [
      String(i + 1).padEnd(3),
      r.label.slice(0, 35).padEnd(35),
      `${overlapColor}${tx.scoring.wordOverlap}%${C.reset}`.padEnd(9 + overlapColor.length + C.reset.length),
      `${medColor}${tx.scoring.medicalTermAccuracy}%${C.reset}`.padEnd(10 + medColor.length + C.reset.length),
      `${(tx.latencyMs / 1000).toFixed(1)}s`.padEnd(9),
      statusIcon,
    ].join(' ');
    console.log(`  ${row}`);
  });

  console.log(`  ${'─'.repeat(72)}`);

  const txPassed = results.filter(r => r.transcription.status === 'pass').length;
  const avgOverlap = Math.round(results.reduce((s, r) => s + r.transcription.scoring.wordOverlap, 0) / results.length);
  const avgMed = Math.round(results.reduce((s, r) => s + r.transcription.scoring.medicalTermAccuracy, 0) / results.length);
  const totalTxTime = results.reduce((s, r) => s + r.transcription.latencyMs, 0) / 1000;

  console.log(`\n  ${C.bold}Transcription:${C.reset} ${txPassed}/${results.length} pass  |  Avg overlap: ${avgOverlap}%  |  Avg med terms: ${avgMed}%  |  Total: ${totalTxTime.toFixed(1)}s`);

  // Note generation table (unless all transcribe-only)
  const noteResults = results.filter(r => r.noteGeneration);
  if (noteResults.length > 0 && !TRANSCRIBE_ONLY) {
    console.log(`\n${'═'.repeat(85)}`);
    console.log(`${C.bold}${C.cyan}  NOTE GENERATION RESULTS${modeTag}${C.reset}`);
    console.log(`${'═'.repeat(85)}`);

    if (LONG_MODE) {
      // Long mode: structural validation table
      const header = ['#'.padEnd(3), 'Test'.padEnd(35), 'Sections'.padEnd(10), 'Latency'.padEnd(9), 'Status'.padEnd(6)].join(' ');
      console.log(`  ${C.dim}${header}${C.reset}`);
      console.log(`  ${'─'.repeat(63)}`);

      noteResults.forEach((r, i) => {
        const ng = r.noteGeneration!;
        const statusIcon = ng.status === 'pass' ? `${C.green}PASS${C.reset}` : ng.status === 'fail' ? `${C.red}FAIL${C.reset}` : `${C.red}ERR ${C.reset}`;
        const row = [
          String(i + 1).padEnd(3),
          r.label.slice(0, 35).padEnd(35),
          String(ng.sectionCount ?? '-').padEnd(10),
          `${(ng.latencyMs / 1000).toFixed(1)}s`.padEnd(9),
          statusIcon,
        ].join(' ');
        console.log(`  ${row}`);
      });
      console.log(`  ${'─'.repeat(63)}`);
    } else {
      // Short mode: full scoring table
      const noteHeader = ['#'.padEnd(3), 'Test'.padEnd(35), 'Score'.padEnd(7), 'Recall'.padEnd(8), 'Halluc'.padEnd(8), 'E2E'.padEnd(7), 'Status'.padEnd(6)].join(' ');
      console.log(`  ${C.dim}${noteHeader}${C.reset}`);
      console.log(`  ${'─'.repeat(74)}`);

      noteResults.forEach((r, i) => {
        const ng = r.noteGeneration!;
        if (ng.compositeScore != null) {
          const scoreColor = ng.compositeScore >= 85 ? C.green : ng.compositeScore >= 50 ? C.yellow : C.red;
          const statusIcon = r.status === 'pass' ? `${C.green}PASS${C.reset}` : `${C.red}FAIL${C.reset}`;
          const row = [
            String(i + 1).padEnd(3),
            r.label.slice(0, 35).padEnd(35),
            `${scoreColor}${ng.compositeScore}%${C.reset}`.padEnd(7 + scoreColor.length + C.reset.length),
            `${ng.factRecall?.score ?? '-'}%`.padEnd(8),
            String(ng.hallucinations?.count ?? '-').padEnd(8),
            `${(r.e2eLatencyMs / 1000).toFixed(1)}s`.padEnd(7),
            statusIcon,
          ].join(' ');
          console.log(`  ${row}`);
        } else {
          const row = [String(i + 1).padEnd(3), r.label.slice(0, 35).padEnd(35), `${C.red}ERR${C.reset}`.padEnd(7 + C.red.length + C.reset.length), '-'.padEnd(8), '-'.padEnd(8), '-'.padEnd(7), `${C.red}ERR ${C.reset}`].join(' ');
          console.log(`  ${row}`);
        }
      });
      console.log(`  ${'─'.repeat(74)}`);

      const scored = noteResults.filter(r => r.noteGeneration?.compositeScore != null);
      const e2ePassed = results.filter(r => r.status === 'pass').length;
      const avgComposite = scored.length > 0 ? Math.round(scored.reduce((s, r) => s + (r.noteGeneration?.compositeScore ?? 0), 0) / scored.length) : 0;
      const avgRecall = scored.length > 0 ? Math.round(scored.reduce((s, r) => s + (r.noteGeneration?.factRecall?.score ?? 0), 0) / scored.length) : 0;
      const totalE2E = results.reduce((s, r) => s + r.e2eLatencyMs, 0) / 1000;

      console.log(`\n  ${C.bold}End-to-end:${C.reset} ${e2ePassed}/${results.length} pass  |  Avg composite: ${avgComposite}%  |  Avg recall: ${avgRecall}%  |  Total: ${totalE2E.toFixed(1)}s`);
    }
  }

  // Overall
  const allPassed = results.filter(r => r.status === 'pass').length;
  const totalTime = results.reduce((s, r) => s + r.e2eLatencyMs, 0) / 1000;
  console.log(`\n  ${C.bold}Overall:${C.reset} ${allPassed}/${results.length} pass  |  Total time: ${totalTime.toFixed(1)}s`);
  console.log(`\n${'═'.repeat(85)}\n`);
}

// ─── Save Results ────────────────────────────────────────────

function saveResults(results: AudioTestResult[]): string {
  const resultsDir = path.resolve(__dirname, '../../test-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const modeTag = LONG_MODE ? 'long' : TRANSCRIBE_ONLY ? 'transcribe' : 'e2e';
  const filename = `audio-test-${modeTag}-${timestamp}.json`;
  const filepath = path.join(resultsDir, filename);

  const output = {
    timestamp: new Date().toISOString(),
    mode: modeTag,
    totalTests: results.length,
    passed: results.filter(r => r.status === 'pass').length,
    failed: results.filter(r => r.status === 'fail').length,
    errored: results.filter(r => r.status === 'error').length,
    results: results.map(r => ({
      id: r.id,
      label: r.label,
      frameworkId: r.frameworkId,
      domain: r.domain,
      status: r.status,
      e2eLatencyMs: r.e2eLatencyMs,
      transcription: {
        status: r.transcription.status,
        latencyMs: r.transcription.latencyMs,
        wordOverlap: r.transcription.scoring.wordOverlap,
        medicalTermAccuracy: r.transcription.scoring.medicalTermAccuracy,
        sourceWordCount: r.transcription.scoring.sourceWordCount,
        transcribedWordCount: r.transcription.scoring.transcribedWordCount,
        missingMedTerms: r.transcription.scoring.missingMedTerms,
        error: r.transcription.error,
      },
      noteGeneration: r.noteGeneration ? {
        status: r.noteGeneration.status,
        latencyMs: r.noteGeneration.latencyMs,
        compositeScore: r.noteGeneration.compositeScore,
        factRecall: r.noteGeneration.factRecall,
        hallucinations: r.noteGeneration.hallucinations,
        auditClean: r.noteGeneration.auditClean,
        complianceGrade: r.noteGeneration.complianceGrade,
        structuralPass: r.noteGeneration.structuralPass,
        sectionCount: r.noteGeneration.sectionCount,
        error: r.noteGeneration.error,
      } : undefined,
    })),
  };

  fs.writeFileSync(filepath, JSON.stringify(output, null, 2));
  return filepath;
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const modeLabel = LONG_MODE ? ' (LONG — duration/stability)' : TRANSCRIBE_ONLY ? ' (TRANSCRIPTION ONLY)' : '';
  console.log(`\n${C.bold}${C.cyan}╔══════════════════════════════════════════════════╗${C.reset}`);
  console.log(`${C.bold}${C.cyan}║   OmniScribe AI — Audio E2E Test Suite           ║${C.reset}`);
  console.log(`${C.bold}${C.cyan}╚══════════════════════════════════════════════════╝${C.reset}`);
  if (modeLabel) {
    console.log(`${C.yellow}${modeLabel}${C.reset}`);
  }

  console.log(`\n  ${TEST_CASES.length} audio tests\n`);

  await preflight();
  const auth = await authenticate();

  console.log(`${C.cyan}Running audio tests:${C.reset}\n`);
  const results: AudioTestResult[] = [];

  for (let i = 0; i < TEST_CASES.length; i++) {
    const result = await runAudioTest(TEST_CASES[i], auth, i, TEST_CASES.length);
    results.push(result);

    if (i < TEST_CASES.length - 1) {
      await new Promise(resolve => setTimeout(resolve, LONG_MODE ? 3000 : 2000));
    }
  }

  printSummary(results);

  const filepath = saveResults(results);
  console.log(`${C.dim}Results saved to: ${filepath}${C.reset}\n`);

  const failures = results.filter(r => r.status !== 'pass').length;
  if (failures > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(`${C.red}Fatal error:${C.reset}`, err);
  process.exit(1);
});
