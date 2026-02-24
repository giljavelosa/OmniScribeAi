/**
 * Test Scoring — fact recall, hallucination detection, and composite scoring.
 */

/**
 * Normalize a value for fuzzy matching.
 * Handles common clinical variants like "7/10" vs "7 out of 10".
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // "7 out of 10" → "7/10"
    .replace(/(\d+)\s*out\s*of\s*(\d+)/g, '$1/$2')
    // remove extra whitespace
    .replace(/\s+/g, ' ');
}

/**
 * Check whether a fact appears in the note text.
 * Uses normalized substring matching with common clinical variants.
 */
function factFoundInNote(factValue: string, noteText: string): boolean {
  const normFact = normalize(factValue);
  const normNote = normalize(noteText);

  // Direct substring match
  if (normNote.includes(normFact)) return true;

  // Comma-separated compound facts: "call 988, remove belt, contact parents"
  // Each comma-delimited part must appear somewhere in the note
  if (normFact.includes(', ')) {
    const parts = normFact.split(', ').map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2 && parts.every(part => normNote.includes(part))) return true;
  }

  // "and"-separated compound facts: "swelling and ecchymosis"
  if (normFact.includes(' and ')) {
    const parts = normFact.split(' and ').map(p => p.trim());
    if (parts.every(part => normNote.includes(part))) return true;
  }

  // Numeric variant: "7/10" should match "7 out of 10" and "7/10"
  const numericMatch = normFact.match(/^(\d+)\/(\d+)$/);
  if (numericMatch) {
    const [, num, denom] = numericMatch;
    if (normNote.includes(`${num} out of ${denom}`) || normNote.includes(`${num}/${denom}`)) return true;
  }

  // Reverse: if fact is "7 out of 10" check for "7/10"
  const outOfMatch = normFact.match(/(\d+)\s*out\s*of\s*(\d+)/);
  if (outOfMatch) {
    const [, num, denom] = outOfMatch;
    if (normNote.includes(`${num}/${denom}`)) return true;
  }

  return false;
}

export interface FactRecallResult {
  total: number;
  found: number;
  missed: string[];
  score: number; // 0-100
}

/**
 * Score fact recall: what percentage of expected facts appear in the note.
 */
export function scoreFactRecall(
  expectedFacts: Record<string, string>,
  noteText: string,
): FactRecallResult {
  const total = Object.keys(expectedFacts).length;
  const missed: string[] = [];

  for (const [key, value] of Object.entries(expectedFacts)) {
    if (!factFoundInNote(value, noteText)) {
      missed.push(`${key}: "${value}"`);
    }
  }

  const found = total - missed.length;
  const score = total > 0 ? Math.round((found / total) * 100) : 100;

  return { total, found, missed, score };
}

export interface HallucinationResult {
  count: number;
  found: string[];
}

/**
 * Check for hallucinations: terms that should NOT appear in the note.
 * Uses word-boundary matching for short terms (≤4 chars) to prevent
 * false positives like "ROM" matching inside "from".
 */
export function scoreHallucinations(
  shouldNotAppear: string[],
  noteText: string,
): HallucinationResult {
  const normNote = normalize(noteText);
  const found: string[] = [];

  for (const term of shouldNotAppear) {
    const normTerm = normalize(term);
    if (normTerm.length <= 4) {
      // Word-boundary match for short terms to avoid substring false positives
      const regex = new RegExp(`\\b${normTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
      if (regex.test(normNote)) {
        found.push(term);
      }
    } else {
      if (normNote.includes(normTerm)) {
        found.push(term);
      }
    }
  }

  return { count: found.length, found };
}

/**
 * Map a compliance grade letter to a numeric score (0-100).
 */
function gradeToScore(grade: string): number {
  const map: Record<string, number> = {
    'A': 100, 'A+': 100, 'A-': 90,
    'B': 80, 'B+': 85, 'B-': 75,
    'C': 70, 'C+': 75, 'C-': 65,
    'D': 60, 'D+': 65, 'D-': 55,
    'F': 40,
  };
  return map[grade] ?? 50;
}

export interface CompositeResult {
  factRecall: FactRecallResult;
  hallucinations: HallucinationResult;
  auditClean: boolean;
  complianceGrade: string;
  compositeScore: number; // 0-100
  generationTime: number;
  tokensUsed: number;
}

/**
 * Compute the composite score for a single test.
 *
 * Weights:
 *   40% fact recall
 *   30% hallucination penalty (100 - 20 per hallucination, min 0)
 *   15% audit (100 if clean, 40 if flagged)
 *   15% compliance grade
 */
export function computeComposite(
  factRecall: FactRecallResult,
  hallucinations: HallucinationResult,
  auditClean: boolean,
  complianceGrade: string,
  generationTime: number,
  tokensUsed: number,
): CompositeResult {
  const hallucinationScore = Math.max(0, 100 - hallucinations.count * 20);
  const auditScore = auditClean ? 100 : 40;
  const complianceScore = gradeToScore(complianceGrade);

  const compositeScore = Math.round(
    factRecall.score * 0.40 +
    hallucinationScore * 0.30 +
    auditScore * 0.15 +
    complianceScore * 0.15
  );

  return {
    factRecall,
    hallucinations,
    auditClean,
    complianceGrade,
    compositeScore,
    generationTime,
    tokensUsed,
  };
}

/**
 * Flatten a clinical note (array of {title, content} sections) into plain text.
 */
export function flattenNote(clinicalNote: Array<{ title: string; content: string }>): string {
  return clinicalNote.map(s => `${s.title}\n${s.content}`).join('\n\n');
}
