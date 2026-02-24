/**
 * PHI Field-Level Encryption (AES-256-GCM)
 *
 * Encrypts PII/PHI fields before they're written to the database,
 * decrypts when read. Uses authenticated encryption to detect tampering.
 *
 * Encrypted values are stored as: `enc:v1:<iv>:<authTag>:<ciphertext>` (base64)
 * This prefix lets us detect encrypted vs plaintext values during migration.
 *
 * Requires PHI_ENCRYPTION_KEY env var (64-char hex = 256-bit key).
 * Generate one: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { appLog } from './logger';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;       // GCM recommended IV length
const AUTH_TAG_LENGTH = 16;  // 128-bit auth tag
const PREFIX = 'enc:v1:';

let _key: Buffer | null = null;

function getKey(): Buffer {
  if (_key) return _key;
  const hex = process.env.PHI_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error(
      'PHI_ENCRYPTION_KEY must be a 64-character hex string (256-bit). ' +
      'Generate: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
  _key = Buffer.from(hex, 'hex');
  return _key;
}

/**
 * Encrypt a plaintext string. Returns `enc:v1:<iv>:<tag>:<ciphertext>` (base64).
 * Returns null if input is null/undefined.
 */
export function encryptField(plaintext: string | null | undefined): string | null {
  if (plaintext == null || plaintext === '') return plaintext as string | null;

  // Already encrypted — don't double-encrypt
  if (plaintext.startsWith(PREFIX)) return plaintext;

  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return PREFIX + [
    iv.toString('base64'),
    tag.toString('base64'),
    encrypted.toString('base64'),
  ].join(':');
}

/**
 * Decrypt an encrypted string. Returns plaintext.
 * If input is not encrypted (no prefix), returns as-is (graceful migration).
 * Returns null if input is null/undefined.
 */
export function decryptField(ciphertext: string | null | undefined): string | null {
  if (ciphertext == null || ciphertext === '') return ciphertext as string | null;

  // Not encrypted — return as-is (supports gradual migration)
  if (!ciphertext.startsWith(PREFIX)) return ciphertext;

  try {
    const key = getKey();
    const parts = ciphertext.slice(PREFIX.length).split(':');
    if (parts.length !== 3) throw new Error('Malformed encrypted field');

    const iv = Buffer.from(parts[0], 'base64');
    const tag = Buffer.from(parts[1], 'base64');
    const data = Buffer.from(parts[2], 'base64');

    const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  } catch (err) {
    appLog('error', 'PHI-Crypto', 'Decryption failed — possible key mismatch or data corruption', {});
    throw new Error('PHI decryption failed. Check PHI_ENCRYPTION_KEY matches the key used to encrypt.');
  }
}

/**
 * Check if PHI encryption is configured. Returns false during dev if key is missing.
 */
export function isEncryptionConfigured(): boolean {
  const hex = process.env.PHI_ENCRYPTION_KEY;
  return !!hex && hex.length === 64;
}

// ─── Patient model PII fields to encrypt ──────────────────
// These fields are NEVER used in WHERE/search clauses.
// firstName, lastName, dateOfBirth, identifier stay unencrypted for search.

export const PATIENT_ENCRYPTED_FIELDS = [
  'phone',
  'phoneSecondary',
  'email',
  'addressLine1',
  'addressLine2',
  'emergencyContactName',
  'emergencyContactPhone',
  'mrn',
] as const;

// Visit model PHI fields to encrypt
export const VISIT_ENCRYPTED_FIELDS = [
  'transcript',
] as const;

type AnyRecord = Record<string, unknown>;

/** Encrypt specified fields in-place on a data object. */
export function encryptFields<T extends AnyRecord>(data: T, fields: readonly string[]): T {
  if (!isEncryptionConfigured()) return data;
  for (const field of fields) {
    if (field in data && typeof data[field] === 'string') {
      (data as AnyRecord)[field] = encryptField(data[field] as string);
    }
  }
  return data;
}

/** Decrypt specified fields in-place on a data object (or array of objects). */
export function decryptFields<T extends AnyRecord>(data: T | T[], fields: readonly string[]): T | T[] {
  if (!isEncryptionConfigured()) return data;

  const items = Array.isArray(data) ? data : [data];
  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    for (const field of fields) {
      if (field in item && typeof item[field] === 'string') {
        (item as AnyRecord)[field] = decryptField(item[field] as string);
      }
    }
  }
  return data;
}
