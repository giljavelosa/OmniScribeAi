import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, getTierForPath } from '../../src/lib/rate-limiter';

describe('rate-limiter', () => {
  // Use unique identifiers per test to avoid cross-test state
  let testId = 0;
  beforeEach(() => { testId++; });

  describe('checkRateLimit', () => {
    it('should allow requests under the limit', () => {
      const id = `user-allow-${testId}`;
      const result = checkRateLimit('api', id);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeLessThan(result.limit);
      expect(result.limit).toBe(120);
    });

    it('should return correct remaining count', () => {
      const id = `user-remaining-${testId}`;
      const r1 = checkRateLimit('api', id);
      const r2 = checkRateLimit('api', id);
      expect(r2.remaining).toBe(r1.remaining - 1);
    });

    it('should block after exceeding limit', () => {
      const id = `user-block-${testId}`;
      // Login tier: 10 requests max
      for (let i = 0; i < 10; i++) {
        const r = checkRateLimit('login', id);
        expect(r.allowed).toBe(true);
      }
      const blocked = checkRateLimit('login', id);
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.resetMs).toBeGreaterThan(0);
    });

    it('should return limit field matching tier config', () => {
      const id = `user-limit-${testId}`;
      expect(checkRateLimit('login', id).limit).toBe(10);
      expect(checkRateLimit('ai', `ai-${id}`).limit).toBe(30);
      expect(checkRateLimit('api', `api-${id}`).limit).toBe(120);
    });

    it('should fall back to api tier for unknown tiers', () => {
      const id = `user-unknown-${testId}`;
      const result = checkRateLimit('nonexistent', id);
      expect(result.limit).toBe(120); // api default
    });

    it('should track identifiers independently', () => {
      const id1 = `user-indep-a-${testId}`;
      const id2 = `user-indep-b-${testId}`;
      checkRateLimit('api', id1);
      checkRateLimit('api', id1);
      const r1 = checkRateLimit('api', id1);
      const r2 = checkRateLimit('api', id2);
      expect(r2.remaining).toBeGreaterThan(r1.remaining);
    });
  });

  describe('getTierForPath', () => {
    it('should return login for auth callback', () => {
      expect(getTierForPath('/api/auth/callback/credentials')).toBe('login');
    });

    it('should return ai for generate-note', () => {
      expect(getTierForPath('/api/generate-note')).toBe('ai');
    });

    it('should return ai for transcribe', () => {
      expect(getTierForPath('/api/transcribe')).toBe('ai');
      expect(getTierForPath('/api/transcribe-chunk')).toBe('ai');
    });

    it('should return ai for extract-chunk', () => {
      expect(getTierForPath('/api/extract-chunk')).toBe('ai');
    });

    it('should return ai for ocr', () => {
      expect(getTierForPath('/api/ocr')).toBe('ai');
    });

    it('should return api for general API routes', () => {
      expect(getTierForPath('/api/visits')).toBe('api');
      expect(getTierForPath('/api/patients')).toBe('api');
      expect(getTierForPath('/api/search')).toBe('api');
      expect(getTierForPath('/api/admin/users')).toBe('api');
    });
  });
});
