import { ClinicianStyleEventType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { safeJsonKey, sanitizeForPrompt } from "@/lib/prompt-sanitizer";
import { appLog, scrubError } from "@/lib/logger";

const MAX_SNIPPET_LENGTH = 200;
const MAX_EVENTS_FOR_PROFILE = 300;

export type StyleFeedbackInput = {
  userId: string;
  eventType: ClinicianStyleEventType;
  visitId?: string | null;
  templateId?: string | null;
  sectionKey?: string | null;
  sectionTitle?: string | null;
  snippetBefore?: string | null;
  snippetAfter?: string | null;
  metadata?: Prisma.InputJsonValue | null;
};

type StyleProfileJson = {
  counters: {
    totalEvents: number;
    sectionEdits: number;
    amendments: number;
    regenerateRequests: number;
    acceptedSections: number;
    replacedSections: number;
    charsAdded: number;
    charsRemoved: number;
  };
  sectionPreferences: Record<
    string,
    {
      edits: number;
      accepted: number;
      replaced: number;
      avgDelta: number;
      lastEventAt: string;
    }
  >;
  snippetLexicon: string[];
  updatedFromEventAt: string;
};

type NoteSection = {
  title?: unknown;
  content?: unknown;
};

function sanitizeSnippet(input: string | null | undefined): string | null {
  if (!input || typeof input !== "string") return null;
  const compact = input.replace(/\s+/g, " ").trim();
  if (!compact) return null;
  const bounded = compact.slice(0, MAX_SNIPPET_LENGTH);
  const sanitized = sanitizeForPrompt(bounded);
  return sanitized || null;
}

function normalizeSectionKey(value: string | null | undefined): string | null {
  if (!value) return null;
  const key = safeJsonKey(value);
  return key || null;
}

function extractTopTerms(snippet: string | null): string[] {
  if (!snippet) return [];
  const words = snippet
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 4);
  return Array.from(new Set(words)).slice(0, 4);
}

function makeDefaultProfile(nowIso: string): StyleProfileJson {
  return {
    counters: {
      totalEvents: 0,
      sectionEdits: 0,
      amendments: 0,
      regenerateRequests: 0,
      acceptedSections: 0,
      replacedSections: 0,
      charsAdded: 0,
      charsRemoved: 0,
    },
    sectionPreferences: {},
    snippetLexicon: [],
    updatedFromEventAt: nowIso,
  };
}

function toProfileJson(input: unknown, nowIso: string): StyleProfileJson {
  if (!input || typeof input !== "object") return makeDefaultProfile(nowIso);
  const maybe = input as Partial<StyleProfileJson>;
  return {
    counters: {
      totalEvents: Number(maybe.counters?.totalEvents ?? 0),
      sectionEdits: Number(maybe.counters?.sectionEdits ?? 0),
      amendments: Number(maybe.counters?.amendments ?? 0),
      regenerateRequests: Number(maybe.counters?.regenerateRequests ?? 0),
      acceptedSections: Number(maybe.counters?.acceptedSections ?? 0),
      replacedSections: Number(maybe.counters?.replacedSections ?? 0),
      charsAdded: Number(maybe.counters?.charsAdded ?? 0),
      charsRemoved: Number(maybe.counters?.charsRemoved ?? 0),
    },
    sectionPreferences:
      maybe.sectionPreferences && typeof maybe.sectionPreferences === "object"
        ? maybe.sectionPreferences
        : {},
    snippetLexicon: Array.isArray(maybe.snippetLexicon)
      ? maybe.snippetLexicon.filter((value): value is string => typeof value === "string").slice(0, 50)
      : [],
    updatedFromEventAt:
      typeof maybe.updatedFromEventAt === "string" ? maybe.updatedFromEventAt : nowIso,
  };
}

function classifySectionEdit(before: string | null, after: string | null): "accepted" | "replaced" {
  if (!before && after) return "accepted";
  if (before === after) return "accepted";
  return "replaced";
}

