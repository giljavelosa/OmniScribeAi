const SENSITIVE_KEYS = new Set([
  "name",
  "firstname",
  "lastname",
  "fullname",
  "dob",
  "dateofbirth",
  "ssn",
  "mrn",
  "phone",
  "email",
  "address",
  "transcript",
  "note",
  "subjective",
  "objective",
  "assessment",
  "plan",
]);

const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_RE = /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?){2}\d{4}\b/g;
const DOB_RE = /\b(?:19|20)\d{2}[-/](?:0[1-9]|1[0-2])[-/](?:0[1-9]|[12]\d|3[01])\b/g;
const SSN_RE = /\b\d{3}-\d{2}-\d{4}\b/g;

function safeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function redactString(input: string): string {
  const masked = input
    .replace(EMAIL_RE, "[REDACTED_EMAIL]")
    .replace(PHONE_RE, "[REDACTED_PHONE]")
    .replace(DOB_RE, "[REDACTED_DOB]")
    .replace(SSN_RE, "[REDACTED_SSN]");
  return masked.length > 240 ? `${masked.slice(0, 240)}...[TRUNCATED]` : masked;
}

export function redact(value: unknown): unknown {
  if (value == null) return value;

  if (typeof value === "string") return redactString(value);
  if (typeof value === "number" || typeof value === "boolean") return value;

  if (Array.isArray(value)) {
    return value.map((entry) => redact(entry));
  }

  if (typeof value === "object") {
    const input = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};

    for (const [key, nested] of Object.entries(input)) {
      if (SENSITIVE_KEYS.has(safeKey(key))) {
        output[key] = "[REDACTED]";
      } else {
        output[key] = redact(nested);
      }
    }
    return output;
  }

  return "[REDACTED_UNKNOWN]";
}
