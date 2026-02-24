#!/usr/bin/env tsx
/**
 * Audio End-to-End Test Suite
 *
 * Tests the full pipeline: audio file → Groq Whisper → transcript → Grok → clinical note.
 * Uses 5 WAV files generated from test transcripts via macOS TTS.
 *
 * Usage:
 *   npm run test:notes:audio                — full pipeline (transcribe + generate)
 *   npm run test:notes:audio:transcribe     — transcription only (skip note gen)
 *   npx tsx scripts/run-audio-tests.ts [--transcribe-only]
 *
 * Prerequisites:
 *   - Dev server running at localhost:3000
 *   - Audio files generated: npm run test:audio:generate
 *   - demo@omniscribe.ai account seeded in DB
 *   - GROQ_API_KEY configured (for transcription)
 *   - XAI_API_KEY configured (for note generation, unless --transcribe-only)
 */

import { testTranscripts, type TestTranscript } from '../src/lib/test-transcripts';
import { parseResponse, extractResult, extractError } from './lib/sse-parser';
import {
  scoreFactRecall,
  scoreHallucinations,
  computeComposite,
  flattenNote,
} from './lib/test-scoring';
import { scoreTranscription, MEDICAL_TERMS, type TranscriptionScore } from './lib/transcription-scoring';
import * as fs from 'fs';
import * as path from 'path';

// ─── Config ──────────────────────────────────────────────────

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const CREDENTIALS = {
  email: 'demo@omniscribe.ai',
  password: 'Demo2026!',
};
const TRANSCRIBE_TIMEOUT_MS = 180_000; // 3 min for transcription
const NOTE_TIMEOUT_MS = 120_000;       // 2 min for note generation
const TRANSCRIBE_ONLY = process.argv.includes('--transcribe-only');
const AUDIO_DIR = path.resolve(__dirname, '../test-audio');

// 5 transcript keys (must match generate-test-audio.ts)
const AUDIO_TRANSCRIPT_KEYS = [
  'transcriptA',
  'soapNew',
  'hp',
  'transcriptC',
  'psychEval',
] as const;

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
  noteGeneration?: {
    status: 'pass' | 'fail' | 'error';
    latencyMs: number;
    compositeScore: number;
    factRecall: { total: number; found: number; score: number; missed: string[] };
    hallucinations: { count: number; found: string[] };
    auditClean: boolean;
    complianceGrade: string;
    error?: string;
  };
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

  // Check audio files exist
  let missing = 0;
  for (const key of AUDIO_TRANSCRIPT_KEYS) {
    const wavPath = path.join(AUDIO_DIR, `${key}.wav`);
    if (!fs.existsSync(wavPath)) {
      console.error(`${C.red}  ✗ Missing: ${wavPath}${C.reset}`);
      missing++;
    }
  }
  if (missing > 0) {
    console.error(`\n  Generate audio first: npm run test:audio:generate\n`);
    process.exit(1);
  }
  console.log(`${C.green}  ✓ ${AUDIO_TRANSCRIPT_KEYS.length} audio files found${C.reset}\n`);
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

// ─── Run Single Audio Test ───────────────────────────────────

