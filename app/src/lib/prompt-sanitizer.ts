/**
 * Prompt Sanitizer — prevents injection via framework data or user input
 * interpolated into LLM prompts.
 *
 * Framework section titles and item names are developer-defined but loaded
 * from data files. This module strips anything that could be interpreted as
 * prompt instructions (e.g., "IGNORE ABOVE", system-level directives).
 */

// Chars allowed in framework section/item names: letters, digits, spaces,
// hyphens, slashes, parens, periods, commas, colons, ampersands, apostrophes.
// Everything else is stripped.
const ALLOWED_CHARS = /[^a-zA-Z0-9 \-\/().,:&'#%+]/g;

// Patterns that could be prompt injection attempts
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/i,
  /system\s*:\s*/i,
  /\bassistant\s*:\s*/i,
  /\buser\s*:\s*/i,
  /```/g,
  /\{%.*%\}/g,       // template injection
  /\{\{.*\}\}/g,     // template injection
  /<\/?[a-z]/gi,     // HTML tags
];

/**
 * Sanitize a string before interpolating it into an LLM prompt.
 * Strips dangerous characters and injection patterns.
 */
export function sanitizeForPrompt(input: string): string {
  let safe = input.replace(ALLOWED_CHARS, '');

  // Remove injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    safe = safe.replace(pattern, '');
  }

  // Collapse whitespace
  safe = safe.replace(/\s+/g, ' ').trim();

  // Max length guard (framework names should never be this long)
  if (safe.length > 200) {
    safe = safe.slice(0, 200);
  }

  return safe;
}

/**
 * Sanitize a framework section title for prompt interpolation.
 */
export function sanitizeSectionTitle(title: string): string {
  return sanitizeForPrompt(title);
}

/**
 * Sanitize a framework item name for prompt interpolation.
 */
export function sanitizeItemName(item: string): string {
  return sanitizeForPrompt(item);
}

/**
 * Build a safe JSON key from a string (lowercase, alphanumeric + underscore only).
 */
export function safeJsonKey(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}
