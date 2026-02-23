/**
 * Multi-Provider AI Abstraction
 *
 * Unified interface for Grok (xAI), Anthropic (Claude), and DeepSeek.
 * Replaces per-route callClaude functions with a single shared utility.
 *
 * Provider is selected via AI_PROVIDER env var: "grok" | "anthropic" | "deepseek"
 * Model can be overridden via AI_MODEL env var.
 *
 * All calls include:
 *  - PHI boundary enforcement (assertPhiApprovedEndpoint)
 *  - 3 retries with exponential backoff on 429/529/overloaded
 *  - 2-minute per-call timeout (AbortController)
 *  - Normalized token usage response
 */

import { assertPhiApprovedEndpoint } from "@/lib/phi-boundaries";
import { appLog } from "@/lib/logger";

export type AIProvider = "grok" | "anthropic" | "deepseek";

export interface AIUsage {
  input_tokens: number;
  output_tokens: number;
}

export interface AIResponse {
  content: string;
  usage: AIUsage;
}

// ── Provider Configuration ──────────────────────────────────────────

interface ProviderConfig {
  endpoint: string;
  defaultModel: string;
  authHeader: (key: string) => Record<string, string>;
}

const PROVIDERS: Record<AIProvider, ProviderConfig> = {
  grok: {
    endpoint: "https://api.x.ai/v1/chat/completions",
    defaultModel: "grok-4-1-fast-non-reasoning",
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
  },
  anthropic: {
    endpoint: "https://api.anthropic.com/v1/messages",
    defaultModel: "claude-sonnet-4-20250514",
    authHeader: (key) => ({
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    }),
  },
  deepseek: {
    endpoint: "https://api.deepseek.com/v1/chat/completions",
    defaultModel: "deepseek-chat",
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
  },
};

function getProvider(): AIProvider {
  const p = (process.env.AI_PROVIDER || "anthropic").toLowerCase();
  if (p === "grok" || p === "anthropic" || p === "deepseek") return p;
  return "anthropic";
}

function getApiKey(provider: AIProvider): string {
  switch (provider) {
    case "grok":
      return process.env.XAI_API_KEY || "";
    case "deepseek":
      return process.env.DEEPSEEK_API_KEY || "";
    case "anthropic":
    default:
      return process.env.ANTHROPIC_API_KEY || "";
  }
}

function getModel(provider: AIProvider): string {
  return process.env.AI_MODEL || PROVIDERS[provider].defaultModel;
}

// ── Normalize usage from different response formats ──────────────────

function normalizeUsage(provider: AIProvider, data: any): AIUsage {
  if (provider === "anthropic") {
    return {
      input_tokens: data.usage?.input_tokens ?? 0,
      output_tokens: data.usage?.output_tokens ?? 0,
    };
  }
  // OpenAI-compatible (Grok, DeepSeek)
  return {
    input_tokens: data.usage?.prompt_tokens ?? 0,
    output_tokens: data.usage?.completion_tokens ?? 0,
  };
}

function extractContent(provider: AIProvider, data: any): string {
  if (provider === "anthropic") {
    return data.content?.[0]?.text || "";
  }
  // OpenAI-compatible
  return data.choices?.[0]?.message?.content || "";
}

// ── Build request body per provider format ───────────────────────────

function buildTextBody(
  provider: AIProvider,
  model: string,
  system: string,
  user: string,
  maxTokens: number,
): Record<string, unknown> {
  if (provider === "anthropic") {
    return {
      model,
      max_tokens: maxTokens,
      temperature: 0,
      system,
      messages: [{ role: "user", content: user }],
    };
  }
  // OpenAI-compatible (Grok, DeepSeek)
  return {
    model,
    max_tokens: maxTokens,
    temperature: 0,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  };
}

function buildVisionBody(
  provider: AIProvider,
  model: string,
  messages: any[],
  maxTokens: number,
): Record<string, unknown> {
  if (provider === "anthropic") {
    return { model, max_tokens: maxTokens, messages };
  }
  // OpenAI-compatible — convert Anthropic vision format to OpenAI format
  const converted = messages.map((msg: any) => {
    if (!Array.isArray(msg.content)) return msg;
    return {
      ...msg,
      content: msg.content.map((part: any) => {
        if (part.type === "image" && part.source?.type === "base64") {
          return {
            type: "image_url",
            image_url: {
              url: `data:${part.source.media_type};base64,${part.source.data}`,
            },
          };
        }
        return part;
      }),
    };
  });
  return { model, max_tokens: maxTokens, messages: converted };
}

// ── Core fetch with retry ───────────────────────────────────────────

async function fetchWithRetry(
  provider: AIProvider,
  config: ProviderConfig,
  body: Record<string, unknown>,
  apiKey: string,
): Promise<AIResponse> {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const callTimeout = setTimeout(() => controller.abort(), 120_000);

    try {
      assertPhiApprovedEndpoint(config.endpoint);

      const response = await fetch(config.endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...config.authHeader(apiKey),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(callTimeout);

      if (response.ok) {
        const data = await response.json();
        return {
          content: extractContent(provider, data),
          usage: normalizeUsage(provider, data),
        };
      }

      const errorText = await response.text();
      const isRetryable =
        response.status === 429 ||
        response.status === 529 ||
        errorText.includes("overloaded");

      if (isRetryable && attempt < maxRetries) {
        const waitSec = attempt * 10;
        appLog("warn", "AIProvider", `${provider} retryable error — retrying`, {
          attempt,
          maxRetries,
          waitSec,
          status: response.status,
        });
        await new Promise((r) => setTimeout(r, waitSec * 1000));
        continue;
      }

      throw new Error(
        `${provider} API error (attempt ${attempt}): HTTP ${response.status} — ${errorText.slice(0, 200)}`,
      );
    } catch (err: unknown) {
      clearTimeout(callTimeout);
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(
          `${provider} API call timed out after 120s (attempt ${attempt})`,
        );
      }
      throw err;
    }
  }

  throw new Error(`${provider} API: max retries exceeded`);
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Send a text prompt to the configured AI provider.
 * Drop-in replacement for the per-route callClaude functions.
 */
export async function callAI(
  system: string,
  user: string,
  maxTokens: number = 4000,
): Promise<AIResponse> {
  const provider = getProvider();
  const config = PROVIDERS[provider];
  const apiKey = getApiKey(provider);
  const model = getModel(provider);
  const body = buildTextBody(provider, model, system, user, maxTokens);
  return fetchWithRetry(provider, config, body, apiKey);
}

/**
 * Send a vision (image) prompt to the configured AI provider.
 * Messages should use Anthropic's image format — automatically converted
 * to OpenAI format for Grok/DeepSeek.
 */
export async function callAIVision(
  messages: any[],
  maxTokens: number = 4096,
): Promise<AIResponse> {
  const provider = getProvider();
  const config = PROVIDERS[provider];
  const apiKey = getApiKey(provider);
  const model = getModel(provider);
  const body = buildVisionBody(provider, model, messages, maxTokens);
  return fetchWithRetry(provider, config, body, apiKey);
}

/** Returns the currently active provider name (for audit logs, UI display). */
export function getActiveProvider(): string {
  const provider = getProvider();
  const model = getModel(provider);
  return `${provider}/${model}`;
}
