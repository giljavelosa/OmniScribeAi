/**
 * PHI-safe logger with redaction helpers.
 */

type LogLevel = "info" | "warn" | "error";

type JsonLike =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonLike[]
  | { [key: string]: JsonLike };

const SENSITIVE_KEY_PATTERN =
  /(name|firstName|lastName|fullName|dob|dateOfBirth|mrn|phone|email|address|transcript|note|content|text)/i;

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_PATTERN = /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?){2}\d{4}\b/g;
const DOB_PATTERN = /\b(?:19|20)\d{2}[-/](?:0[1-9]|1[0-2])[-/](?:0[1-9]|[12]\d|3[01])\b/g;
const MRN_PATTERN = /\b(?:MRN[:\s#-]*)?[A-Z0-9]{6,}\b/gi;

function redactString(value: string): string {
  return value
    .replace(EMAIL_PATTERN, "[REDACTED_EMAIL]")
    .replace(PHONE_PATTERN, "[REDACTED_PHONE]")
    .replace(DOB_PATTERN, "[REDACTED_DOB]")
    .replace(MRN_PATTERN, (token) => (token.toUpperCase().startsWith("MRN") ? "[REDACTED_MRN]" : token));
}

function redactUnknown(value: JsonLike, keyHint?: string): JsonLike {
  if (value == null) return value;
  if (typeof value === "string") {
    if (keyHint && SENSITIVE_KEY_PATTERN.test(keyHint)) return "[REDACTED]";
    return redactString(value).slice(0, 500);
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map((entry) => redactUnknown(entry));

  const output: Record<string, JsonLike> = {};
  for (const [key, nested] of Object.entries(value)) {
    output[key] = redactUnknown(nested as JsonLike, key);
  }
  return output;
}

export function redact<T extends JsonLike>(value: T): T {
  return redactUnknown(value) as T;
}

export async function sha256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  if (typeof crypto === "undefined" || !crypto.subtle) return "sha256_unavailable";
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function appLog(
  level: LogLevel,
  component: string,
  message: string,
  meta?: Record<string, JsonLike>,
): void {
  const entry = {
    ts: new Date().toISOString(),
    level,
    component,
    message: redactString(message).slice(0, 200),
    ...(meta ? (redact(meta) as Record<string, JsonLike>) : {}),
  };
  console[level](JSON.stringify(entry));
}

export function scrubError(err: unknown): string {
  if (err instanceof Error) {
    return redactString(err.message).slice(0, 200);
  }
  if (typeof err === "string") {
    return redactString(err).slice(0, 200);
  }
  return "Unknown error";
}

export function errorCode(): string {
  return "ERR-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}
