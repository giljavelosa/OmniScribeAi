'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ConfirmDialog from '@/components/ConfirmDialog';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import TemplateMetadataForm, { type TemplateMetadata } from '@/components/template-builder/TemplateMetadataForm';
import TemplateBuilder from '@/components/TemplateBuilder';
import { createTemplate } from '@/lib/template-client';
import { frameworks, getDomainLabel, getDomainColor } from '@/lib/frameworks';
import {
  frameworkSectionsToTemplateStructure,
  validateTemplateStructure,
  type TemplateStructure,
  type NoteFormat,
  type Discipline,
} from '@/lib/template-schema';

type Mode = 'choose' | 'scratch' | 'clone';

function makeEmptyStructure(noteFormat: NoteFormat, discipline: Discipline): TemplateStructure {
  return {
    formatType: noteFormat,
    discipline,
    sections: [
      {
        id: `sec-${Date.now()}`,
        key: 'section_1',
        label: 'Section 1',
        order: 0,
        required: true,
        hidden: false,
        items: [
          {
            id: `item-${Date.now()}`,
            key: 'item_1',
            label: 'Item 1',
            order: 0,
            required: false,
            hidden: false,
          },
        ],
      },
    ],
  };
}

export default function NewTemplatePage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('choose');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pendingNav, setPendingNav] = useState<(() => void) | null>(null);
  const savingRef = useRef(false);

  // Metadata form state
  const [metadata, setMetadata] = useState<TemplateMetadata>({
    name: '',
    description: '',
    domain: 'medical',
    noteFormat: 'SOAP',
    subtype: '',
    visibility: 'private',
  });
  const [metaErrors, setMetaErrors] = useState<Partial<Record<keyof TemplateMetadata, string>>>({});

  // Structure state
  const [structure, setStructure] = useState<TemplateStructure>(
    makeEmptyStructure('SOAP', 'medical'),
  );

  // Clone source selection
  const [selectedFrameworkId, setSelectedFrameworkId] = useState('');
  const [cloneDomain, setCloneDomain] = useState('');
  const [cloneSearch, setCloneSearch] = useState('');

  // Dirty detection: user is in editor mode and has entered content
  const isInEditor = mode === 'scratch' || (mode === 'clone' && !!selectedFrameworkId);
  const dirty = isInEditor && (
    metadata.name.trim().length > 0 ||
    metadata.description.trim().length > 0 ||
    structure.sections.length > 1 ||
    (structure.sections.length === 1 && structure.sections[0].items.length > 1)
  );

  // Keep saving ref in sync
  useEffect(() => { savingRef.current = saving; }, [saving]);

  // Beforeunload guard
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const filteredFrameworks = useMemo(() => {
    let result = frameworks;
    if (cloneDomain) result = result.filter((f) => f.domain === cloneDomain);
    if (cloneSearch.length >= 2) {
      const q = cloneSearch.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.subtype.toLowerCase().includes(q),
      );
    }
    return result;
  }, [cloneDomain, cloneSearch]);

  // Keep structure formatType/discipline in sync with metadata
  const handleMetadataChange = (newMeta: TemplateMetadata) => {
    setMetadata(newMeta);
    if (
      newMeta.noteFormat &&
      newMeta.domain &&
      (newMeta.noteFormat !== structure.formatType || newMeta.domain !== structure.discipline)
    ) {
      setStructure((prev) => ({
        ...prev,
        formatType: (newMeta.noteFormat || prev.formatType) as NoteFormat,
        discipline: (newMeta.domain || prev.discipline) as Discipline,
      }));
    }
  };

  const handleCloneSelect = (fwId: string) => {
    setSelectedFrameworkId(fwId);
    const fw = frameworks.find((f) => f.id === fwId);
    if (fw) {
      setMetadata({
        name: `Copy of ${fw.name}`,
        description: fw.description,
        domain: fw.domain,
        noteFormat: fw.type,
        subtype: fw.subtype,
        visibility: 'private',
      });
      const inferredFormat = inferFormatType(fw.type);
      const converted = frameworkSectionsToTemplateStructure(
        fw.sections,
        inferredFormat,
        fw.domain as Discipline,
      );
      setStructure(converted);
    }
  };

  const validateMeta = (): boolean => {
    const errs: Partial<Record<keyof TemplateMetadata, string>> = {};
    if (!metadata.name.trim()) errs.name = 'Name is required';
    if (!metadata.domain) errs.domain = 'Domain is required';
    if (!metadata.noteFormat) errs.noteFormat = 'Note format is required';
    setMetaErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = useCallback(async () => {
    if (savingRef.current) return;
    if (!validateMeta()) return;

    const validation = validateTemplateStructure(structure);
    if (!validation.valid) {
      setError(`Structure validation failed: ${validation.errors.join('; ')}`);
      return;
    }

    setSaving(true);
    setError('');
    try {
      const template = await createTemplate({
        name: metadata.name.trim(),
        description: metadata.description.trim() || undefined,
        domain: metadata.domain,
        noteFormat: metadata.noteFormat,
        subtype: metadata.subtype.trim() || undefined,
        structureJson: structure,
        visibility: metadata.visibility,
      });
      router.push(`/templates/${template.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template');
    } finally {
      setSaving(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata, structure, router]);

  // Keyboard shortcut: Cmd+S / Ctrl+S to create
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (!savingRef.current) {
          handleSave();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleSave]);

  // Navigation guard helper
  const guardedNavigate = (action: () => void) => {
    if (dirty) {
      setPendingNav(() => action);
    } else {
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-3xl mx-auto">
          {/* Page header */}
          <div className="mb-6">
            <Link
              href="/templates"
              className="text-sm text-gray-500 hover:text-gray-700 mb-3 inline-flex items-center gap-1 focus-visible:outline-none focus-visible:text-[#0d9488] rounded"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
              Templates
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Create Template</h1>
            <p className="text-sm text-gray-500 mt-1">
              Build a custom clinical note template from scratch or clone a system framework.
            </p>
          </div>

          {/* Mode chooser */}
          {mode === 'choose' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setMode('scratch')}
                className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-md hover:border-[#0d9488] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488] focus-visible:ring-offset-2"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0d9488]/10 flex items-center justify-center mb-3" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v16m8-8H4" /></svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#0d9488]">
                  Start from Scratch
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Create a blank template and define your own sections and items.
                </p>
              </button>

              <button
                onClick={() => setMode('clone')}
                className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-md hover:border-[#1e3a5f] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f] focus-visible:ring-offset-2"
              >
                <div className="w-10 h-10 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center mb-3" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#1e3a5f]">
                  Clone a System Framework
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Start with a proven framework and customize it to your needs.
                </p>
              </button>
            </div>
          )}

          {/* Clone: framework picker */}
          {mode === 'clone' && !selectedFrameworkId && (
            <div>
              <button
                onClick={() => { setMode('choose'); setCloneDomain(''); setCloneSearch(''); }}
                className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1 focus-visible:outline-none focus-visible:text-[#0d9488] rounded"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
                Back
              </button>

              <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a Framework to Clone</h2>

              {/* Search + Domain filter row */}
              <div className="flex flex-wrap gap-2 mb-4 items-center">
                <div className="relative flex-1 min-w-[180px]">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                  <input
                    type="text"
                    value={cloneSearch}
                    onChange={(e) => setCloneSearch(e.target.value)}
                    placeholder="Search frameworks..."
                    aria-label="Search frameworks"
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                  />
                </div>
                {['', 'medical', 'rehabilitation', 'behavioral_health'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setCloneDomain(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/50 ${
                      cloneDomain === d ? 'bg-[#1e3a5f] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {d ? getDomainLabel(d) : 'All'}
                  </button>
                ))}
              </div>

              {filteredFrameworks.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm text-gray-400">No frameworks match your search.</p>
                  <button
                    onClick={() => { setCloneDomain(''); setCloneSearch(''); }}
                    className="mt-2 text-sm text-[#0d9488] hover:text-[#0f766e] font-medium focus-visible:outline-none focus-visible:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-xs text-gray-400 mb-2">{filteredFrameworks.length} framework{filteredFrameworks.length !== 1 ? 's' : ''}</div>
                  <div className="grid grid-cols-1 gap-3">
                    {filteredFrameworks.map((fw) => (
                      <button
                        key={fw.id}
                        onClick={() => handleCloneSelect(fw.id)}
                        className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:shadow-md hover:border-[#0d9488] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488] focus-visible:ring-offset-1"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: getDomainColor(fw.domain) }}
                          >
                            {getDomainLabel(fw.domain)}
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {fw.type}
                          </span>
                          <span className="text-xs text-gray-400">{fw.sections.length} sections</span>
                          <span className="text-xs text-gray-400">{fw.itemCount} items</span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">{fw.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{fw.description}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Editor: scratch or clone (after framework selected) */}
          {(mode === 'scratch' || (mode === 'clone' && selectedFrameworkId)) && (
            <div>
              <button
                onClick={() => {
                  const action = mode === 'clone'
                    ? () => setSelectedFrameworkId('')
                    : () => setMode('choose');
                  guardedNavigate(action);
                }}
                className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1 focus-visible:outline-none focus-visible:text-[#0d9488] rounded"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
                Back
              </button>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between" role="alert">
                  <span>{error}</span>
                  <button onClick={() => setError('')} className="ml-3 text-red-400 hover:text-red-600 flex-shrink-0" aria-label="Dismiss error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              )}

              {/* Metadata form */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Template Details</h2>
                <TemplateMetadataForm
                  value={metadata}
                  onChange={handleMetadataChange}
                  errors={metaErrors}
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
                  onClick={() => guardedNavigate(() => router.push('/templates'))}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488] focus-visible:ring-offset-2"
                >
                  {saving ? 'Creating…' : 'Create Template'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Unsaved changes confirm dialog */}
      <ConfirmDialog
        open={!!pendingNav}
        title="Discard unsaved changes?"
        message="You have unsaved work on this template. Are you sure you want to leave? Your changes will be lost."
        confirmLabel="Discard"
        variant="danger"
        onConfirm={() => {
          const nav = pendingNav;
          setPendingNav(null);
          nav?.();
        }}
        onCancel={() => setPendingNav(null)}
      />
    </div>
  );
}

function inferFormatType(frameworkType: string): NoteFormat {
  const lower = frameworkType.toLowerCase();
  if (lower.includes('soap')) return 'SOAP';
  if (lower.includes('dap')) return 'DAP';
  if (lower.includes('h&p') || lower.includes('history')) return 'H&P';
  if (lower.includes('evaluation') || lower.includes('eval') || lower.includes('intake')) return 'eval';
  if (lower.includes('narrative') || lower.includes('discharge') || lower.includes('progress')) return 'narrative';
  return 'custom';
}
