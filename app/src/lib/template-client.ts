/**
 * Client-side API helpers for template CRUD operations.
 * Phase 2B — full surface for template management UI.
 */

import type { NoteTemplateSummary, NoteTemplateDetail } from './types';

// ─── Shared error helper ──────────────────────────────────

async function throwOnError(res: Response, fallbackMsg: string): Promise<void> {
  if (res.ok) return;
  const body = await res.json().catch(() => ({ error: fallbackMsg }));
  throw new Error(body.error || `${fallbackMsg} (${res.status})`);
}

// ─── List templates ───────────────────────────────────────

export async function fetchTemplates(params?: {
  domain?: string;
  sourceType?: 'system' | 'user';
  search?: string;
  includeArchived?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{ templates: NoteTemplateSummary[]; total: number }> {
  const qs = new URLSearchParams();
  if (params?.domain) qs.set('domain', params.domain);
  if (params?.sourceType) qs.set('sourceType', params.sourceType);
  if (params?.search) qs.set('search', params.search);
  if (params?.includeArchived) qs.set('includeArchived', 'true');
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.offset) qs.set('offset', String(params.offset));

  const res = await fetch(`/api/templates?${qs.toString()}`);
  await throwOnError(res, 'Failed to fetch templates');
  return res.json();
}

// ─── Fetch single template detail ─────────────────────────

export async function fetchTemplate(id: string): Promise<NoteTemplateDetail> {
  const res = await fetch(`/api/templates/${encodeURIComponent(id)}`);
  await throwOnError(res, 'Failed to fetch template');
  const data = await res.json();
  return data.template;
}

// ─── Create template ──────────────────────────────────────

export async function createTemplate(data: {
  name: string;
  description?: string;
  domain: string;
  noteFormat: string;
  subtype?: string;
  sourceFrameworkId?: string;
  structureJson?: unknown;
  visibility?: 'private' | 'organization';
}): Promise<NoteTemplateDetail> {
  const res = await fetch('/api/templates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await throwOnError(res, 'Failed to create template');
  const result = await res.json();
  return result.template;
}

// ─── Update template ──────────────────────────────────────

export async function updateTemplate(
  id: string,
  data: {
    name?: string;
    description?: string;
    noteFormat?: string;
    subtype?: string;
    visibility?: 'private' | 'organization';
    structureJson?: unknown;
  },
): Promise<NoteTemplateDetail> {
  const res = await fetch(`/api/templates/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await throwOnError(res, 'Failed to update template');
  const result = await res.json();
  return result.template;
}

// ─── Archive template ─────────────────────────────────────

export async function archiveTemplate(id: string): Promise<NoteTemplateDetail> {
  const res = await fetch(`/api/templates/${encodeURIComponent(id)}/archive`, {
    method: 'POST',
  });
  await throwOnError(res, 'Failed to archive template');
  const result = await res.json();
  return result.template;
}

// ─── Unarchive template ───────────────────────────────────

export async function unarchiveTemplate(id: string): Promise<NoteTemplateDetail> {
  const res = await fetch(`/api/templates/${encodeURIComponent(id)}/unarchive`, {
    method: 'POST',
  });
  await throwOnError(res, 'Failed to unarchive template');
  const result = await res.json();
  return result.template;
}

// ─── Clone template ───────────────────────────────────────

export async function cloneTemplate(
  id: string,
  name?: string,
): Promise<NoteTemplateDetail> {
  const res = await fetch(`/api/templates/${encodeURIComponent(id)}/clone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  await throwOnError(res, 'Failed to clone template');
  const result = await res.json();
  return result.template;
}

// ─── Legacy aliases (Phase 2A compat) ─────────────────────

export const fetchUserTemplates = (params?: { domain?: string; search?: string }) =>
  fetchTemplates({ ...params, sourceType: 'user' });

export const fetchTemplateDetail = (id: string) => fetchTemplate(id);
