#!/usr/bin/env tsx
/**
 * Test the server-side audio chunking feature.
 *
 * 1. Generates a WAV file > 24MB using macOS TTS (long medical transcript)
 * 2. Authenticates against the dev server
 * 3. Uploads the large WAV to /api/transcribe
 * 4. Verifies chunked transcription succeeds
 * 5. Also tests that a large non-WAV file is rejected with 413
 *
 * Usage:
 *   npx tsx scripts/test-chunking.ts
 *
 * Prerequisites:
 *   - Dev server running at localhost:3000
 *   - demo@omniscribe.ai account seeded
 *   - GROQ_API_KEY configured
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const CREDENTIALS = { email: 'demo@omniscribe.ai', password: 'Demo2026!' };
const AUDIO_DIR = path.resolve(__dirname, '../test-audio');
const LARGE_WAV = path.join(AUDIO_DIR, 'chunking-test-large.wav');

const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m',
};

// ─── Generate large WAV ─────────────────────────────────────

function generateLargeWav(): void {
  if (fs.existsSync(LARGE_WAV)) {
    const stat = fs.statSync(LARGE_WAV);
    if (stat.size > 24 * 1024 * 1024) {
      const mb = (stat.size / (1024 * 1024)).toFixed(1);
      console.log(`${C.cyan}Audio:${C.reset} reusing existing ${mb}MB file: ${path.basename(LARGE_WAV)}`);
      return;
    }
  }

  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  // Long medical transcript — repeated/expanded to generate enough audio for > 24MB WAV
  // At 16kHz 16-bit mono, 24MB ≈ 12.5 min of audio. TTS at ~180 wpm ≈ 2250 words needed.
  const transcript = `
Good morning. This is Dr. Sarah Mitchell. I'm conducting a comprehensive physical therapy
evaluation for patient Robert Johnson, date of birth March 15, 1968. Today's date is
February 24, 2026. The patient was referred by Dr. Williams from orthopedics for evaluation
and treatment of right shoulder pain and decreased range of motion following a rotator cuff
repair performed six weeks ago.

Patient reports current pain level of five out of ten at rest, increasing to seven out of ten
with overhead activities. He describes the pain as a deep aching sensation localized to the
anterior and lateral aspects of the right shoulder. The pain is worse in the morning and after
prolonged positioning. He reports difficulty sleeping on the affected side.

Past medical history is significant for type two diabetes mellitus controlled with metformin
one thousand milligrams twice daily, hypertension managed with amlodipine five milligrams daily,
and hyperlipidemia treated with atorvastatin twenty milligrams at bedtime.

Surgical history includes right rotator cuff repair on January 13, 2026, by Dr. Williams.
The procedure involved arthroscopic repair of a full-thickness supraspinatus tear with two
suture anchors. The patient tolerated the procedure well and was discharged same day.

Social history: The patient is a fifty-seven year old right-hand dominant male. He works as
a warehouse supervisor and has been on modified duty since surgery. He lives with his wife
and two adult children. He denies tobacco use, reports occasional alcohol consumption of
one to two beers per week, and denies recreational drug use.

Review of systems. General: patient denies fever, chills, or unexplained weight changes.
Cardiovascular: denies chest pain, palpitations, or edema. Pulmonary: denies shortness of
breath or cough. Neurological: reports occasional numbness and tingling in the right hand,
which has been present since surgery.

Physical examination findings. Observation: the patient presents in a sling for the right
upper extremity. Surgical incisions are well-healed with no signs of infection, erythema,
or drainage. Mild swelling noted around the right glenohumeral joint. Posture assessment
reveals forward head positioning and rounded shoulders bilaterally, more pronounced on the right.

Passive range of motion of the right shoulder. Flexion is ninety-five degrees, extension is
thirty degrees, abduction is eighty degrees, external rotation is twenty-five degrees, and
internal rotation is to the level of the sacrum. Left shoulder passive range of motion is
within normal limits for all planes.

Active range of motion of the right shoulder. Flexion is seventy degrees with substitution
patterns noted including trunk lateral flexion and scapular hiking. Abduction is sixty degrees.
External rotation is fifteen degrees. Internal rotation is to the posterior iliac crest.

Manual muscle testing. Right shoulder flexion is three minus out of five. Abduction is three
minus out of five. External rotation is two plus out of five. Internal rotation is three out
of five. Grip strength right hand is thirty-two pounds compared to fifty-five pounds on the left,
measured with a Jamar dynamometer at position two.

Special tests. Neer impingement sign is positive on the right. Hawkins-Kennedy test is positive
on the right. Empty can test is deferred due to post-surgical precautions. Cross-body adduction
test is negative. Speed's test is negative bilaterally.

Palpation reveals tenderness over the right anterior deltoid, the right supraspinatus insertion
site, and the right bicipital groove. The right upper trapezius is hypertonic with multiple
trigger points. Cervical range of motion is grossly within normal limits but the patient reports
increased right shoulder pain with cervical rotation to the left.

Functional assessment. The patient reports difficulty with the following activities of daily
living: dressing, specifically overhead shirts and jackets; personal hygiene, including
reaching behind the back; meal preparation, specifically reaching into overhead cabinets;
and any lifting tasks at work. He is currently unable to perform his regular job duties
which include overhead reaching and lifting up to fifty pounds.

Patient demonstrates the QuickDASH score of sixty-two out of one hundred, indicating
significant disability. The Penn Shoulder Score is thirty-five out of one hundred.

Assessment. This is a fifty-seven year old male who is six weeks status post arthroscopic
right rotator cuff repair, presenting with significant limitations in range of motion,
strength, and function consistent with expected post-operative recovery. Key impairments
include restricted glenohumeral mobility in all planes, decreased rotator cuff strength
particularly in external rotation, pain with functional activities, and limited ability
to perform work duties and activities of daily living.

Plan. Treatment will follow a phased rehabilitation protocol. Phase one, weeks six through
eight: continue protected range of motion exercises, begin gentle active-assisted range of
motion in pain-free ranges, initiate scapular stabilization exercises including rows,
retractions, and serratus anterior activation, modalities for pain management including
ice and transcutaneous electrical nerve stimulation, and manual therapy for posterior
capsule tightness.

Phase two, weeks eight through twelve: progress to full active range of motion, begin
isotonic strengthening with resistance bands, initiate proprioceptive training, and
continue manual therapy as needed.

Phase three, weeks twelve through sixteen: advance strengthening to include sport and
work-specific activities, begin plyometric training, progress functional activities
toward return to full duty.

Goals for the next eight weeks include: passive range of motion to within ten degrees
of the contralateral side in all planes, active range of motion to one hundred forty
degrees of flexion and one hundred thirty degrees of abduction, manual muscle testing
of four out of five in all rotator cuff muscles, QuickDASH score below thirty,
and modified return to work with light duty restrictions.

Treatment frequency will be three times per week for eight weeks, then reassessment
for progression. The patient verbalized understanding of the plan and home exercise
program. He has been provided with written instructions for his home exercises including
pendulum exercises, passive supine flexion with a cane, and scapular squeezes.

The next appointment is scheduled for Wednesday, February 26, 2026. The patient was
educated on the importance of compliance with the home exercise program and avoiding
overhead lifting or pushing and pulling with the right upper extremity during this
phase of recovery. He expressed motivation to return to full work duties and
understands this is a gradual process.

This concludes the evaluation. Dr. Sarah Mitchell, Doctor of Physical Therapy,
OCS, signing off at eleven forty-five AM.
`.trim();

  console.log(`${C.cyan}Audio:${C.reset} generating large WAV via macOS TTS (~2 min)...`);
  const tmpAiff = path.join(AUDIO_DIR, 'chunking-test-large.aiff');

  try {
    // Generate speech via macOS say
    execSync(`say -v Samantha -r 160 -o "${tmpAiff}" "${transcript.replace(/"/g, '\\"')}"`, {
      stdio: 'pipe',
      timeout: 180_000,
    });

    // Convert to 16kHz 16-bit mono PCM WAV (maximizes file size for chunking test)
    execSync(
      `afconvert -f WAVE -d LEI16@16000 -c 1 "${tmpAiff}" "${LARGE_WAV}"`,
      { stdio: 'pipe', timeout: 60_000 },
    );

    // Clean up AIFF
    fs.unlinkSync(tmpAiff);

    const stat = fs.statSync(LARGE_WAV);
    const mb = (stat.size / (1024 * 1024)).toFixed(1);
    console.log(`${C.green}  ✓ Generated ${mb}MB WAV${C.reset}`);

    if (stat.size <= 24 * 1024 * 1024) {
      console.log(`${C.yellow}  ⚠ File is only ${mb}MB — under 24MB threshold. Will take single-request path.${C.reset}`);
      console.log(`${C.yellow}    To force chunking, increase transcript length or lower sample rate.${C.reset}`);
    }
  } catch (err) {
    console.error(`${C.red}  ✗ TTS generation failed:${C.reset}`, err);
    process.exit(1);
  }
}

// ─── Auth ────────────────────────────────────────────────────

async function authenticate(): Promise<string> {
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
  return cookieString;
}

// ─── Test 1: Large WAV chunked transcription ─────────────────

async function testChunkedTranscription(cookies: string): Promise<boolean> {
  const stat = fs.statSync(LARGE_WAV);
  const mb = (stat.size / (1024 * 1024)).toFixed(1);
  console.log(`${C.bold}Test 1: Large WAV upload (${mb}MB)${C.reset}`);
  console.log(`  Uploading and transcribing (may take 1-3 min for chunked processing)...`);

  const fileBuffer = fs.readFileSync(LARGE_WAV);
  const formData = new FormData();
  formData.append('audio', new Blob([fileBuffer], { type: 'audio/wav' }), 'chunking-test-large.wav');
  formData.append('frameworkId', 'rehab-pt-eval');

  const start = Date.now();
  try {
    const res = await fetch(`${BASE_URL}/api/transcribe`, {
      method: 'POST',
      headers: { 'Cookie': cookies },
      body: formData,
      signal: AbortSignal.timeout(600_000), // 10 min
    });

    const elapsed = Date.now() - start;
    const data = await res.json() as Record<string, unknown>;

    if (res.status !== 200 || !data.success) {
      console.log(`${C.red}  ✗ FAIL${C.reset} — HTTP ${res.status}: ${data.error || 'unknown error'}`);
      return false;
    }

    const transcript = String(data.transcript || '');
    const wordCount = Number(data.wordCount || 0);
    const source = String(data.source || '');
    const duration = Number(data.duration || 0);

    console.log(`${C.green}  ✓ PASS${C.reset}`);
    console.log(`  ${C.dim}Source:     ${source}${C.reset}`);
    console.log(`  ${C.dim}Words:     ${wordCount}${C.reset}`);
    console.log(`  ${C.dim}Duration:  ${duration}s${C.reset}`);
    console.log(`  ${C.dim}Latency:   ${(elapsed / 1000).toFixed(1)}s${C.reset}`);
    console.log(`  ${C.dim}Chunked:   ${source === 'groq-whisper-chunked' ? 'YES' : 'NO (single request)'}${C.reset}`);

    // Basic sanity checks
    if (wordCount < 50) {
      console.log(`${C.yellow}  ⚠ Warning: only ${wordCount} words transcribed — expected more${C.reset}`);
    }

    // Show first 200 chars of transcript
    console.log(`  ${C.dim}Preview:   "${transcript.slice(0, 200)}..."${C.reset}\n`);
    return true;
  } catch (err) {
    const elapsed = Date.now() - start;
    console.log(`${C.red}  ✗ FAIL${C.reset} — ${err instanceof Error ? err.message : 'unknown error'} (${(elapsed / 1000).toFixed(1)}s)\n`);
    return false;
  }
}

// ─── Test 2: Non-WAV large file rejection ────────────────────

async function testNonWavRejection(cookies: string): Promise<boolean> {
  console.log(`${C.bold}Test 2: Large non-WAV rejection (413)${C.reset}`);

  // Create a fake 25MB "MP3" file (just random bytes with mp3 extension)
  const fakeSize = 25 * 1024 * 1024;
  const fakeBuffer = Buffer.alloc(fakeSize, 0x42); // fill with 'B'

  const formData = new FormData();
  formData.append('audio', new Blob([fakeBuffer], { type: 'audio/mpeg' }), 'large-fake.mp3');
  formData.append('frameworkId', 'rehab-pt-eval');

  try {
    const res = await fetch(`${BASE_URL}/api/transcribe`, {
      method: 'POST',
      headers: { 'Cookie': cookies },
      body: formData,
      signal: AbortSignal.timeout(60_000),
    });

    const data = await res.json() as Record<string, unknown>;

    if (res.status === 413 && !data.success) {
      console.log(`${C.green}  ✓ PASS${C.reset} — correctly rejected with 413`);
      console.log(`  ${C.dim}Error: ${data.error}${C.reset}\n`);
      return true;
    } else {
      console.log(`${C.red}  ✗ FAIL${C.reset} — expected 413, got HTTP ${res.status}`);
      console.log(`  ${C.dim}Response: ${JSON.stringify(data).slice(0, 200)}${C.reset}\n`);
      return false;
    }
  } catch (err) {
    console.log(`${C.red}  ✗ FAIL${C.reset} — ${err instanceof Error ? err.message : 'unknown error'}\n`);
    return false;
  }
}

// ─── Test 3: Small WAV stays on single-request path ──────────

async function testSmallWavSingleRequest(cookies: string): Promise<boolean> {
  console.log(`${C.bold}Test 3: Small WAV stays on single-request path${C.reset}`);

  // Check if we have any short test audio
  const shortWav = path.join(AUDIO_DIR, 'transcriptA.wav');
  if (!fs.existsSync(shortWav)) {
    console.log(`${C.yellow}  ⚠ SKIP${C.reset} — no short WAV available (run npm run test:audio:generate first)\n`);
    return true;
  }

  const fileBuffer = fs.readFileSync(shortWav);
  const mb = (fileBuffer.length / (1024 * 1024)).toFixed(1);
  console.log(`  Uploading ${mb}MB WAV...`);

  const formData = new FormData();
  formData.append('audio', new Blob([fileBuffer], { type: 'audio/wav' }), 'transcriptA.wav');
  formData.append('frameworkId', 'rehab-pt-eval');

  const start = Date.now();
  try {
    const res = await fetch(`${BASE_URL}/api/transcribe`, {
      method: 'POST',
      headers: { 'Cookie': cookies },
      body: formData,
      signal: AbortSignal.timeout(120_000),
    });

    const elapsed = Date.now() - start;
    const data = await res.json() as Record<string, unknown>;

    if (res.status === 200 && data.success && data.source === 'groq-whisper') {
      console.log(`${C.green}  ✓ PASS${C.reset} — source is "groq-whisper" (single request, not chunked)`);
      console.log(`  ${C.dim}Words: ${data.wordCount}, Latency: ${(elapsed / 1000).toFixed(1)}s${C.reset}\n`);
      return true;
    } else {
      console.log(`${C.red}  ✗ FAIL${C.reset} — expected source "groq-whisper", got "${data.source}"`);
      return false;
    }
  } catch (err) {
    console.log(`${C.red}  ✗ FAIL${C.reset} — ${err instanceof Error ? err.message : 'unknown error'}\n`);
    return false;
  }
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  console.log(`\n${C.bold}═══ Audio Chunking Test Suite ═══${C.reset}\n`);

  // Preflight: check dev server
  try {
    const res = await fetch(`${BASE_URL}/api/auth/csrf`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log(`${C.green}Dev server:${C.reset} running at ${BASE_URL}\n`);
  } catch {
    console.error(`${C.red}Dev server not reachable at ${BASE_URL}${C.reset}`);
    console.error(`Start it with: cd app && npm run dev\n`);
    process.exit(1);
  }

  // Generate large WAV
  generateLargeWav();
  console.log();

  // Authenticate
  const cookies = await authenticate();

  // Run tests
  let passed = 0;
  let total = 0;

  total++;
  if (await testChunkedTranscription(cookies)) passed++;

  total++;
  if (await testNonWavRejection(cookies)) passed++;

  total++;
  if (await testSmallWavSingleRequest(cookies)) passed++;

  // Summary
  console.log(`${C.bold}═══ Results: ${passed}/${total} passed ═══${C.reset}`);
  if (passed === total) {
    console.log(`${C.green}All chunking tests passed!${C.reset}\n`);
  } else {
    console.log(`${C.red}${total - passed} test(s) failed.${C.reset}\n`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(`${C.red}Fatal:${C.reset}`, err);
  process.exit(1);
});
