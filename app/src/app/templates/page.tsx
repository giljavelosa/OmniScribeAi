'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ConfirmDialog from '@/components/ConfirmDialog';
import { fetchTemplates, archiveTemplate, unarchiveTemplate, cloneTemplate } from '@/lib/template-client';
import { getDomainColor, getDomainLabel } from '@/lib/frameworks';
import type { NoteTemplateSummary } from '@/lib/types';

type Tab = 'user' | 'system';

export default function TemplatesPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('user');
  const [templates, setTemplates] = useState<NoteTemplateSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // Confirm dialog state
  const [confirmAction, setConfirmAction] = useState<{
    type: 'archive' | 'unarchive';
    template: NoteTemplateSummary;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchTemplates({
        sourceType: tab === 'user' ? 'user' : 'system',
        domain: domainFilter || undefined,
        search: search.length >= 2 ? search : undefined,
        includeArchived: tab === 'user' ? showArchived : false,
        limit: 100,
      });
      setTemplates(result.templates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, [tab, domainFilter, search, showArchived]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleArchive = async () => {
    if (!confirmAction) return;
    setConfirmLoading(true);
    try {
      if (confirmAction.type === 'archive') {
        await archiveTemplate(confirmAction.template.id);
      } else {
        await unarchiveTemplate(confirmAction.template.id);
      }
      setConfirmAction(null);
      loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
      setConfirmAction(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleClone = async (template: NoteTemplateSummary) => {
    try {
      const cloned = await cloneTemplate(template.id);
      router.push(`/templates/${cloned.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clone template');
    }
  };

  const domains = ['medical', 'rehabilitation', 'behavioral_health'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-5xl">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
              <p className="text-sm text-gray-500 mt-1">
                Create and manage custom clinical note templates
              </p>
            </div>
            <Link
              href="/templates/new"
              className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v16m8-8H4" /></svg>
              New Template
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTab('user')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === 'user'
                  ? 'bg-[#1e3a5f] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              My Templates
            </button>
            <button
              onClick={() => setTab('system')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === 'system'
                  ? 'bg-[#1e3a5f] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              System Frameworks
            </button>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488]"
              />
            </div>

            {/* Domain filter */}
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] bg-white"
            >
              <option value="">All Domains</option>
              {domains.map((d) => (
                <option key={d} value={d}>{getDomainLabel(d)}</option>
              ))}
            </select>

            {/* Show archived toggle (user tab only) */}
            {tab === 'user' && (
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="rounded border-gray-300 text-[#0d9488] focus:ring-[#0d9488]"
                />
                Show archived
              </label>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12 gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0d9488] border-t-transparent" />
              <span className="text-sm text-gray-500">Loading templates...</span>
            </div>
          )}

          {/* Empty state */}
          {!loading && templates.length === 0 && !error && (
            <div className="text-center py-16">
              <svg className="mx-auto mb-4 text-gray-300" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
              <p className="text-gray-500 text-sm mb-4">
                {tab === 'user'
                  ? 'No custom templates yet. Create your first one!'
                  : 'No system frameworks match your search.'}
              </p>
              {tab === 'user' && (
                <Link
                  href="/templates/new"
                  className="inline-flex items-center gap-2 bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v16m8-8H4" /></svg>
                  Create Template
                </Link>
              )}
            </div>
          )}

          {/* Template cards */}
          {!loading && templates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((t) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  isSystemTab={tab === 'system'}
                  onArchive={() => setConfirmAction({ type: 'archive', template: t })}
                  onUnarchive={() => setConfirmAction({ type: 'unarchive', template: t })}
                  onClone={() => handleClone(t)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Confirm dialog */}
      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.type === 'archive' ? 'Archive Template' : 'Unarchive Template'}
        message={
          confirmAction?.type === 'archive'
            ? `Are you sure you want to archive "${confirmAction.template.name}"? It will no longer appear in template selection.`
            : `Unarchive "${confirmAction?.template.name}"? It will be available for use again.`
        }
        confirmLabel={confirmAction?.type === 'archive' ? 'Archive' : 'Unarchive'}
        variant={confirmAction?.type === 'archive' ? 'danger' : 'default'}
        loading={confirmLoading}
        onConfirm={handleArchive}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}

// ─── Template Card Sub-component ──────────────────────────

function TemplateCard({
  template,
  isSystemTab,
  onArchive,
  onUnarchive,
  onClone,
}: {
  template: NoteTemplateSummary;
  isSystemTab: boolean;
  onArchive: () => void;
  onUnarchive: () => void;
  onClone: () => void;
}) {
  const isSystem = template.sourceType === 'system';
  const domainColor = getDomainColor(template.domain);

  return (
    <div className={`bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all ${
      template.isArchived ? 'border-gray-300 opacity-70' : 'border-gray-200'
    }`}>
      <div className="p-5">
        {/* Top row: badges */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: domainColor }}
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
          {!isSystem && template.visibility === 'organization' && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">
              Org
            </span>
          )}
          {template.isArchived && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700">
              Archived
            </span>
          )}
        </div>

        {/* Name */}
        <Link
          href={`/templates/${template.id}`}
          className="text-sm font-semibold text-gray-900 hover:text-[#0d9488] transition-colors"
        >
          {template.name}
        </Link>

        {/* Description */}
        {template.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
          <span>{template.itemCount} items</span>
          {!isSystem && <span>v{template.version}</span>}
          {template.subtype && <span>{template.subtype}</span>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <Link
            href={`/templates/${template.id}`}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {isSystem ? 'View' : 'Edit'}
          </Link>

          {isSystemTab && isSystem && (
            <button
              onClick={onClone}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0d9488] text-white hover:bg-[#0f766e] transition-colors"
            >
              Clone to My Templates
            </button>
          )}

          {!isSystem && !template.isArchived && (
            <button
              onClick={onArchive}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
            >
              Archive
            </button>
          )}

          {!isSystem && template.isArchived && (
            <button
              onClick={onUnarchive}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-[#0d9488] border border-[#0d9488]/30 hover:bg-[#0d9488]/5 transition-colors"
            >
              Unarchive
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
