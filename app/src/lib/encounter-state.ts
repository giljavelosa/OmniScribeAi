/**
 * EncounterState — incremental clinical data accumulator.
 *
 * Built chunk-by-chunk during recording as each audio segment is
 * transcribed (Groq Whisper) and extracted (Grok LLM).
 *
 * Every fact carries an evidence pointer (speaker, timestamp, exact text)
 * so the note generation pipeline can trace every claim back to the source.
 */

// ─── Evidence & Facts ──────────────────────────────────────

export interface EvidencePointer {
  speaker: 'CLINICIAN' | 'PATIENT' | 'UNKNOWN';
  text: string;   // exact words from transcript
  t0: number;     // start time in recording (seconds)
  t1: number;     // end time in recording (seconds)
}

export interface ClinicalFact {
  value: string | null;
  source: 'transcript' | 'not_documented' | 'patient_denies';
  evidence: EvidencePointer | null;
}

// ─── Diarized Transcript ───────────────────────────────────

export interface DiarizedStatement {
  speaker: 'CLINICIAN' | 'PATIENT' | 'UNKNOWN';
  text: string;
  t0: number;
  t1: number;
}

// ─── Chunk Results ─────────────────────────────────────────

export interface WhisperWord {
  word: string;
  start: number;  // absolute seconds from recording start
  end: number;
}

export interface ChunkResult {
  text: string;
  words: WhisperWord[];
  globalStartSec: number;
  duration: number;
  chunkIndex: number;
}

// ─── Extraction Result (from extract-chunk API) ────────────

export interface ExtractionResult {
  statements: DiarizedStatement[];
  facts: Record<string, Record<string, ClinicalFact>>;
  additional_facts: Array<{ label: string; fact: ClinicalFact }>;
}

// ─── EncounterState ────────────────────────────────────────

export interface EncounterState {
  /** Extracted clinical facts organized by section → field */
  sections: Record<string, Record<string, ClinicalFact>>;

  /** Facts that don't map to a specific framework field */
  additional_facts: Array<{ label: string; fact: ClinicalFact }>;

  /** Full diarized transcript (speaker-labeled, timestamped) */
  diarized_transcript: DiarizedStatement[];

  /** Number of chunks processed so far */
  chunk_count: number;

  /** Last update timestamp (Date.now()) */
  last_updated: number;

  /** Last speaker + topic context for next chunk's extraction prompt */
  last_context: {
    lastSpeaker: 'CLINICIAN' | 'PATIENT' | 'UNKNOWN';
    topic: string;
    lastSentence: string;
  };

  /** Number of chunks where extraction failed (truncation, parse error, network) */
  failedExtractions?: number;

  /** Total extraction attempts (successful + failed) */
  totalExtractions?: number;
}

// ─── Silence Stats (from VAD) ──────────────────────────────

export interface SilenceStats {
  totalChunks: number;
  voiceChunks: number;
  silentChunks: number;
  silenceStrippedSec: number;
  originalDurationSec: number;
}

// ─── Factory ───────────────────────────────────────────────

/**
 * Create a fresh EncounterState for a new recording session.
 *
 * @param frameworkId - The note framework (e.g., 'rehab-pt-eval')
 * @param sections - Framework section definitions (from frameworks.ts)
 */
export function createInitialEncounterState(
  sections: Array<{ title: string; items: string[] }>,
): EncounterState {
  const sectionMap: Record<string, Record<string, ClinicalFact>> = {};

  for (const section of sections) {
    const sectionKey = toKey(section.title);
    sectionMap[sectionKey] = {};
    for (const item of section.items) {
      sectionMap[sectionKey][toKey(item)] = {
        value: null,
        source: 'not_documented',
        evidence: null,
      };
    }
  }

  return {
    sections: sectionMap,
    additional_facts: [],
    diarized_transcript: [],
    chunk_count: 0,
    last_updated: Date.now(),
    last_context: {
      lastSpeaker: 'UNKNOWN',
      topic: '',
      lastSentence: '',
    },
  };
}

/**
 * Merge an extraction result into an existing EncounterState.
 * Later values override earlier ones (handles corrections like "pain is 7... actually 8").
 */
