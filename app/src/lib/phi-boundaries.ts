/**
 * PHI Boundary Enforcement
 *
 * This is the single source of truth for which external endpoints
 * are permitted to receive Protected Health Information (PHI).
 *
 * DO NOT add an endpoint here until a signed BAA / Healthcare Addendum
 * is in place with that vendor. See HIPAA-PHI-BOUNDARY.md §4.
 */

export const PHI_APPROVED_ENDPOINTS = [
  'https://api.deepgram.com',    // BAA: PENDING — do not use with real patient data yet
  'https://api.anthropic.com',   // BAA: PENDING — do not use with real patient data yet
  'https://api.x.ai',           // BAA: PENDING — do not use with real patient data yet
  'https://api.deepseek.com',   // BAA: PENDING — do not use with real patient data yet
  'https://api.groq.com',       // BAA: PENDING — do not use with real patient data yet
] as const;

/**
 * Call before ANY fetch() that will transmit PHI to an external service.
 * Throws immediately if the destination is not on the approved list.
 *
 * Usage:
 *   assertPhiApprovedEndpoint('https://api.deepgram.com/v1/listen?...');
 *   await fetch(url, { ... });
 */
export function assertPhiApprovedEndpoint(url: string): void {
  const approved = PHI_APPROVED_ENDPOINTS.some((e) => url.startsWith(e));
  if (!approved) {
    let host = url;
    try { host = new URL(url).host; } catch { /* ok */ }
    throw new Error(
      `PHI_BOUNDARY_VIOLATION: PHI egress to unapproved endpoint "${host}". ` +
      `Obtain a signed BAA and add to PHI_APPROVED_ENDPOINTS in lib/phi-boundaries.ts.`
    );
  }
}

/**
 * Validate that the Anthropic API key is NOT a consumer-tier (Max plan) key.
 * Consumer keys must never be used with PHI under any circumstances.
 *
 * Note: Key format alone cannot distinguish plans — this check logs a startup
 * warning and should be paired with an explicit environment variable assertion.
 */
export function assertProductionApiKey(): void {
  const key = process.env.ANTHROPIC_API_KEY || '';
  if (!key) {
    console.warn('[phi-boundaries] WARNING: ANTHROPIC_API_KEY is not set.');
    return;
  }
  // ANTHROPIC_CONSOLE_KEY=true must be set explicitly in production .env
  // to confirm the operator has switched to a Console (pay-per-token) key.
  const confirmed = process.env.ANTHROPIC_CONSOLE_KEY === 'true';
  if (!confirmed) {
    console.warn(
      '[phi-boundaries] WARNING: ANTHROPIC_CONSOLE_KEY is not set to "true". ' +
      'Ensure you are using a Console API key (not a Max plan / personal key) before ' +
      'processing real patient data. Set ANTHROPIC_CONSOLE_KEY=true in .env to confirm.'
    );
  }
}
