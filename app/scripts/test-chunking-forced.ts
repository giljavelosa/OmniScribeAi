#!/usr/bin/env tsx
/**
 * Force-test the chunking code path by creating a WAV > 24MB.
 *
 * Strategy: Take the 12.8MB TTS WAV and pad it with silence to exceed 24MB,
 * then upload to /api/transcribe and verify source === 'groq-whisper-chunked'.
 *
 * This tests the actual splitWavFile → sequential Groq calls → stitch path.
 */

import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const CREDENTIALS = { email: 'demo@omniscribe.ai', password: 'Demo2026!' };
const AUDIO_DIR = path.resolve(__dirname, '../test-audio');
const SOURCE_WAV = path.join(AUDIO_DIR, 'chunking-test-large.wav');
const PADDED_WAV = path.join(AUDIO_DIR, 'chunking-test-25mb.wav');

const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m',
};

// ─── Create padded WAV ──────────────────────────────────────

function createPaddedWav(): void {
  if (fs.existsSync(PADDED_WAV)) {
    const stat = fs.statSync(PADDED_WAV);
    if (stat.size > 24 * 1024 * 1024) {
      const mb = (stat.size / (1024 * 1024)).toFixed(1);
      console.log(`${C.cyan}Audio:${C.reset} reusing existing ${mb}MB padded WAV`);
      return;
    }
  }

  if (!fs.existsSync(SOURCE_WAV)) {
    console.error(`${C.red}Source WAV not found.${C.reset} Run test-chunking.ts first to generate it.`);
    process.exit(1);
  }

  console.log(`${C.cyan}Audio:${C.reset} creating padded WAV > 24MB...`);

  const source = fs.readFileSync(SOURCE_WAV);
  const view = new DataView(source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength));

  // Parse source WAV to find data chunk
  let offset = 12; // skip RIFF header
  let dataOffset = 0;
  let dataSize = 0;
  let fmtOffset = 0;

  while (offset + 8 <= source.length) {
    const id = String.fromCharCode(source[offset], source[offset+1], source[offset+2], source[offset+3]);
    const size = view.getUint32(offset + 4, true);

    if (id === 'fmt ') fmtOffset = offset;
    if (id === 'data') {
      dataOffset = offset + 8;
      dataSize = size;
      break;
    }
    offset += 8 + size;
    if (size % 2 !== 0) offset++;
  }

  if (!dataOffset) {
    console.error(`${C.red}Could not parse source WAV${C.reset}`);
    process.exit(1);
  }

  // Read format info
  const sampleRate = view.getUint16(fmtOffset + 12 + 12, true); // offset to sampleRate in fmt
  const channels = view.getUint16(fmtOffset + 10, true);
  const bitsPerSample = view.getUint16(fmtOffset + 22, true);
  const blockAlign = channels * (bitsPerSample / 8);

  // We need total file > 24MB. Target: 25MB.
  const targetSize = 25 * 1024 * 1024;
  const targetPcmSize = targetSize - 44; // 44-byte header for clean WAV
  const silenceToAdd = targetPcmSize - dataSize;

  if (silenceToAdd <= 0) {
    console.log(`${C.green}  Source already > 24MB, copying as-is${C.reset}`);
    fs.copyFileSync(SOURCE_WAV, PADDED_WAV);
    return;
  }

  // Build new WAV: 44-byte header + original PCM + silence padding
  const buf = Buffer.alloc(44 + targetPcmSize);

  // RIFF header
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + targetPcmSize, 4);
  buf.write('WAVE', 8);

  // fmt chunk (copy from source)
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  source.copy(buf, 20, fmtOffset + 8, fmtOffset + 8 + 16);

  // data chunk
  buf.write('data', 36);
  buf.writeUInt32LE(targetPcmSize, 40);

  // Copy original PCM data
  source.copy(buf, 44, dataOffset, dataOffset + dataSize);
  // Remaining bytes are already 0 (silence)

  fs.writeFileSync(PADDED_WAV, buf);
  const mb = (buf.length / (1024 * 1024)).toFixed(1);
  console.log(`${C.green}  ✓ Created ${mb}MB padded WAV (${(dataSize / (1024 * 1024)).toFixed(1)}MB speech + ${(silenceToAdd / (1024 * 1024)).toFixed(1)}MB silence)${C.reset}`);
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