export function mergeExtractionResult(
  state: EncounterState,
  result: ExtractionResult,
): EncounterState {
  const newSections = { ...state.sections };

  // Merge facts — only override if the new value is non-null
  for (const [sectionKey, fields] of Object.entries(result.facts)) {
    if (!newSections[sectionKey]) {
      newSections[sectionKey] = {};
    }
    for (const [fieldKey, fact] of Object.entries(fields)) {
      if (fact.value !== null && fact.source !== 'not_documented') {
        newSections[sectionKey] = { ...newSections[sectionKey], [fieldKey]: fact };
      }
    }
  }

  // Append additional facts (dedupe by label)
  const existingLabels = new Set(state.additional_facts.map(af => af.label.toLowerCase()));
  const newAdditional = [...state.additional_facts];
  for (const af of result.additional_facts) {
    if (!existingLabels.has(af.label.toLowerCase())) {
      newAdditional.push(af);
      existingLabels.add(af.label.toLowerCase());
    }
  }

  // Append diarized statements
  const newTranscript = [...state.diarized_transcript, ...result.statements];

  // Update context from the last statement
  const lastStatement = result.statements[result.statements.length - 1];
  const lastContext = lastStatement
    ? {
        lastSpeaker: lastStatement.speaker,
        topic: lastStatement.text.slice(0, 100),
        lastSentence: lastStatement.text.slice(-200),
      }
    : state.last_context;

  return {
    sections: newSections,
    additional_facts: newAdditional,
    diarized_transcript: newTranscript,
    chunk_count: state.chunk_count + 1,
    last_updated: Date.now(),
    last_context: lastContext,
  };
}

/**
 * Format the diarized transcript for display (markdown with speaker labels).
 */
export function formatDiarizedTranscript(state: EncounterState): string {
  if (state.diarized_transcript.length === 0) return '';

  const lines: string[] = [];
  let lastSpeaker: string | null = null;
  let lastEndTime = 0;

  for (const stmt of state.diarized_transcript) {
    // Insert silence marker for gaps >= 5 seconds
    if (lastEndTime > 0 && stmt.t0 - lastEndTime >= 5) {
      const fmtStart = formatTimestamp(lastEndTime);
      const fmtEnd = formatTimestamp(stmt.t0);
      lines.push(`_[silence — ${fmtStart} to ${fmtEnd}]_\n`);
    }

    // Speaker label on speaker change
    if (stmt.speaker !== lastSpeaker) {
      const label = stmt.speaker === 'CLINICIAN' ? 'Clinician'
        : stmt.speaker === 'PATIENT' ? 'Patient'
        : 'Speaker';
      lines.push(`**${label}:** ${stmt.text}\n`);
    } else {
      lines.push(`${stmt.text}\n`);
    }

    lastSpeaker = stmt.speaker;
    lastEndTime = stmt.t1;
  }

  return lines.join('\n');
}

/**
 * Serialize EncounterState facts to a compact JSON string for the note generation prompt.
 * Excludes not_documented fields to keep the prompt small.
 */
export function serializeFactsForPrompt(state: EncounterState): string {
  const compact: Record<string, Record<string, { value: string; source: string; speaker?: string }>> = {};

  for (const [sectionKey, fields] of Object.entries(state.sections)) {
    const sectionFacts: Record<string, { value: string; source: string; speaker?: string }> = {};
    let hasDocumented = false;

    for (const [fieldKey, fact] of Object.entries(fields)) {
      if (fact.value !== null && fact.source !== 'not_documented') {
        sectionFacts[fieldKey] = {
          value: fact.value,
          source: fact.source,
          ...(fact.evidence?.speaker ? { speaker: fact.evidence.speaker } : {}),
        };
        hasDocumented = true;
      }
    }

    if (hasDocumented) {
      compact[sectionKey] = sectionFacts;
    }
  }

  // Include additional facts
  if (state.additional_facts.length > 0) {
    const af: Record<string, { value: string; source: string }> = {};
    for (const item of state.additional_facts) {
      if (item.fact.value) {
        af[item.label] = { value: item.fact.value, source: item.fact.source };
      }
    }
    if (Object.keys(af).length > 0) {
      compact['additional_findings'] = af;
    }
  }

  return JSON.stringify(compact, null, 1);
}

/**
 * Format diarized transcript for inclusion in note generation prompt.
 * Compact format: [C] / [P] speaker labels, no timestamps (saves tokens).
 * Capped at 6000 chars to leave room for facts + system prompt.
 */
export function formatTranscriptForNoteGeneration(state: EncounterState): string {
  if (state.diarized_transcript.length === 0) return '';
  const lines: string[] = [];
  let lastSpeaker: string | null = null;
  for (const stmt of state.diarized_transcript) {
    if (stmt.speaker !== lastSpeaker) {
      const label = stmt.speaker === 'CLINICIAN' ? 'C' : stmt.speaker === 'PATIENT' ? 'P' : '?';
      lines.push(`[${label}] ${stmt.text}`);
    } else {
      lines.push(stmt.text);
    }
    lastSpeaker = stmt.speaker;
  }
  const full = lines.join('\n');
  return full.length > 6000 ? full.slice(0, 5900) + '\n[... transcript truncated]' : full;
}

// ─── Helpers ───────────────────────────────────────────────

/** Convert a display name to a snake_case key matching the existing generate-note pattern */
function toKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

function formatTimestamp(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
