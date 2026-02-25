// Fetch generate-note via SSE with retry on connection drop
export async function fetchNoteSSE(
  body: Record<string, unknown>,
  onProgress?: (pass: number, total: number, message: string) => void,
  signal?: AbortSignal,
  maxRetries = 2,
  onWarnings?: (warnings: string[], compliance: { score: number; grade: string }) => void,
): Promise<Record<string, unknown>> {
  let lastAttempt = 0;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    if (signal?.aborted) throw new Error('Aborted');
    lastAttempt = attempt;

    try {
      const res = await fetch('/api/generate-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const contentType = res.headers.get('content-type') || '';

      // Mock mode — plain JSON, no streaming
      if (contentType.includes('application/json')) {
        return res.json();
      }

      // SSE stream
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let result: Record<string, unknown> | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          const lines = part.split('\n');
          let eventType = '';
          let data = '';
          for (const line of lines) {
            if (line.startsWith('event: ')) eventType = line.slice(7).trim();
            else if (line.startsWith('data: '))  data = line.slice(6).trim();
          }
          if (!eventType || !data) continue;

          try {
            const parsed = JSON.parse(data);
            if (eventType === 'progress' && onProgress) {
              onProgress(parsed.pass, parsed.total, parsed.message);
            } else if (eventType === 'warnings' && onWarnings) {
              onWarnings(parsed.warnings || [], parsed.compliance || { score: 0, grade: 'F' });
            } else if (eventType === 'result') {
              result = parsed;
            } else if (eventType === 'error') {
              throw new Error(parsed.error || parsed.details || 'Note generation failed');
            }
          } catch (parseErr) {
            // Critical events must parse — rethrow so caller sees the failure
            if (eventType === 'error' || eventType === 'result') throw parseErr;
            if (eventType === 'warnings') {
              console.warn('[SSE] Malformed warnings event — skipping', part.substring(0, 100));
            } else {
              console.warn('[SSE] Malformed event skipped:', part.substring(0, 100));
            }
          }
        }
      }

      if (result) return result;

      // Stream ended with no result — retry if attempts remain
      if (attempt <= maxRetries) {
        console.warn(`[SSE] Stream closed without result (attempt ${attempt}/${maxRetries + 1}), retrying...`);
        if (onProgress) onProgress(0, 6, `Connection dropped — retrying (${attempt}/${maxRetries})...`);
        await new Promise(r => setTimeout(r, 2000 * attempt));
        continue;
      }

      throw new Error(`Note generation stream closed without a result after ${lastAttempt} attempt(s). Please try again.`);

    } catch (err: unknown) {
      if (signal?.aborted) throw new Error('Aborted');
      const msg = err instanceof Error ? err.message : String(err);
      // Retry on network errors but not on explicit API errors
      const isRetryable = !msg.includes('HTTP 4') && !msg.includes('Aborted') && !msg.includes('Unauthorized');
      if (isRetryable && attempt <= maxRetries) {
        console.warn(`[SSE] Attempt ${attempt} failed: ${msg}. Retrying...`);
        if (onProgress) onProgress(0, 6, `Connection error — retrying (${attempt}/${maxRetries})...`);
        await new Promise(r => setTimeout(r, 2000 * attempt));
        continue;
      }
      throw err;
    }
  }

  throw new Error('Note generation failed after all retry attempts.');
}
