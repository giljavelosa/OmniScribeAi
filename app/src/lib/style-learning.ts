/**
 * Style learning module.
 *
 * Tracks clinician editing patterns (section edits, format preferences)
 * to improve future note generation. Stub implementation — all functions
 * are no-ops or return empty results.
 */

// ────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────

export interface StyleFeedbackEvent {
  userId: string;
  visitId: string;
  templateId?: string | null;
  sectionTitle: string;
  eventType?: string;
  previousContent?: string;
  nextContent?: string;
  metadata?: Record<string, unknown>;
}

export interface DeriveEditEventsInput {
  userId: string;
  visitId: string;
  templateId?: string | null;
  previousNoteData: Array<{ title: string; content: string }>;
  nextNoteData: Array<{ title: string; content: string }>;
}

export interface StyleProfile {
  userId: string;
  version: number;
  profileJson: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// ────────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────────

/**
 * Record a single style feedback event.
 * Stub: no-op.
 */
export async function recordStyleFeedbackEvent(
  _event: StyleFeedbackEvent,
): Promise<void> {
  // No-op stub — would persist to clinician_style_events table
}

/**
 * Record multiple style feedback events in a batch.
 * Stub: no-op.
 */
export async function recordStyleFeedbackEventsBatch(
  _events: StyleFeedbackEvent[],
): Promise<void> {
  // No-op stub — would batch-insert to clinician_style_events table
}

/**
 * Compare previous and next note sections and produce
 * StyleFeedbackEvent entries for each changed section.
 */
export function deriveSectionEditEvents(
  input: DeriveEditEventsInput,
): StyleFeedbackEvent[] {
  const events: StyleFeedbackEvent[] = [];

  const previousMap = new Map<string, string>();
  for (const section of input.previousNoteData) {
    previousMap.set(section.title, section.content);
  }

  for (const section of input.nextNoteData) {
    const prev = previousMap.get(section.title);
    if (prev !== undefined && prev !== section.content) {
      events.push({
        userId: input.userId,
        visitId: input.visitId,
        templateId: input.templateId ?? null,
        sectionTitle: section.title,
        previousContent: prev,
        nextContent: section.content,
        metadata: { source: 'visit_patch' },
      });
    }
  }

  return events;
}

/**
 * Get the style profile for a user.
 * Stub: returns null (no profile built yet).
 */
export async function getStyleProfileForUser(
  _userId: string,
): Promise<StyleProfile | null> {
  return null;
}

/**
 * Get recent style feedback events for a user.
 * Stub: returns empty array.
 */
export async function getRecentStyleFeedbackEvents(
  _userId: string,
  _limit?: number,
): Promise<StyleFeedbackEvent[]> {
  return [];
}
