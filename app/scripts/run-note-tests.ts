#!/usr/bin/env tsx
/**
 * Automated Note Generation Test Suite
 *
 * Runs 15 gold-standard transcripts through the 2-pass pipeline,
 * scores fact recall + hallucinations, and prints a summary table.
 *
 * Usage:
 *   npm run test:notes          (from app/)  — real AI pipeline
 *   npm run test:notes:mock     (from app/)  — mock mode, structural checks only
 *   npx tsx scripts/run-note-tests.ts [--mock]
 *
 * Prerequisites:
 *   - Dev server running at localhost:3000
 *   - demo@omniscribe.ai account seeded in DB
 */

import { testTranscripts, type TestTranscript } from '../src/lib/test-transcripts';
import { parseResponse, extractResult, extractError } from './lib/sse-parser';
import {
  scoreFactRecall,
  scoreHallucinations,
  computeComposite,
  flattenNote,
  type CompositeResult,
} from './lib/test-scoring';
import * as fs from 'fs';
import * as path from 'path';

// ─── Config ──────────────────────────────────────────────────

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const CREDENTIALS = {
  email: 'demo@omniscribe.ai',
  password: 'Demo2026!',
};
const REQUEST_TIMEOUT_MS = 120_000; // 2 min per request
const MOCK_MODE = process.argv.includes('--mock');

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

interface MockScoring {
  structuralPass: boolean;
  sectionCount: number;
}

interface TestResult {
  id: string;
  label: string;
  frameworkId: string;
  domain: string;
  status: 'pass' | 'fail' | 'error';
  scoring?: CompositeResult;
  mockScoring?: MockScoring;
  error?: string;
}

// ─── Preflight Check ─────────────────────────────────────────

