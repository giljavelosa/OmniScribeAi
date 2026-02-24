#!/usr/bin/env tsx
/**
 * Generate WAV audio files from test transcripts using macOS TTS.
 *
 * Reads 5 selected transcripts and converts them to 16-bit PCM WAV via
 * the macOS `say` command and `afconvert`. Only needs to run once —
 * generated audio files are reused across test runs.
 *
 * Usage:
 *   npm run test:audio:generate     (from app/)
 *   npx tsx scripts/generate-test-audio.ts
 *
 * Prerequisites:
 *   - macOS (uses built-in `say` and `afconvert` commands)
 */

import { testTranscripts } from '../src/lib/test-transcripts';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// ─── Config ──────────────────────────────────────────────────

const VOICE = 'Samantha';
const RATE = 180; // words per minute (slightly slow for medical term clarity)
const AUDIO_DIR = path.resolve(__dirname, '../test-audio');

// 5 transcripts covering all 3 domains
const AUDIO_TRANSCRIPT_KEYS = [
  'transcriptA',   // rehab  — PT Eval
  'soapNew',       // medical — SOAP New Patient
  'hp',            // medical — H&P
  'transcriptC',   // bh — BH Intake
  'psychEval',     // bh — Psych Eval
] as const;

// ─── Colors ──────────────────────────────────────────────────

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
};

// ─── Main ────────────────────────────────────────────────────

function main() {
  console.log(`\n${C.bold}${C.cyan}Generating test audio files${C.reset}\n`);
  console.log(`  Voice: ${VOICE}, Rate: ${RATE} WPM`);
  console.log(`  Output: ${AUDIO_DIR}/\n`);

  // Check macOS
  try {
    execSync('which say', { stdio: 'pipe' });
    execSync('which afconvert', { stdio: 'pipe' });
  } catch {
    console.error(`${C.red}Error: macOS 'say' and 'afconvert' commands required.${C.reset}`);
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
  }

  for (const key of AUDIO_TRANSCRIPT_KEYS) {
    const transcript = testTranscripts[key];
    if (!transcript) {
      console.error(`${C.red}  Transcript key "${key}" not found${C.reset}`);
      continue;
    }

    process.stdout.write(`  ${C.dim}${transcript.label}...${C.reset} `);

    const txtFile = path.join(AUDIO_DIR, `${key}.txt`);
    const aiffFile = path.join(AUDIO_DIR, `${key}.aiff`);
    const wavFile = path.join(AUDIO_DIR, `${key}.wav`);

    try {
      // Write transcript to temp text file (say -f reads from file)
      fs.writeFileSync(txtFile, transcript.text);

      // Generate AIFF via macOS TTS
      execSync(`say -v ${VOICE} -r ${RATE} -o "${aiffFile}" -f "${txtFile}"`, {
        stdio: 'pipe',
        timeout: 60_000,
      });

      // Convert AIFF → 16-bit PCM WAV
      execSync(`afconvert "${aiffFile}" "${wavFile}" -d LEI16 -f WAVE`, {
        stdio: 'pipe',
        timeout: 30_000,
      });

      // Report file size
      const stats = fs.statSync(wavFile);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
      const wordCount = transcript.text.split(/\s+/).length;
      const estDuration = Math.round(wordCount / (RATE / 60));

      console.log(`${C.green}OK${C.reset} ${sizeMB}MB ~${estDuration}s (${wordCount} words)`);

      // Clean up intermediate files
      fs.unlinkSync(txtFile);
      fs.unlinkSync(aiffFile);
    } catch (err) {
      console.log(`${C.red}FAILED${C.reset}`);
      console.error(`    ${err instanceof Error ? err.message : String(err)}`);
      // Clean up on failure
      for (const f of [txtFile, aiffFile]) {
        if (fs.existsSync(f)) fs.unlinkSync(f);
      }
    }
  }

  // Summary
  const wavFiles = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.wav'));
  console.log(`\n${C.green}  Generated ${wavFiles.length}/${AUDIO_TRANSCRIPT_KEYS.length} audio files${C.reset}\n`);

  if (wavFiles.length < AUDIO_TRANSCRIPT_KEYS.length) {
    process.exit(1);
  }
}

main();
