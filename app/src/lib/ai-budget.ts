type UsageEvent = { ts: number; tokens: number };

type BudgetState = {
  calls: number[];
  usage: UsageEvent[];
};

const MAX_CALLS_PER_MINUTE = 10;
const MAX_TOKENS_PER_HOUR = 120_000;
const MAX_TOKENS_PER_DAY = 900_000;

const state = new Map<string, BudgetState>();

function getState(userId: string): BudgetState {
  const existing = state.get(userId);
  if (existing) return existing;
  const next = { calls: [], usage: [] };
  state.set(userId, next);
  return next;
}

function prune(now: number, budget: BudgetState): void {
  budget.calls = budget.calls.filter((ts) => now - ts < 60_000);
  budget.usage = budget.usage.filter((entry) => now - entry.ts < 24 * 60 * 60 * 1000);
}

export function checkAIBudget(userId: string): { allowed: true } | { allowed: false; code: string; error: string } {
  const now = Date.now();
  const budget = getState(userId);
  prune(now, budget);

  if (budget.calls.length >= MAX_CALLS_PER_MINUTE) {
    return {
      allowed: false,
      code: "AI_CALL_RATE_EXCEEDED",
      error: "AI budget exceeded: too many model calls in the last minute.",
    };
  }

  const hourTokens = budget.usage
    .filter((entry) => now - entry.ts < 60 * 60 * 1000)
    .reduce((sum, entry) => sum + entry.tokens, 0);
  if (hourTokens >= MAX_TOKENS_PER_HOUR) {
    return {
      allowed: false,
      code: "AI_TOKEN_HOURLY_EXCEEDED",
      error: "AI budget exceeded: hourly token limit reached.",
    };
  }

  const dayTokens = budget.usage.reduce((sum, entry) => sum + entry.tokens, 0);
  if (dayTokens >= MAX_TOKENS_PER_DAY) {
    return {
      allowed: false,
      code: "AI_TOKEN_DAILY_EXCEEDED",
      error: "AI budget exceeded: daily token limit reached.",
    };
  }

  return { allowed: true };
}

export function recordAICallStart(userId: string): void {
  const now = Date.now();
  const budget = getState(userId);
  prune(now, budget);
  budget.calls.push(now);
}

export function recordAITokenUsage(userId: string, tokens: number): void {
  const now = Date.now();
  const budget = getState(userId);
  prune(now, budget);
  budget.usage.push({ ts: now, tokens: Math.max(0, Math.floor(tokens)) });
}