// ─── Main ────────────────────────────────────────────────────

async function main() {
  console.log(`\n${C.bold}═══ Forced Chunking Test ═══${C.reset}\n`);

  // Preflight
  try {
    const res = await fetch(`${BASE_URL}/api/auth/csrf`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch {
    console.error(`${C.red}Dev server not reachable at ${BASE_URL}${C.reset}\n`);
    process.exit(1);
  }

  createPaddedWav();
  console.log();

  const cookies = await authenticate();

  // Upload the padded WAV
  const stat = fs.statSync(PADDED_WAV);
  const mb = (stat.size / (1024 * 1024)).toFixed(1);
  console.log(`${C.bold}Uploading ${mb}MB WAV to trigger chunked transcription...${C.reset}`);
  console.log(`  This will split into ~${Math.ceil(stat.size / (20 * 1024 * 1024))} chunks and transcribe each sequentially.`);
  console.log(`  Expected time: 30-90 seconds.\n`);

  const fileBuffer = fs.readFileSync(PADDED_WAV);
  const formData = new FormData();
  formData.append('audio', new Blob([fileBuffer], { type: 'audio/wav' }), 'chunking-test-25mb.wav');
  formData.append('frameworkId', 'rehab-pt-eval');

  const start = Date.now();
  try {
    const res = await fetch(`${BASE_URL}/api/transcribe`, {
      method: 'POST',
      headers: { 'Cookie': cookies },
      body: formData,
      signal: AbortSignal.timeout(600_000),
    });

    const elapsed = Date.now() - start;
    const data = await res.json() as Record<string, unknown>;

    if (res.status !== 200 || !data.success) {
      console.log(`${C.red}✗ FAIL${C.reset} — HTTP ${res.status}: ${data.error || JSON.stringify(data).slice(0, 300)}`);
      process.exit(1);
    }

    const source = String(data.source || '');
    const wordCount = Number(data.wordCount || 0);
    const duration = Number(data.duration || 0);
    const transcript = String(data.transcript || '');

    console.log(`${C.green}✓ PASS${C.reset} — Chunked transcription succeeded!`);
    console.log();
    console.log(`  Source:     ${C.bold}${source}${C.reset}`);
    console.log(`  Words:      ${wordCount}`);
    console.log(`  Duration:   ${duration}s`);
    console.log(`  Latency:    ${(elapsed / 1000).toFixed(1)}s`);
    console.log(`  Chunked:    ${source === 'groq-whisper-chunked' ? `${C.green}YES${C.reset}` : `${C.red}NO${C.reset}`}`);
    console.log();

    if (source !== 'groq-whisper-chunked') {
      console.log(`${C.red}✗ Expected source "groq-whisper-chunked" but got "${source}"${C.reset}`);
      process.exit(1);
    }

    if (wordCount < 50) {
      console.log(`${C.yellow}⚠ Only ${wordCount} words — expected more from the speech portion${C.reset}`);
    }

    console.log(`  Preview: "${transcript.slice(0, 300)}..."\n`);
    console.log(`${C.green}${C.bold}Chunking test passed!${C.reset}\n`);

  } catch (err) {
    const elapsed = Date.now() - start;
    console.log(`${C.red}✗ FAIL${C.reset} — ${err instanceof Error ? err.message : 'unknown error'} (${(elapsed / 1000).toFixed(1)}s)`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(`${C.red}Fatal:${C.reset}`, err);
  process.exit(1);
});
