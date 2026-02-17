// Fetch generate-note via SSE, calling onProgress for each pass and returning final result
export async function fetchNoteSSE(
  body: Record<string, any>,
  onProgress?: (pass: number, total: number, message: string) => void,
  signal?: AbortSignal
): Promise<any> {
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

  // If server returns plain JSON (mock mode), handle directly
  if (contentType.includes('application/json')) {
    return res.json();
  }

  // SSE stream
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let result: any = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Parse SSE events from buffer
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || ''; // keep incomplete chunk

    for (const part of parts) {
      const lines = part.split('\n');
      let eventType = '';
      let data = '';
      for (const line of lines) {
        if (line.startsWith('event: ')) eventType = line.slice(7);
        else if (line.startsWith('data: ')) data = line.slice(6);
      }
      if (!eventType || !data) continue;

      const parsed = JSON.parse(data);
      if (eventType === 'progress' && onProgress) {
        onProgress(parsed.pass, parsed.total, parsed.message);
      } else if (eventType === 'result') {
        result = parsed;
      } else if (eventType === 'error') {
        throw new Error(parsed.error || parsed.details || 'Note generation failed');
      }
    }
  }

  if (!result) throw new Error('No result received from note generation');
  return result;
}
