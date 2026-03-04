type IdempotencyEntry = {
  startedAt: number;
  status: "in_progress" | "complete";
  result?: unknown;
};

const IDEMPOTENCY_TTL_MS = 10 * 60 * 1000;
const store = new Map<string, IdempotencyEntry>();

function cleanup(now: number): void {
  for (const [key, entry] of store.entries()) {
    if (now - entry.startedAt > IDEMPOTENCY_TTL_MS) {
      store.delete(key);
    }
  }
}

function scopedKey(userId: string, endpoint: string, key: string): string {
  return `${userId}:${endpoint}:${key}`;
}

export function beginIdempotentRequest(
  userId: string,
  endpoint: string,
  key: string,
): { allowed: boolean; inProgress?: boolean; completedResult?: unknown } {
  const now = Date.now();
  cleanup(now);

  const fullKey = scopedKey(userId, endpoint, key);
  const existing = store.get(fullKey);
  if (!existing) {
    store.set(fullKey, { startedAt: now, status: "in_progress" });
    return { allowed: true };
  }

  if (existing.status === "in_progress") {
    return { allowed: false, inProgress: true };
  }

  return { allowed: false, completedResult: existing.result };
}

export function completeIdempotentRequest(
  userId: string,
  endpoint: string,
  key: string,
  result: unknown,
): void {
  const fullKey = scopedKey(userId, endpoint, key);
  store.set(fullKey, {
    startedAt: Date.now(),
    status: "complete",
    result,
  });
}

export function failIdempotentRequest(userId: string, endpoint: string, key: string): void {
  const fullKey = scopedKey(userId, endpoint, key);
  store.delete(fullKey);
}
