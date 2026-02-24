/**
 * Transcription Scoring — word overlap and medical term accuracy metrics.
 *
 * Compares Whisper's transcription output against the known source text
 * to measure how well the audio→text round-trip preserves clinical content.
 */

// Common English stop words to exclude from content word comparison
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over',
  'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'and', 'but', 'or', 'if', 'it',
  'its', 'he', 'she', 'his', 'her', 'they', 'them', 'their', 'this',
  'that', 'these', 'those', 'i', 'me', 'my', 'we', 'us', 'our', 'you',
  'your', 'up', 'about', 'just', 'also',
]);

/**
 * Medical terms per transcript key for accuracy checking.
 * These are terms that TTS + Whisper might garble.
 */
export const MEDICAL_TERMS: Record<string, string[]> = {
  transcriptA: [
    'lumbar', 'flexion', 'straight leg raise', 'ROM', 'ibuprofen',
    'low back pain', '30 degrees', '40 degrees', 'within normal limits',
  ],
  soapNew: [
    'lisinopril', 'hypertension', 'crackles', 'PFTs', 'hemoptysis',
    'oxygen saturation', 'inspiratory', 'shortness of breath', '95%',
  ],
  hp: [
    'arthroplasty', 'osteoarthritis', 'metformin', 'amlodipine',
    'HbA1c', 'creatinine', 'DVT', 'penicillin', 'flexion contracture',
    'pedal pulses', 'NPO',
  ],
  transcriptC: [
    'anxiety', 'PCP', 'suicidal ideation', 'substance use',
    'software engineer', 'difficulty sleeping',
  ],
  psychEval: [
    'PHQ-9', 'anhedonia', 'bupropion', 'insomnia', 'psychotic',
    'depression', 'moderately severe', 'major depressive disorder',
    '150mg', 'homicidal ideation',
  ],
};

export interface TranscriptionScore {
  wordOverlap: number;         // 0-100: % of source content words found
  medicalTermAccuracy: number; // 0-100: % of medical terms found
  sourceWordCount: number;
  transcribedWordCount: number;
  missingMedTerms: string[];
}

/**
 * Tokenize text into lowercase content words (no stop words, no punctuation).
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s/%-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0 && !STOP_WORDS.has(w));
}

/**
 * Score transcription accuracy by comparing Whisper output to source text.
 */
export function scoreTranscription(
  sourceText: string,
  transcribedText: string,
  medicalTerms: string[],
): TranscriptionScore {
  // ── Word overlap ──
  const sourceWords = tokenize(sourceText);
  const transcribedWords = tokenize(transcribedText);
  const transcribedSet = new Set(transcribedWords);

  // Count unique source content words found in transcription
  const sourceUnique = [...new Set(sourceWords)];
  const found = sourceUnique.filter(w => transcribedSet.has(w));
  const wordOverlap = sourceUnique.length > 0
    ? Math.round((found.length / sourceUnique.length) * 100)
    : 100;

  // ── Medical term accuracy ──
  const transcribedLower = transcribedText.toLowerCase();
  const missingMedTerms: string[] = [];

  for (const term of medicalTerms) {
    const termLower = term.toLowerCase();
    if (!transcribedLower.includes(termLower)) {
      missingMedTerms.push(term);
    }
  }

  const medicalTermAccuracy = medicalTerms.length > 0
    ? Math.round(((medicalTerms.length - missingMedTerms.length) / medicalTerms.length) * 100)
    : 100;

  return {
    wordOverlap,
    medicalTermAccuracy,
    sourceWordCount: sourceWords.length,
    transcribedWordCount: transcribedWords.length,
    missingMedTerms,
  };
}
