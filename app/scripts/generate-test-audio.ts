#!/usr/bin/env tsx
/**
 * Generate WAV audio files from test transcripts using macOS TTS.
 *
 * Short mode (default): 5 short files from test-transcripts.ts (~15-35s each)
 * Long mode (--long):   5 long files from mockTranscripts in mock-data.ts (~3-12 min each)
 *
 * Usage:
 *   npm run test:audio:generate          — short files
 *   npm run test:audio:generate:long     — long files
 *   npx tsx scripts/generate-test-audio.ts [--long]
 *
 * Prerequisites:
 *   - macOS (uses built-in `say` and `afconvert` commands)
 */

import { testTranscripts } from '../src/lib/test-transcripts';
import { mockTranscripts } from '../src/lib/mock-data';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// ─── Config ──────────────────────────────────────────────────

const VOICE = 'Samantha';
const RATE = 180; // words per minute
const AUDIO_DIR = path.resolve(__dirname, '../test-audio');
const LONG_MODE = process.argv.includes('--long');

// Short mode: 5 transcripts from test-transcripts.ts
const SHORT_ENTRIES: { key: string; label: string; text: string }[] = [
  'transcriptA', 'soapNew', 'hp', 'transcriptC', 'psychEval',
].map(k => ({ key: k, label: testTranscripts[k].label, text: testTranscripts[k].text }));

// Long mode: 3 individual dialogues + 2 concatenated stress-tests
const LONG_ENTRIES: { key: string; label: string; text: string }[] = [
  {
    key: 'long-bh-crisis',
    label: 'BH Crisis (long dialogue)',
    text: mockTranscripts['bh-crisis'],
  },
  {
    key: 'long-bh-intake',
    label: 'BH Intake (long dialogue)',
    text: mockTranscripts['bh-intake'],
  },
  {
    key: 'long-med-ed',
    label: 'ED Note (long dialogue)',
    text: mockTranscripts['med-ed'],
  },
  {
    key: 'long-concat-medical',
    label: 'Concatenated Medical (3 encounters)',
    text: [mockTranscripts['med-hp'], mockTranscripts['med-ed'], mockTranscripts['med-soap-new']].join('\n\n'),
  },
  {
    key: 'long-concat-bh',
    label: 'Concatenated BH (3 encounters)',
    text: [mockTranscripts['bh-crisis'], mockTranscripts['bh-psych-eval'], mockTranscripts['bh-intake']].join('\n\n'),
  },
];

// ─── Colors ──────────────────────────────────────────────────

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

// ─── Generate a single WAV file ──────────────────────────────

function generateWav(key: string, label: string, text: string): boolean {
  process.stdout.write(`  ${C.dim}${label}...${C.reset} `);

  const txtFile = path.join(AUDIO_DIR, `${key}.txt`);
  const aiffFile = path.join(AUDIO_DIR, `${key}.aiff`);
  const wavFile = path.join(AUDIO_DIR, `${key}.wav`);

  try {
    fs.writeFileSync(txtFile, text);

    // Generate AIFF via macOS TTS (longer timeout for long files)
    const sayTimeout = LONG_MODE ? 300_000 : 60_000;
    execSync(`say -v ${VOICE} -r ${RATE} -o "${aiffFile}" -f "${txtFile}"`, {
      stdio: 'pipe',
      timeout: sayTimeout,
    });

    // Convert AIFF → 16-bit PCM WAV
    execSync(`afconvert "${aiffFile}" "${wavFile}" -d LEI16 -f WAVE`, {
      stdio: 'pipe',
      timeout: 60_000,
    });

    // Downsample to 16kHz if file exceeds 24MB (Groq limit is 25MB)
    let stats = fs.statSync(wavFile);
    const MAX_SIZE = 24 * 1024 * 1024;
    if (stats.size > MAX_SIZE) {
      const tmpWav = wavFile.replace('.wav', '-tmp.wav');
      fs.renameSync(wavFile, tmpWav);
      execSync(`afconvert "${tmpWav}" "${wavFile}" -d LEI16@16000 -f WAVE -c 1`, {
        stdio: 'pipe',
        timeout: 60_000,
      });
      fs.unlinkSync(tmpWav);
      stats = fs.statSync(wavFile);
    }

    const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
    const wordCount = text.split(/\s+/).length;
    const estDuration = Math.round(wordCount / (RATE / 60));
    const estMin = (estDuration / 60).toFixed(1);

    const sizeColor = stats.size > 20 * 1024 * 1024 ? C.yellow : C.green;
    console.log(`${sizeColor}OK${C.reset} ${sizeMB}MB ~${estMin}min (${wordCount} words)`);

    fs.unlinkSync(txtFile);
    fs.unlinkSync(aiffFile);
    return true;
  } catch (err) {
    console.log(`${C.red}FAILED${C.reset}`);
    console.error(`    ${err instanceof Error ? err.message : String(err)}`);
    for (const f of [txtFile, aiffFile]) {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
    return false;
  }
}

// ─── Main ────────────────────────────────────────────────────

function main() {
  const modeLabel = LONG_MODE ? 'long' : 'short';
  console.log(`\n${C.bold}${C.cyan}Generating ${modeLabel} test audio files${C.reset}\n`);
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

  if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
  }

  const entries = LONG_MODE ? LONG_ENTRIES : SHORT_ENTRIES;
  let generated = 0;

  for (const entry of entries) {
    if (generateWav(entry.key, entry.label, entry.text)) {
      generated++;
    }
  }

  console.log(`\n${C.green}  Generated ${generated}/${entries.length} audio files${C.reset}\n`);

  if (generated < entries.length) {
    process.exit(1);
  }
}

main();