async function runAudioTest(
  key: string,
  transcript: TestTranscript,
  auth: AuthSession,
  index: number,
  total: number,
): Promise<AudioTestResult> {
  const label = `[${index + 1}/${total}] ${transcript.label}`;
  const e2eStart = Date.now();

  const baseResult = {
    id: transcript.id,
    label: transcript.label,
    frameworkId: transcript.frameworkId,
    domain: transcript.domain,
  };

  // ═══ PHASE 1: TRANSCRIPTION ═══
  process.stdout.write(`  ${C.dim}${label}${C.reset}\n`);
  process.stdout.write(`    ${C.dim}Transcribing...${C.reset} `);

  let whisperText = '';
  let transcribeLatency = 0;
  let transcriptionScoring: TranscriptionScore;

  try {
    const wavPath = path.join(AUDIO_DIR, `${key}.wav`);
    const audioBuffer = fs.readFileSync(wavPath);
    const blob = new Blob([audioBuffer], { type: 'audio/wav' });

    const formData = new FormData();
    formData.append('audio', blob, `${key}.wav`);
    formData.append('frameworkId', transcript.frameworkId);

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
      return {
        ...baseResult,
        transcription: {
          status: 'error', latencyMs: transcribeLatency, whisperText: '',
          scoring: { wordOverlap: 0, medicalTermAccuracy: 0, sourceWordCount: 0, transcribedWordCount: 0, missingMedTerms: [] },
          error: `HTTP ${res.status}: ${body.slice(0, 200)}`,
        },
        e2eLatencyMs: Date.now() - e2eStart,
        status: 'error',
      };
    }

    const data = await res.json() as Record<string, unknown>;
    if (!data.success) {
      console.log(`${C.red}API error: ${data.error}${C.reset}`);
      return {
        ...baseResult,
        transcription: {
          status: 'error', latencyMs: transcribeLatency, whisperText: '',
          scoring: { wordOverlap: 0, medicalTermAccuracy: 0, sourceWordCount: 0, transcribedWordCount: 0, missingMedTerms: [] },
          error: String(data.error),
        },
        e2eLatencyMs: Date.now() - e2eStart,
        status: 'error',
      };
    }

    whisperText = String(data.transcript || '');
    const medTerms = MEDICAL_TERMS[key] ?? [];
    transcriptionScoring = scoreTranscription(transcript.text, whisperText, medTerms);

    const txPass = transcriptionScoring.wordOverlap >= 70 && transcriptionScoring.medicalTermAccuracy >= 60;
    const txStatus = txPass ? 'pass' : 'fail';
    const overlapColor = transcriptionScoring.wordOverlap >= 80 ? C.green : transcriptionScoring.wordOverlap >= 70 ? C.yellow : C.red;
    const medColor = transcriptionScoring.medicalTermAccuracy >= 80 ? C.green : transcriptionScoring.medicalTermAccuracy >= 60 ? C.yellow : C.red;
    const txIcon = txStatus === 'pass' ? `${C.green}✓${C.reset}` : `${C.red}✗${C.reset}`;

    console.log(`${txIcon} overlap:${overlapColor}${transcriptionScoring.wordOverlap}%${C.reset} medTerms:${medColor}${transcriptionScoring.medicalTermAccuracy}%${C.reset} ${C.dim}${(transcribeLatency / 1000).toFixed(1)}s${C.reset}`);

    if (transcriptionScoring.missingMedTerms.length > 0) {
      console.log(`      ${C.yellow}missed terms: ${transcriptionScoring.missingMedTerms.join(', ')}${C.reset}`);
    }

    // ═══ PHASE 2: NOTE GENERATION (unless --transcribe-only) ═══
    if (TRANSCRIBE_ONLY) {
      return {
        ...baseResult,
        transcription: { status: txStatus, latencyMs: transcribeLatency, scoring: transcriptionScoring, whisperText },
        e2eLatencyMs: Date.now() - e2eStart,
        status: txStatus,
      };
    }

    process.stdout.write(`    ${C.dim}Generating note...${C.reset} `);

    const nStart = Date.now();
    const noteRes = await fetch(`${BASE_URL}/api/generate-note`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': auth.cookies,
      },
      body: JSON.stringify({
        transcript: whisperText,
        frameworkId: transcript.frameworkId,
      }),
      signal: AbortSignal.timeout(NOTE_TIMEOUT_MS),
    });
    const noteLatency = Date.now() - nStart;

    if (!noteRes.ok) {
      const body = await noteRes.text();
      console.log(`${C.red}HTTP ${noteRes.status}${C.reset}`);
      return {
        ...baseResult,
        transcription: { status: txStatus, latencyMs: transcribeLatency, scoring: transcriptionScoring, whisperText },
        noteGeneration: { status: 'error', latencyMs: noteLatency, compositeScore: 0, factRecall: { total: 0, found: 0, score: 0, missed: [] }, hallucinations: { count: 0, found: [] }, auditClean: false, complianceGrade: 'N/A', error: `HTTP ${noteRes.status}: ${body.slice(0, 200)}` },
        e2eLatencyMs: Date.now() - e2eStart,
        status: 'error',
      };
    }

    const rawText = await noteRes.text();
    const contentType = noteRes.headers.get('content-type') ?? '';
    const events = parseResponse(rawText, contentType);

    const errorData = extractError(events);
    if (errorData) {
      console.log(`${C.red}API error${C.reset}`);
      return {
        ...baseResult,
        transcription: { status: txStatus, latencyMs: transcribeLatency, scoring: transcriptionScoring, whisperText },
        noteGeneration: { status: 'error', latencyMs: noteLatency, compositeScore: 0, factRecall: { total: 0, found: 0, score: 0, missed: [] }, hallucinations: { count: 0, found: [] }, auditClean: false, complianceGrade: 'N/A', error: String(errorData.error) },
        e2eLatencyMs: Date.now() - e2eStart,
        status: 'error',
      };
    }

    const result = extractResult(events);
    if (!result || !result.success) {
      console.log(`${C.red}No result${C.reset}`);
      return {
        ...baseResult,
        transcription: { status: txStatus, latencyMs: transcribeLatency, scoring: transcriptionScoring, whisperText },
        noteGeneration: { status: 'error', latencyMs: noteLatency, compositeScore: 0, factRecall: { total: 0, found: 0, score: 0, missed: [] }, hallucinations: { count: 0, found: [] }, auditClean: false, complianceGrade: 'N/A', error: 'No result event in response' },
        e2eLatencyMs: Date.now() - e2eStart,
        status: 'error',
      };
    }

    const clinicalNote = result.clinicalNote as Array<{ title: string; content: string }>;
    const noteText = flattenNote(clinicalNote);

    const factRecall = scoreFactRecall(transcript.expectedFacts, noteText);
    const hallucinations = scoreHallucinations(transcript.shouldNotAppear, noteText);
    const auditClean = result.auditClean !== false;
    const complianceGrade = (result.compliance as Record<string, string>)?.grade ?? 'N/A';
    const generationTime = (result.generationTime as number) ?? (noteLatency / 1000);
    const tokensUsed = (result.tokensUsed as number) ?? 0;

    const scoring = computeComposite(factRecall, hallucinations, auditClean, complianceGrade, generationTime, tokensUsed);

    // Lower threshold for audio tests (Whisper noise degrades recall)
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
        status: noteStatus,
        latencyMs: noteLatency,
        compositeScore: scoring.compositeScore,
        factRecall: { total: factRecall.total, found: factRecall.found, score: factRecall.score, missed: factRecall.missed },
        hallucinations: { count: hallucinations.count, found: hallucinations.found },
        auditClean,
        complianceGrade,
      },
      e2eLatencyMs: Date.now() - e2eStart,
      status: overallStatus,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`${C.red}ERROR: ${msg}${C.reset}`);
    return {
      ...baseResult,
      transcription: {
        status: 'error', latencyMs: transcribeLatency || 0, whisperText,
        scoring: transcriptionScoring! ?? { wordOverlap: 0, medicalTermAccuracy: 0, sourceWordCount: 0, transcribedWordCount: 0, missingMedTerms: [] },
        error: msg,
      },
      e2eLatencyMs: Date.now() - e2eStart,
      status: 'error',
    };
  }
}

