/**
 * PHI-Safe Application Logger
 *
 * Use this instead of console.* in all API routes that handle PHI.
 *
 * RULES:
 *  - `message` must NEVER contain PHI (no transcript text, patient names, clinical data)
 *  - `meta` must ONLY contain safe primitives: counts, durations, IDs, status codes
 *  - Error messages are scrubbed to 200 chars max before logging
 *
 * See HIPAA-PHI-BOUNDARY.md §5 for the full logging policy.
 */

type LogLevel = 'info' | 'warn' | 'error';

// Only safe, non-PHI scalar types allowed in meta
type SafeMeta = Record<string, string | number | boolean | undefined | null>;

/**
 * Write a structured, PHI-safe log entry.
 *
 * ✅  appLog('info', 'GenNote', 'Pass 1 complete', { transcriptLength: 12847 });
 * ✅  appLog('error', 'Transcribe', 'Deepgram call failed', { status: 429, attempt: 2 });
 * ❌  appLog('info', 'GenNote', transcript);          // PHI in message
 * ❌  appLog('info', 'GenNote', 'Done', { note });    // PHI in meta
 */
export function appLog(
  level: LogLevel,
  component: string,
  message: string,
  meta?: SafeMeta,
): void {
  const entry = {
    ts: new Date().toISOString(),
    level,
    component,
    message,
    ...(meta ?? {}),
  };
  // Use the native console method — output goes to next.log / stdout only
  console[level](JSON.stringify(entry));
}

/**
 * Scrub an error for safe external logging.
 * Strips stack traces and truncates to prevent PHI leakage from error context.
 */
export function scrubError(err: unknown): string {
  if (err instanceof Error) {
    return err.message.slice(0, 200);
  }
  if (typeof err === 'string') {
    return err.slice(0, 200);
  }
  return 'Unknown error';
}

/**
 * Generate a short alphanumeric correlation code.
 * Return this to the client in error responses so engineers can correlate
 * without exposing PHI in the error message.
 *
 * Example: "ERR-A3F7K2"
 */
export function errorCode(): string {
  return 'ERR-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}
