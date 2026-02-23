'use client';

/**
 * PHI-Safe localStorage Wrapper
 *
 * All PHI stored in the browser must go through these functions.
 * Items are automatically expired after PHI_TTL_MS (default 24h).
 * Calling clearAllPhiItems() on logout removes all PHI from the browser.
 *
 * See HIPAA-PHI-BOUNDARY.md §6.2 for the full browser storage policy.
 */

const PHI_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours maximum retention
const PHI_KEY_PREFIX = 'omniscribe-';

interface PhiEntry<T> {
  data: T;
  expiresAt: number;
}

/**
 * Store a PHI item in localStorage with a 24-hour TTL.
 */
export function setPhiItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  const entry: PhiEntry<T> = {
    data: value,
    expiresAt: Date.now() + PHI_TTL_MS,
  };
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Storage quota exceeded or blocked — fail silently (data still in memory)
  }
}

/**
 * Retrieve a PHI item. Returns null if missing, expired, or malformed.
 * Handles both new TTL-envelope format and legacy plain format (backward compat).
 */
export function getPhiItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    // New format: { data, expiresAt }
    if (parsed && typeof parsed === 'object' && 'expiresAt' in parsed && 'data' in parsed) {
      if (Date.now() > parsed.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data as T;
    }

    // Legacy format (no TTL envelope): return as-is, will be upgraded on next write
    return parsed as T;

  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Remove a specific PHI item.
 */
export function removePhiItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

/**
 * Clear ALL PHI from localStorage.
 * Must be called on logout and on session expiry.
 */
export function clearAllPhiItems(): void {
  if (typeof window === 'undefined') return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PHI_KEY_PREFIX)) keysToRemove.push(key);
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}

/**
 * Sweep expired PHI items. Call on app startup to clean up stale data.
 */
export function sweepExpiredPhiItems(): void {
  if (typeof window === 'undefined') return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(PHI_KEY_PREFIX)) continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const entry = JSON.parse(raw);
      if (entry?.expiresAt && Date.now() > entry.expiresAt) {
        keysToRemove.push(key);
      }
    } catch {
      keysToRemove.push(key!);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}
