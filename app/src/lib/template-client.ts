/**
 * Client-side API helpers for template CRUD operations.
 * Phase 2A — minimal surface: list user templates + fetch detail.
 */

import type { NoteTemplateSummary, NoteTemplateDetail } from './types';

export async function fetchUserTemplates(params?: {
  domain?: string;
  search?: string;
}): Promise<{ templates: NoteTemplateSummary[]; total: number }> {
  const qs = new URLSearchParams({ sourceType: 'user' });
  if (params?.domain) qs.set('domain', params.domain);
  if (params?.search) qs.set('search', params.search);

  const res = await fetch(`/api/templates?${qs.toString()}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(body.error || `Failed to fetch templates (${res.status})`);
  }
  return res.json();
}

export async function fetchTemplateDetail(id: string): Promise<NoteTemplateDetail> {
  const res = await fetch(`/api/templates/${encodeURIComponent(id)}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(body.error || `Failed to fetch template (${res.status})`);
  }
  const data = await res.json();
  return data.template;
}