async function preflight(): Promise<void> {
  console.log(`\n${C.cyan}Preflight:${C.reset} checking dev server at ${BASE_URL}...`);

  try {
    const res = await fetch(`${BASE_URL}/api/auth/csrf`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log(`${C.green}  ✓ Dev server is running${C.reset}\n`);
  } catch (err) {
    console.error(`${C.red}  ✗ Dev server not reachable at ${BASE_URL}${C.reset}`);
    console.error(`  Start it with: cd app && npm run dev\n`);
    process.exit(1);
  }
}

// ─── Auth: NextAuth CSRF + Credentials ───────────────────────

interface AuthSession {
  cookies: string;
}

async function authenticate(): Promise<AuthSession> {
  console.log(`${C.cyan}Auth:${C.reset} logging in as ${CREDENTIALS.email}...`);

  // Step 1: Get CSRF token
  const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`);
  const csrfData = await csrfRes.json() as { csrfToken: string };
  const csrfToken = csrfData.csrfToken;

  // Collect cookies from CSRF response
  const csrfCookies = csrfRes.headers.getSetCookie?.() ?? [];

  // Step 2: Sign in with credentials
  const signInRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': csrfCookies.join('; '),
    },
    body: new URLSearchParams({
      csrfToken,
      email: CREDENTIALS.email,
      password: CREDENTIALS.password,
    }).toString(),
    redirect: 'manual', // Don't follow redirects — we need the Set-Cookie headers
  });

  // Collect session cookies
  const signInCookies = signInRes.headers.getSetCookie?.() ?? [];
  const allCookies = [...csrfCookies, ...signInCookies];

  // Extract just the cookie name=value pairs (strip attributes)
  const cookieValues = allCookies
    .map(c => c.split(';')[0])
    .filter(Boolean);

  const cookieString = cookieValues.join('; ');

  // Verify auth worked by checking session
  const sessionRes = await fetch(`${BASE_URL}/api/auth/session`, {
    headers: { 'Cookie': cookieString },
  });
  const sessionData = await sessionRes.json() as Record<string, unknown>;

  if (!sessionData.user) {
    console.error(`${C.red}  ✗ Auth failed — no session user${C.reset}`);
    console.error('  Session response:', JSON.stringify(sessionData));
    process.exit(1);
  }

  console.log(`${C.green}  ✓ Authenticated as ${(sessionData.user as Record<string, string>).email}${C.reset}\n`);
  return { cookies: cookieString };
}

// ─── Mock structural validation ──────────────────────────────

function validateMockStructure(clinicalNote: unknown): MockScoring {
  if (!Array.isArray(clinicalNote) || clinicalNote.length === 0) {
    return { structuralPass: false, sectionCount: 0 };
  }

  for (const section of clinicalNote) {
    if (typeof section !== 'object' || section === null) {
      return { structuralPass: false, sectionCount: clinicalNote.length };
    }
    const s = section as Record<string, unknown>;
    if (typeof s.title !== 'string' || s.title.trim().length === 0) {
      return { structuralPass: false, sectionCount: clinicalNote.length };
    }
    if (typeof s.content !== 'string' || s.content.trim().length === 0) {
      return { structuralPass: false, sectionCount: clinicalNote.length };
    }
  }

  return { structuralPass: true, sectionCount: clinicalNote.length };
}

// ─── Run Single Test ─────────────────────────────────────────

async function runTest(
  transcript: TestTranscript,
  auth: AuthSession,
  index: number,
  total: number,
): Promise<TestResult> {
  const label = `[${index + 1}/${total}] ${transcript.label}`;
  process.stdout.write(`${C.dim}  ${label}...${C.reset} `);

  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const requestBody: Record<string, unknown> = {
      transcript: transcript.text,
      frameworkId: transcript.frameworkId,
    };
    if (MOCK_MODE) {
      requestBody.useMock = true;
    }

    const res = await fetch(`${BASE_URL}/api/generate-note`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': auth.cookies,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const body = await res.text();
      console.log(`${C.red}HTTP ${res.status}${C.reset}`);
      return { id: transcript.id, label: transcript.label, frameworkId: transcript.frameworkId, domain: transcript.domain, status: 'error', error: `HTTP ${res.status}: ${body.slice(0, 200)}` };
    }

    // Parse response — handles both JSON (mock) and SSE (real) via Content-Type detection
    const rawText = await res.text();
    const contentType = res.headers.get('content-type') ?? '';
    const events = parseResponse(rawText, contentType);

    // Check for errors
    const errorData = extractError(events);
    if (errorData) {
      console.log(`${C.red}API error${C.reset}`);
      return { id: transcript.id, label: transcript.label, frameworkId: transcript.frameworkId, domain: transcript.domain, status: 'error', error: String(errorData.error || 'Unknown API error') };
    }

    // Extract result
    const result = extractResult(events);
    if (!result || !result.success) {
      console.log(`${C.red}No result${C.reset}`);
      return { id: transcript.id, label: transcript.label, frameworkId: transcript.frameworkId, domain: transcript.domain, status: 'error', error: 'No result event in SSE stream' };
    }

    const clinicalNote = result.clinicalNote;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    // ─── Mock mode scoring: structural validation only ───
    if (MOCK_MODE) {
      const mockScoring = validateMockStructure(clinicalNote);
      const status = mockScoring.structuralPass ? 'pass' : 'fail';
      const statusIcon = status === 'pass' ? `${C.green}✓${C.reset}` : `${C.red}✗${C.reset}`;
      console.log(`${statusIcon} ${C.green}MOCK${C.reset} sections:${mockScoring.sectionCount} source:${result.source ?? '?'} ${C.dim}${elapsed}s${C.reset}`);

      return { id: transcript.id, label: transcript.label, frameworkId: transcript.frameworkId, domain: transcript.domain, status, mockScoring };
    }

    // ─── Real mode scoring: full fact recall + hallucination check ───
    const noteArray = clinicalNote as Array<{ title: string; content: string }>;
    const noteText = flattenNote(noteArray);

    const factRecall = scoreFactRecall(transcript.expectedFacts, noteText);
    const hallucinations = scoreHallucinations(transcript.shouldNotAppear, noteText);
    const auditClean = result.auditClean !== false;
    const complianceGrade = (result.compliance as Record<string, string>)?.grade ?? 'N/A';
    const generationTime = (result.generationTime as number) ?? ((Date.now() - startTime) / 1000);
    const tokensUsed = (result.tokensUsed as number) ?? 0;

    const scoring = computeComposite(factRecall, hallucinations, auditClean, complianceGrade, generationTime, tokensUsed);

    const passed = scoring.compositeScore >= 60 && hallucinations.count === 0;
    const status = passed ? 'pass' : 'fail';

    // Print inline result
    const scoreColor = scoring.compositeScore >= 85 ? C.green : scoring.compositeScore >= 60 ? C.yellow : C.red;
    const statusIcon = status === 'pass' ? `${C.green}✓${C.reset}` : `${C.red}✗${C.reset}`;
    console.log(`${statusIcon} ${scoreColor}${scoring.compositeScore}%${C.reset} recall:${factRecall.score}% halluc:${hallucinations.count} audit:${auditClean ? 'clean' : 'FLAGGED'} grade:${complianceGrade} ${C.dim}${generationTime.toFixed(1)}s${C.reset}`);

    if (factRecall.missed.length > 0) {
      console.log(`    ${C.yellow}missed: ${factRecall.missed.join(', ')}${C.reset}`);
    }
    if (hallucinations.found.length > 0) {
      console.log(`    ${C.red}hallucinated: ${hallucinations.found.join(', ')}${C.reset}`);
    }

    return { id: transcript.id, label: transcript.label, frameworkId: transcript.frameworkId, domain: transcript.domain, status, scoring };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`${C.red}ERROR: ${msg}${C.reset}`);
    return { id: transcript.id, label: transcript.label, frameworkId: transcript.frameworkId, domain: transcript.domain, status: 'error', error: msg };
  }
}

// ─── Summary Table ───────────────────────────────────────────

function printSummary(results: TestResult[]): void {
  console.log(`\n${'═'.repeat(90)}`);
  const modeLabel = MOCK_MODE ? ' (MOCK MODE — structural checks only)' : '';
  console.log(`${C.bold}${C.cyan}  TEST RESULTS SUMMARY${modeLabel}${C.reset}`);
  console.log(`${'═'.repeat(90)}`);

  if (MOCK_MODE) {
    // Mock summary table
    const header = [
      '#'.padEnd(3),
      'Test'.padEnd(35),
      'Score'.padEnd(7),
      'Sections'.padEnd(10),
      'Status'.padEnd(6),
    ].join(' ');
    console.log(`  ${C.dim}${header}${C.reset}`);
    console.log(`  ${'─'.repeat(62)}`);

    results.forEach((r, i) => {
      if (r.mockScoring) {
        const statusIcon = r.status === 'pass' ? `${C.green}PASS${C.reset}` : `${C.red}FAIL${C.reset}`;
        const row = [
          String(i + 1).padEnd(3),
          r.label.slice(0, 35).padEnd(35),
          `${C.green}MOCK${C.reset}`.padEnd(7 + C.green.length + C.reset.length),
          String(r.mockScoring.sectionCount).padEnd(10),
          statusIcon,
        ].join(' ');
        console.log(`  ${row}`);
      } else {
        const row = [
          String(i + 1).padEnd(3),
          r.label.slice(0, 35).padEnd(35),
          `${C.red} ERR${C.reset}`.padEnd(7 + C.red.length + C.reset.length),
          '-'.padEnd(10),
          `${C.red}ERR ${C.reset}`,
        ].join(' ');
        console.log(`  ${row}`);
      }
    });

    console.log(`  ${'─'.repeat(62)}`);

    const passed = results.filter(r => r.status === 'pass');
    const failed = results.filter(r => r.status === 'fail');
    const errored = results.filter(r => r.status === 'error');

    console.log(`\n  ${C.bold}Totals:${C.reset} ${passed.length} pass, ${failed.length} fail, ${errored.length} error (${results.length} total)`);
    console.log(`\n${'═'.repeat(90)}\n`);
    return;
  }

  // Real mode summary table
  const header = [
    '#'.padEnd(3),
    'Test'.padEnd(35),
    'Score'.padEnd(7),
    'Recall'.padEnd(8),
    'Halluc'.padEnd(8),
    'Audit'.padEnd(8),
    'Grade'.padEnd(7),
    'Time'.padEnd(7),
    'Status'.padEnd(6),
  ].join(' ');
  console.log(`  ${C.dim}${header}${C.reset}`);
  console.log(`  ${'─'.repeat(88)}`);

  // Rows
  results.forEach((r, i) => {
    if (r.scoring) {
      const s = r.scoring;
      const scoreColor = s.compositeScore >= 85 ? C.green : s.compositeScore >= 60 ? C.yellow : C.red;
      const statusIcon = r.status === 'pass' ? `${C.green}PASS${C.reset}` : `${C.red}FAIL${C.reset}`;
      const row = [
        String(i + 1).padEnd(3),
        r.label.slice(0, 35).padEnd(35),
        `${scoreColor}${String(s.compositeScore).padStart(3)}%${C.reset}`.padEnd(7 + scoreColor.length + C.reset.length),
        `${s.factRecall.score}%`.padEnd(8),
        String(s.hallucinations.count).padEnd(8),
        (s.auditClean ? 'clean' : 'FLAG').padEnd(8),
        s.complianceGrade.padEnd(7),
        `${s.generationTime.toFixed(1)}s`.padEnd(7),
        statusIcon,
      ].join(' ');
      console.log(`  ${row}`);
    } else {
      const row = [
        String(i + 1).padEnd(3),
        r.label.slice(0, 35).padEnd(35),
        `${C.red} ERR${C.reset}`.padEnd(7 + C.red.length + C.reset.length),
        '-'.padEnd(8),
        '-'.padEnd(8),
        '-'.padEnd(8),
        '-'.padEnd(7),
        '-'.padEnd(7),
        `${C.red}ERR ${C.reset}`,
      ].join(' ');
      console.log(`  ${row}`);
    }
  });

  console.log(`  ${'─'.repeat(88)}`);

  // Aggregates
  const scored = results.filter(r => r.scoring);
  const passed = results.filter(r => r.status === 'pass');
  const failed = results.filter(r => r.status === 'fail');
  const errored = results.filter(r => r.status === 'error');

  const avgComposite = scored.length > 0
    ? Math.round(scored.reduce((sum, r) => sum + (r.scoring?.compositeScore ?? 0), 0) / scored.length)
    : 0;
  const avgRecall = scored.length > 0
    ? Math.round(scored.reduce((sum, r) => sum + (r.scoring?.factRecall.score ?? 0), 0) / scored.length)
    : 0;
  const totalHalluc = scored.reduce((sum, r) => sum + (r.scoring?.hallucinations.count ?? 0), 0);
  const totalTime = scored.reduce((sum, r) => sum + (r.scoring?.generationTime ?? 0), 0);
  const totalTokens = scored.reduce((sum, r) => sum + (r.scoring?.tokensUsed ?? 0), 0);

  console.log(`\n  ${C.bold}Totals:${C.reset} ${passed.length} pass, ${failed.length} fail, ${errored.length} error (${results.length} total)`);
  console.log(`  ${C.bold}Avg composite:${C.reset} ${avgComposite}%  |  ${C.bold}Avg recall:${C.reset} ${avgRecall}%  |  ${C.bold}Total hallucinations:${C.reset} ${totalHalluc}`);
  console.log(`  ${C.bold}Total time:${C.reset} ${totalTime.toFixed(1)}s  |  ${C.bold}Total tokens:${C.reset} ${totalTokens.toLocaleString()}`);

  // Domain breakdown
  const domains = ['rehab', 'medical', 'bh'] as const;
  for (const domain of domains) {
    const domainResults = scored.filter(r => r.domain === domain);
    if (domainResults.length === 0) continue;
    const domainAvg = Math.round(domainResults.reduce((s, r) => s + (r.scoring?.compositeScore ?? 0), 0) / domainResults.length);
    const domainRecall = Math.round(domainResults.reduce((s, r) => s + (r.scoring?.factRecall.score ?? 0), 0) / domainResults.length);
    console.log(`  ${C.dim}${domain.toUpperCase().padEnd(8)}${C.reset} composite:${domainAvg}%  recall:${domainRecall}%  (${domainResults.length} tests)`);
  }

  console.log(`\n${'═'.repeat(90)}\n`);
}

// ─── Save Results ────────────────────────────────────────────

function saveResults(results: TestResult[]): string {
  const resultsDir = path.resolve(__dirname, '../../test-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const modeTag = MOCK_MODE ? 'mock' : 'real';
  const filename = `note-test-${modeTag}-${timestamp}.json`;
  const filepath = path.join(resultsDir, filename);

  const scored = results.filter(r => r.scoring);
  const output = {
    timestamp: new Date().toISOString(),
    mode: modeTag as 'mock' | 'real',
    totalTests: results.length,
    passed: results.filter(r => r.status === 'pass').length,
    failed: results.filter(r => r.status === 'fail').length,
    errored: results.filter(r => r.status === 'error').length,
    ...(MOCK_MODE ? {} : {
      avgComposite: scored.length > 0
        ? Math.round(scored.reduce((s, r) => s + (r.scoring?.compositeScore ?? 0), 0) / scored.length)
        : 0,
      avgRecall: scored.length > 0
        ? Math.round(scored.reduce((s, r) => s + (r.scoring?.factRecall.score ?? 0), 0) / scored.length)
        : 0,
      totalHallucinations: scored.reduce((s, r) => s + (r.scoring?.hallucinations.count ?? 0), 0),
    }),
    results: results.map(r => ({
      id: r.id,
      label: r.label,
      frameworkId: r.frameworkId,
      domain: r.domain,
      status: r.status,
      ...(MOCK_MODE
        ? { structuralPass: r.mockScoring?.structuralPass, sectionCount: r.mockScoring?.sectionCount }
        : {
            compositeScore: r.scoring?.compositeScore,
            factRecall: r.scoring?.factRecall,
            hallucinations: r.scoring?.hallucinations,
            auditClean: r.scoring?.auditClean,
            complianceGrade: r.scoring?.complianceGrade,
            generationTime: r.scoring?.generationTime,
            tokensUsed: r.scoring?.tokensUsed,
          }
      ),
      error: r.error,
    })),
  };

  fs.writeFileSync(filepath, JSON.stringify(output, null, 2));
  return filepath;
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const modeTag = MOCK_MODE ? ' (MOCK MODE — structural checks only)' : '';
  console.log(`\n${C.bold}${C.cyan}╔══════════════════════════════════════════════════╗${C.reset}`);
  console.log(`${C.bold}${C.cyan}║   OmniScribe AI — Note Generation Test Suite     ║${C.reset}`);
  console.log(`${C.bold}${C.cyan}╚══════════════════════════════════════════════════╝${C.reset}`);
  if (modeTag) {
    console.log(`${C.yellow}${modeTag}${C.reset}`);
  }

  const transcriptList = Object.values(testTranscripts);
  console.log(`\n  ${transcriptList.length} transcripts across 3 domains\n`);

  // Preflight
  await preflight();

  // Auth
  const auth = await authenticate();

  // Run tests sequentially (avoid rate limits)
  console.log(`${C.cyan}Running tests:${C.reset}\n`);
  const results: TestResult[] = [];

  for (let i = 0; i < transcriptList.length; i++) {
    const result = await runTest(transcriptList[i], auth, i, transcriptList.length);
    results.push(result);

    // Small delay between requests (shorter for mock)
    if (i < transcriptList.length - 1) {
      await new Promise(resolve => setTimeout(resolve, MOCK_MODE ? 100 : 1000));
    }
  }

  // Summary
  printSummary(results);

  // Save results
  const filepath = saveResults(results);
  console.log(`${C.dim}Results saved to: ${filepath}${C.reset}\n`);

  // Exit code: non-zero if any failures
  const failures = results.filter(r => r.status !== 'pass').length;
  if (failures > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(`${C.red}Fatal error:${C.reset}`, err);
  process.exit(1);
});