export async function recordStyleFeedbackEvent(input: StyleFeedbackInput): Promise<void> {
  const nowIso = new Date().toISOString();
  const sectionKey = normalizeSectionKey(input.sectionKey);
  const sectionTitle = sanitizeSnippet(input.sectionTitle) ?? input.sectionTitle ?? null;
  const snippetBefore = sanitizeSnippet(input.snippetBefore);
  const snippetAfter = sanitizeSnippet(input.snippetAfter);

  await prisma.clinicianStyleFeedbackEvent.create({
    data: {
      userId: input.userId,
      eventType: input.eventType,
      visitId: input.visitId ?? null,
      templateId: input.templateId ?? null,
      sectionKey,
      sectionTitle,
      snippetBefore,
      snippetAfter,
      metadata: input.metadata ?? undefined,
    },
  });

  const existing = await prisma.clinicianStyleProfile.findUnique({
    where: { userId: input.userId },
    select: { profileJson: true, version: true },
  });

  const profile = toProfileJson(existing?.profileJson, nowIso);
  profile.counters.totalEvents += 1;

  if (input.eventType === ClinicianStyleEventType.section_edit) profile.counters.sectionEdits += 1;
  if (input.eventType === ClinicianStyleEventType.amendment) profile.counters.amendments += 1;
  if (input.eventType === ClinicianStyleEventType.regenerate_request) profile.counters.regenerateRequests += 1;

  const beforeLen = snippetBefore?.length ?? 0;
  const afterLen = snippetAfter?.length ?? 0;
  if (afterLen > beforeLen) profile.counters.charsAdded += afterLen - beforeLen;
  if (beforeLen > afterLen) profile.counters.charsRemoved += beforeLen - afterLen;

  if (sectionKey) {
    const current = profile.sectionPreferences[sectionKey] ?? {
      edits: 0,
      accepted: 0,
      replaced: 0,
      avgDelta: 0,
      lastEventAt: nowIso,
    };

    current.edits += 1;
    const classification = classifySectionEdit(snippetBefore, snippetAfter);
    if (classification === "accepted") {
      current.accepted += 1;
      profile.counters.acceptedSections += 1;
    } else {
      current.replaced += 1;
      profile.counters.replacedSections += 1;
    }

    const delta = afterLen - beforeLen;
    current.avgDelta = Number((((current.avgDelta * (current.edits - 1)) + delta) / current.edits).toFixed(2));
    current.lastEventAt = nowIso;
    profile.sectionPreferences[sectionKey] = current;
  }

  const lexiconSeed = [...extractTopTerms(snippetBefore), ...extractTopTerms(snippetAfter)];
  if (lexiconSeed.length > 0) {
    const mergedLexicon = new Set([...profile.snippetLexicon, ...lexiconSeed]);
    profile.snippetLexicon = Array.from(mergedLexicon).slice(0, 50);
  }

  profile.updatedFromEventAt = nowIso;

  if (!existing) {
    await prisma.clinicianStyleProfile.create({
      data: {
        userId: input.userId,
        profileJson: profile as Prisma.InputJsonValue,
        version: 1,
      },
    });
    return;
  }

  await prisma.clinicianStyleProfile.update({
    where: { userId: input.userId },
    data: {
      profileJson: profile as Prisma.InputJsonValue,
      version: existing.version + 1,
    },
  });
}

export async function getStyleProfileForUser(userId: string) {
  const profile = await prisma.clinicianStyleProfile.findUnique({
    where: { userId },
    select: {
      userId: true,
      profileJson: true,
      version: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!profile) return null;
  return profile;
}

export function deriveSectionEditEvents(args: {
  userId: string;
  visitId: string;
  templateId?: string | null;
  previousNoteData: unknown;
  nextNoteData: unknown;
}): StyleFeedbackInput[] {
  const previousSections = Array.isArray(args.previousNoteData) ? (args.previousNoteData as NoteSection[]) : [];
  const nextSections = Array.isArray(args.nextNoteData) ? (args.nextNoteData as NoteSection[]) : [];

  const previousByTitle = new Map<string, string>();
  for (const section of previousSections) {
    const title = typeof section?.title === "string" ? section.title.trim() : "";
    const content = typeof section?.content === "string" ? section.content : "";
    if (title) previousByTitle.set(title, content);
  }

  const events: StyleFeedbackInput[] = [];
  for (const section of nextSections) {
    const title = typeof section?.title === "string" ? section.title.trim() : "";
    const content = typeof section?.content === "string" ? section.content : "";
    if (!title) continue;

    const previous = previousByTitle.get(title);
    if (previous === undefined || previous === content) continue;

    events.push({
      userId: args.userId,
      visitId: args.visitId,
      templateId: args.templateId ?? null,
      eventType: ClinicianStyleEventType.section_edit,
      sectionKey: title,
      sectionTitle: title,
      snippetBefore: previous,
      snippetAfter: content,
      metadata: {
        deltaChars: content.length - previous.length,
        source: "visit_patch",
      },
    });
  }

  return events.slice(0, 30);
}

export async function recordStyleFeedbackEventsBatch(events: StyleFeedbackInput[]): Promise<void> {
  for (const event of events) {
    try {
      await recordStyleFeedbackEvent(event);
    } catch (error) {
      appLog("warn", "StyleLearning", "Failed to record style learning event", {
        userId: event.userId,
        visitId: event.visitId,
        eventType: event.eventType,
        error: scrubError(error),
      });
    }
  }
}

export async function getRecentStyleFeedbackEvents(userId: string) {
  return prisma.clinicianStyleFeedbackEvent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: MAX_EVENTS_FOR_PROFILE,
    select: {
      id: true,
      eventType: true,
      sectionKey: true,
      sectionTitle: true,
      snippetBefore: true,
      snippetAfter: true,
      metadata: true,
      visitId: true,
      templateId: true,
      createdAt: true,
    },
  });
}

