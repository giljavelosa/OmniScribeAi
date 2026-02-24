/**
 * SSE Parser — extracts typed events from a Server-Sent Events text stream.
 */

export interface SSEEvent {
  event: string;
  data: Record<string, unknown>;
}

/**
 * Parse raw SSE text into an array of typed events.
 * Handles the `event: <name>\ndata: <json>\n\n` format used by generate-note.
 */
export function parseSSE(raw: string): SSEEvent[] {
  const events: SSEEvent[] = [];
  const blocks = raw.split(/\n\n+/);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    let eventName = 'message';
    let dataLine = '';

    for (const line of trimmed.split('\n')) {
      if (line.startsWith('event: ')) {
        eventName = line.slice(7).trim();
      } else if (line.startsWith('data: ')) {
        dataLine = line.slice(6);
      }
    }

    if (!dataLine) continue;

    try {
      const data = JSON.parse(dataLine);
      events.push({ event: eventName, data });
    } catch {
      // Skip malformed data lines
    }
  }

  return events;
}

/**
 * Extract the "result" event from parsed SSE events.
 * Returns null if no result event was found (e.g. error or validation failure).
 */
export function extractResult(events: SSEEvent[]): Record<string, unknown> | null {
  const resultEvent = events.find(e => e.event === 'result');
  return resultEvent?.data ?? null;
}

/**
 * Extract the "error" event from parsed SSE events.
 */
export function extractError(events: SSEEvent[]): Record<string, unknown> | null {
  const errorEvent = events.find(e => e.event === 'error');
  return errorEvent?.data ?? null;
}
