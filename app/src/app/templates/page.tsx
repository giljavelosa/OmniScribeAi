'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ConfirmDialog from '@/components/ConfirmDialog';
import { fetchTemplates, archiveTemplate, unarchiveTemplate, cloneTemplate } from '@/lib/template-client';
import { getDomainColor, getDomainLabel, getFrameworkById } from '@/lib/frameworks';
import type { NoteTemplateSummary } from '@/lib/types';

type Tab = 'user' | 'system';

// ─── Helpers ──────────────────────────────────────────────

function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Main Page ────────────────────────────────────────────

export default function TemplatesPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('user');
  const [templates, setTemplates] = useState<NoteTemplateSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // Confirm dialog state
  const [confirmAction, setConfirmAction] = useState<{
    type: 'archive' | 'unarchive';
    template: NoteTemplateSummary;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Clone loading guard — tracks ID of template currently being cloned
  const [cloningId, setCloningId] = useState<string | null>(null);

  // Auto-dismiss success message
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(''), 4000);
    return () => clearTimeout(timer);
  }, [success]);

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
      const actionName = confirmAction.type === 'archive' ? 'archived' : 'unarchived';
      if (confirmAction.type === 'archive') {
        await archiveTemplate(confirmAction.template.id);
      } else {
        await unarchiveTemplate(confirmAction.template.id);
      }
      setSuccess(`Template ${actionName} successfully.`);
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
    if (cloningId) return;
    setCloningId(template.id);
    try {
      const cloned = await cloneTemplate(template.id);
      router.push(`/templates/${cloned.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clone template');
    } finally {
      setCloningId(null);
    }
  };

  const domains = ['medical', 'rehabilitation', 'behavioral_health'];
  const hasActiveFilters = !!domainFilter || search.length >= 2;

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
              aria-label="Create a new template"
              className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488] focus-visible:ring-offset-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v16m8-8H4" /></svg>
              <span className="hidden sm:inline">New Template</span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4" role="tablist" aria-label="Template source">
            <button
              role="tab"
              aria-selected={tab === 'user'}
              onClick={() => setTab('user')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/50 ${
                tab === 'user'
                  ? 'bg-[#1e3a5f] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              My Templates
            </button>
            <button
              role="tab"
              aria-selected={tab === 'system'}
              onClick={() => setTab('system')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/50 ${
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
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates... (min 2 chars)"
                aria-label="Search templates"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488]"
              />
            </div>

            {/* Domain filter */}
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              aria-label="Filter by domain"
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

          {/* Success banner */}
          {success && (
            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center justify-between" role="status">
              <span>{success}</span>
              <button
                onClick={() => setSuccess('')}
                className="ml-3 text-green-400 hover:text-green-600 transition-colors flex-shrink-0"
                aria-label="Dismiss message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between" role="alert">
              <span>{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-3 text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                aria-label="Dismiss error"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          )}

          {/* Loading state — skeleton cards */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-busy="true" aria-label="Loading templates">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                  <div className="flex gap-2 mb-3">
                    <div className="h-4 w-16 bg-gray-200 rounded-full" />
                    <div className="h-4 w-10 bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-full bg-gray-100 rounded mb-1" />
                  <div className="h-3 w-2/3 bg-gray-100 rounded mb-4" />
                  <div className="h-3 w-1/3 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && templates.length === 0 && !error && (
            <div className="text-center py-16">
              <svg className="mx-auto mb-4 text-gray-300" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
              {hasActiveFilters ? (
                <>
                  <p className="text-gray-500 text-sm mb-2">No templates match your filters.</p>
                  <p className="text-gray-400 text-xs mb-4">Try adjusting your search or domain filter.</p>
                  <button
                    onClick={() => { setSearch(''); setDomainFilter(''); }}
                    className="inline-flex items-center gap-1.5 text-[#0d9488] hover:text-[#0f766e] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488]/50 rounded px-2 py-1"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    Clear filters
                  </button>
                </>
              ) : tab === 'user' ? (
                <>
                  <p className="text-gray-500 text-sm mb-1">No custom templates yet.</p>
                  <p className="text-gray-400 text-xs mb-4">Create your first template or clone a system framework to get started.</p>
                  <Link
                    href="/templates/new"
                    className="inline-flex items-center gap-2 bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488] focus-visible:ring-offset-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v16m8-8H4" /></svg>
                    Create Template
                  </Link>
                </>
              ) : (
                <p className="text-gray-500 text-sm">No system frameworks available.</p>
              )}
            </div>
          )}

          {/* Results count + Template cards */}
          {!loading && templates.length > 0 && (
            <>
              <div className="text-xs text-gray-400 mb-3">
                {templates.length} template{templates.length !== 1 ? 's' : ''}
                {hasActiveFilters && ' matching filters'}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((t) => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                    isSystemTab={tab === 'system'}
                    cloningId={cloningId}
                    onArchive={() => setConfirmAction({ type: 'archive', template: t })}
                    onUnarchive={() => setConfirmAction({ type: 'unarchive', template: t })}
                    onClone={() => handleClone(t)}
                  />
                ))}
              </div>
            </>
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
        loadingLabel={confirmAction?.type === 'archive' ? 'Archiving…' : 'Unarchiving…'}
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
  cloningId,
  onArchive,
  onUnarchive,
  onClone,
}: {
  template: NoteTemplateSummary;
  isSystemTab: boolean;
  cloningId: string | null;
  onArchive: () => void;
  onUnarchive: () => void;
  onClone: () => void;
}) {
  const isSystem = template.sourceType === 'system';
  const domainColor = getDomainColor(template.domain);
  const sourceFramework = template.sourceFrameworkId ? getFrameworkById(template.sourceFrameworkId) : null;

  return (
    <div className={`bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all group ${
      template.isArchived ? 'border-gray-300 opacity-75' : 'border-gray-200'
    }`}>
      <div className="p-5">
        {/* Top row: badges */}
        <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
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
          {!isSystem && template.visibility === 'private' && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500" title="Only visible to you">
              Private
            </span>
          )}
          {!isSystem && template.visibility === 'organization' && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-600" title="Shared with your organization">
              Org
            </span>
          )}
          {template.isArchived && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700">
              Archived
            </span>
          )}
        </div>

        {/* Name (block-level for full click area) */}
        <Link
          href={`/templates/${template.id}`}
          className="block text-sm font-semibold text-gray-900 hover:text-[#0d9488] transition-colors focus-visible:outline-none focus-visible:text-[#0d9488] leading-snug"
        >
          {template.name}
        </Link>

        {/* Description */}
        {template.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{template.description}</p>
        )}

        {/* Source framework badge (for user templates cloned from a framework) */}
        {!isSystem && sourceFramework && (
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            <span>Based on {sourceFramework.name}</span>
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400 flex-wrap">
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /></svg>
            {template.itemCount} items
          </span>
          {!isSystem && (
            <span title={`Version ${template.version}`}>v{template.version}</span>
          )}
          {template.subtype && (
            <span className="truncate max-w-[120px]" title={template.subtype}>{template.subtype}</span>
          )}
          {!isSystem && template.updatedAt && (
            <span className="ml-auto text-gray-300" title={new Date(template.updatedAt).toLocaleString()}>
              {formatRelativeDate(template.updatedAt)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <Link
            href={`/templates/${template.id}`}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488]/50"
          >
            {isSystem ? 'Preview' : 'Edit'}
          </Link>

          {isSystemTab && isSystem && (
            <button
              onClick={onClone}
              disabled={cloningId !== null}
              title={`Clone "${template.name}" to your templates`}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0d9488] text-white hover:bg-[#0f766e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488] focus-visible:ring-offset-1"
            >
              {cloningId === template.id ? 'Cloning…' : 'Clone to My Templates'}
            </button>
          )}

          {!isSystem && !template.isArchived && (
            <button
              onClick={onArchive}
              title={`Archive "${template.name}"`}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-red-600 border border-red-200 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 ml-auto"
            >
              Archive
            </button>
          )}

          {!isSystem && template.isArchived && (
            <button
              onClick={onUnarchive}
              title={`Unarchive "${template.name}"`}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-[#0d9488] border border-[#0d9488]/30 hover:bg-[#0d9488]/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488]/50 ml-auto"
            >
              Unarchive
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