// ─── Summary Tables ──────────────────────────────────────────

function printSummary(results: AudioTestResult[]): void {
  // Transcription table
  console.log(`\n${'═'.repeat(85)}`);
  console.log(`${C.bold}${C.cyan}  TRANSCRIPTION RESULTS${C.reset}`);
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
    const overlapColor = tx.scoring.wordOverlap >= 80 ? C.green : tx.scoring.wordOverlap >= 70 ? C.yellow : C.red;
    const medColor = tx.scoring.medicalTermAccuracy >= 80 ? C.green : tx.scoring.medicalTermAccuracy >= 60 ? C.yellow : C.red;
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

  // Note generation table (unless transcribe-only)
  if (!TRANSCRIBE_ONLY) {
    console.log(`\n${'═'.repeat(85)}`);
    console.log(`${C.bold}${C.cyan}  END-TO-END RESULTS (Audio → Transcription → Note)${C.reset}`);
    console.log(`${'═'.repeat(85)}`);

    const noteHeader = [
      '#'.padEnd(3),
      'Test'.padEnd(35),
      'Score'.padEnd(7),
      'Recall'.padEnd(8),
      'Halluc'.padEnd(8),
      'E2E'.padEnd(7),
      'Status'.padEnd(6),
    ].join(' ');
    console.log(`  ${C.dim}${noteHeader}${C.reset}`);
    console.log(`  ${'─'.repeat(74)}`);

    results.forEach((r, i) => {
      const ng = r.noteGeneration;
      if (ng && ng.status !== 'error') {
        const scoreColor = ng.compositeScore >= 85 ? C.green : ng.compositeScore >= 50 ? C.yellow : C.red;
        const statusIcon = r.status === 'pass' ? `${C.green}PASS${C.reset}` : `${C.red}FAIL${C.reset}`;
        const row = [
          String(i + 1).padEnd(3),
          r.label.slice(0, 35).padEnd(35),
          `${scoreColor}${ng.compositeScore}%${C.reset}`.padEnd(7 + scoreColor.length + C.reset.length),
          `${ng.factRecall.score}%`.padEnd(8),
          String(ng.hallucinations.count).padEnd(8),
          `${(r.e2eLatencyMs / 1000).toFixed(1)}s`.padEnd(7),
          statusIcon,
        ].join(' ');
        console.log(`  ${row}`);
      } else {
        const row = [
          String(i + 1).padEnd(3),
          r.label.slice(0, 35).padEnd(35),
          `${C.red}ERR${C.reset}`.padEnd(7 + C.red.length + C.reset.length),
          '-'.padEnd(8),
          '-'.padEnd(8),
          '-'.padEnd(7),
          `${C.red}ERR ${C.reset}`,
        ].join(' ');
        console.log(`  ${row}`);
      }
    });

    console.log(`  ${'─'.repeat(74)}`);

    const scored = results.filter(r => r.noteGeneration && r.noteGeneration.status !== 'error');
    const e2ePassed = results.filter(r => r.status === 'pass').length;
    const avgComposite = scored.length > 0
      ? Math.round(scored.reduce((s, r) => s + (r.noteGeneration?.compositeScore ?? 0), 0) / scored.length)
      : 0;
    const avgRecall = scored.length > 0
      ? Math.round(scored.reduce((s, r) => s + (r.noteGeneration?.factRecall.score ?? 0), 0) / scored.length)
      : 0;
    const totalE2E = results.reduce((s, r) => s + r.e2eLatencyMs, 0) / 1000;

    console.log(`\n  ${C.bold}End-to-end:${C.reset} ${e2ePassed}/${results.length} pass  |  Avg composite: ${avgComposite}%  |  Avg recall: ${avgRecall}%  |  Total: ${totalE2E.toFixed(1)}s`);
  }

  console.log(`\n${'═'.repeat(85)}\n`);
}

