'use client';

import { useState, useEffect, useCallback, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import TemplateMetadataForm, { type TemplateMetadata } from '@/components/template-builder/TemplateMetadataForm';
import TemplateBuilder from '@/components/TemplateBuilder';
import TemplatePreview from '@/components/template-builder/TemplatePreview';
import { fetchTemplate, updateTemplate, cloneTemplate } from '@/lib/template-client';
import { getDomainLabel, getDomainColor } from '@/lib/frameworks';
import {
  TemplateStructureSchema,
  validateTemplateStructure,
  type TemplateStructure,
  type NoteFormat,
  type Discipline,
} from '@/lib/template-schema';
import type { NoteTemplateDetail } from '@/lib/types';

export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [template, setTemplate] = useState<NoteTemplateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable state
  const [metadata, setMetadata] = useState<TemplateMetadata>({
    name: '',
    description: '',
    domain: '',
    noteFormat: '',
    subtype: '',
    visibility: 'private',
  });
  const [structure, setStructure] = useState<TemplateStructure | null>(null);
  const [dirty, setDirty] = useState(false);

  // Track initial state for dirty detection
  const initialStateRef = useRef<string>('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const t = await fetchTemplate(id);
      setTemplate(t);
      setMetadata({
        name: t.name,
        description: t.description || '',
        domain: t.domain,
        noteFormat: t.noteFormat,
        subtype: t.subtype || '',
        visibility: (t.visibility as 'private' | 'organization') || 'private',
      });
      const parsed = TemplateStructureSchema.safeParse(t.structureJson);
      if (parsed.success) {
        setStructure(parsed.data);
        initialStateRef.current = JSON.stringify({
          name: t.name,
          description: t.description || '',
          visibility: t.visibility || 'private',
          structure: parsed.data,
        });
      } else {
        setError('Template structure is invalid. It may need to be re-created.');
      }
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load template');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Dirty detection
  useEffect(() => {
    if (!template || !structure) return;
    const current = JSON.stringify({
      name: metadata.name,
      description: metadata.description,
      visibility: metadata.visibility,
      structure,
    });
    setDirty(current !== initialStateRef.current);
  }, [metadata, structure, template]);

  // Beforeunload guard
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const isSystem = template?.sourceType === 'system';
  const isOwned = !isSystem; // user templates are always editable by owner (authz enforced server-side)

  const handleMetadataChange = (newMeta: TemplateMetadata) => {
    setMetadata(newMeta);
    // Keep structure in sync
    if (structure && newMeta.noteFormat && newMeta.domain) {
      if (newMeta.noteFormat !== structure.formatType || newMeta.domain !== structure.discipline) {
        setStructure({
          ...structure,
          formatType: newMeta.noteFormat as NoteFormat,
          discipline: newMeta.domain as Discipline,
        });
      }
    }
  };

  const handleSave = async () => {
    if (!structure) return;

    // Validate name
    if (!metadata.name.trim()) {
      setError('Name is required');
      return;
    }

    // Validate structure
    const validation = validateTemplateStructure(structure);
    if (!validation.valid) {
      setError(`Validation failed: ${validation.errors.join('; ')}`);
      return;
    }

    setSaving(true);
    setError('');
    setSaveSuccess(false);
    try {
      const updated = await updateTemplate(id, {
        name: metadata.name.trim(),
        description: metadata.description.trim() || undefined,
        visibility: metadata.visibility,
        structureJson: structure,
      });
      setTemplate(updated);
      initialStateRef.current = JSON.stringify({
        name: metadata.name.trim(),
        description: metadata.description.trim(),
        visibility: metadata.visibility,
        structure,
      });
      setDirty(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleClone = async () => {
    try {
      const cloned = await cloneTemplate(id);
      router.push(`/templates/${cloned.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clone template');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/templates"
            className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            Back to Templates
          </Link>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16 gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0d9488] border-t-transparent" />
              <span className="text-sm text-gray-500">Loading template...</span>
            </div>
          )}

          {/* Error (no template loaded) */}
          {!loading && error && !template && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Template loaded */}
          {!loading && template && (
            <>
              {/* Page header */}
              <div className="flex items-start justify-between mb-6 mt-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: getDomainColor(template.domain) }}
                    >
                      {getDomainLabel(template.domain)}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {template.noteFormat}
                    </span>
                    {isSystem && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                        System
                      </span>
                    )}
                    {template.isArchived && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700">
                        Archived
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">{template.name}</h1>
                  {template.description && (
                    <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                  )}
                </div>

                {/* Dirty indicator + Clone button */}
                <div className="flex items-center gap-2">
                  {dirty && (
                    <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg font-medium">
                      Unsaved changes
                    </span>
                  )}
                  {saveSuccess && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg font-medium">
                      Saved
                    </span>
                  )}
                  {isSystem && (
                    <button
                      onClick={handleClone}
                      className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Clone to My Templates
                    </button>
                  )}
                </div>
              </div>

              {/* Error banner (inline) */}
              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* System template: read-only preview */}
              {isSystem && structure && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <TemplatePreview structure={structure} />
                </div>
              )}

              {/* User template: editable */}
              {isOwned && structure && !template.isArchived && (
                <>
                  {/* Metadata form */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">Template Details</h2>
                    <TemplateMetadataForm
                      value={metadata}
                      onChange={handleMetadataChange}
                    />
                  </div>

                  {/* Structure builder */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">Template Structure</h2>
                    <TemplateBuilder
                      structure={structure}
                      onChange={setStructure}
                    />
                  </div>

                  {/* Save button */}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving || !dirty}
                      className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </>
              )}

              {/* Archived user template: read-only preview */}
              {isOwned && structure && template.isArchived && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="mb-4 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                    This template is archived. Unarchive it to make edits.
                  </div>
                  <TemplatePreview structure={structure} />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