// ─── Save Results ────────────────────────────────────────────

function saveResults(results: AudioTestResult[]): string {
  const resultsDir = path.resolve(__dirname, '../../test-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const mode = TRANSCRIBE_ONLY ? 'transcribe' : 'e2e';
  const filename = `audio-test-${mode}-${timestamp}.json`;
  const filepath = path.join(resultsDir, filename);

  const output = {
    timestamp: new Date().toISOString(),
    mode,
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
        error: r.noteGeneration.error,
      } : undefined,
    })),
  };

  fs.writeFileSync(filepath, JSON.stringify(output, null, 2));
  return filepath;
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const modeLabel = TRANSCRIBE_ONLY ? ' (TRANSCRIPTION ONLY)' : '';
  console.log(`\n${C.bold}${C.cyan}╔══════════════════════════════════════════════════╗${C.reset}`);
  console.log(`${C.bold}${C.cyan}║   OmniScribe AI — Audio E2E Test Suite           ║${C.reset}`);
  console.log(`${C.bold}${C.cyan}╚══════════════════════════════════════════════════╝${C.reset}`);
  if (modeLabel) {
    console.log(`${C.yellow}${modeLabel}${C.reset}`);
  }

  console.log(`\n  ${AUDIO_TRANSCRIPT_KEYS.length} audio tests across 3 domains\n`);

  await preflight();
  const auth = await authenticate();

  console.log(`${C.cyan}Running audio tests:${C.reset}\n`);
  const results: AudioTestResult[] = [];

  for (let i = 0; i < AUDIO_TRANSCRIPT_KEYS.length; i++) {
    const key = AUDIO_TRANSCRIPT_KEYS[i];
    const transcript = testTranscripts[key];
    if (!transcript) {
      console.error(`${C.red}  Transcript "${key}" not found${C.reset}`);
      continue;
    }

    const result = await runAudioTest(key, transcript, auth, i, AUDIO_TRANSCRIPT_KEYS.length);
    results.push(result);

    // Delay between tests to avoid rate limits
    if (i < AUDIO_TRANSCRIPT_KEYS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
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
