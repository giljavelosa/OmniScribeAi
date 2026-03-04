'use client';

import { useState, useEffect, useRef } from 'react';
import { frameworks, getDomainLabel, getDomainColor } from '@/lib/frameworks';
import { fetchUserTemplates } from '@/lib/template-client';
import type { NoteTemplateSummary, Domain } from '@/lib/types';

// ─── Types ────────────────────────────────────────────────────

export type TemplateSelection =
  | { type: 'system'; frameworkId: string }
  | { type: 'user'; templateId: string };

interface TemplatePickerProps {
  onSelect: (selection: TemplateSelection) => void;
  selectedFrameworkId?: string;
  selectedTemplateId?: string;
  suggestedDomain?: string;
}

type Tab = 'system' | 'custom';

// ─── Domain data ──────────────────────────────────────────────

const domains: { id: Domain; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'medical',
    label: 'Medical',
    description: 'Primary care, specialty, procedures',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: 'rehabilitation',
    label: 'Rehabilitation',
    description: 'PT, OT, SLP evaluations & notes',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
      </svg>
    ),
  },
  {
    id: 'behavioral_health',
    label: 'Behavioral Health',
    description: 'Therapy, psychiatry, crisis, group',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

// ─── Sub-components ───────────────────────────────────────────

function SystemFrameworkCard({ fw, onSelect }: { fw: typeof frameworks[number]; onSelect: (id: string) => void }) {
  return (
    <button
      onClick={() => onSelect(fw.id)}
      className="border-2 border-gray-200 hover:border-gray-400 rounded-xl p-4 text-left transition-all hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: getDomainColor(fw.domain) }}
            >
              {getDomainLabel(fw.domain)}
            </span>
          </div>
          <div className="font-semibold text-gray-900 text-sm">{fw.name}</div>
          <div className="text-xs text-gray-500 mt-1">{fw.description}</div>
        </div>
        <div className="text-xs text-gray-400 whitespace-nowrap ml-4">
          {fw.itemCount} items
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {fw.regulatorySources.slice(0, 2).map((src) => (
          <span key={src} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
            {src}
          </span>
        ))}
      </div>
    </button>
  );
}

function UserTemplateCard({ tmpl, onSelect }: { tmpl: NoteTemplateSummary; onSelect: (id: string) => void }) {
  return (
    <button
      onClick={() => onSelect(tmpl.id)}
      className="border-2 border-gray-200 hover:border-blue-400 rounded-xl p-4 text-left transition-all hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: getDomainColor(tmpl.domain) }}
            >
              {getDomainLabel(tmpl.domain)}
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Custom
            </span>
            {tmpl.visibility === 'organization' && (
              <span className="text-[10px] text-gray-400" title="Shared with organization">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
            )}
          </div>
          <div className="font-semibold text-gray-900 text-sm">{tmpl.name}</div>
          {tmpl.description && (
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{tmpl.description}</div>
          )}
        </div>
        <div className="text-xs text-gray-400 whitespace-nowrap ml-4">
          {tmpl.itemCount} items
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
          {tmpl.noteFormat}
        </span>
        {tmpl.subtype && (
          <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
            {tmpl.subtype}
          </span>
        )}
        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
          v{tmpl.version}
        </span>
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────

export default function TemplatePicker({ onSelect, selectedFrameworkId, selectedTemplateId, suggestedDomain }: TemplatePickerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('system');
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const appliedSuggestionRef = useRef<string | null>(null);

  // User templates state
  const [userTemplates, setUserTemplates] = useState<NoteTemplateSummary[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [templateError, setTemplateError] = useState('');

  // Auto-select domain when provider type changes (suggestion, not restriction)
  useEffect(() => {
    if (suggestedDomain && !selectedFrameworkId && !selectedTemplateId && appliedSuggestionRef.current !== suggestedDomain) {
      const timer = window.setTimeout(() => {
        setSelectedDomain(suggestedDomain as Domain);
        appliedSuggestionRef.current = suggestedDomain;
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [suggestedDomain, selectedFrameworkId, selectedTemplateId]);

  // Fetch user templates (needed for My Templates tab, selected template display, and combined search)
  useEffect(() => {
    let cancelled = false;

    fetchUserTemplates()
      .then((data) => {
        if (!cancelled) setUserTemplates(data.templates.filter((t) => !t.isArchived));
      })
      .catch((err) => {
        if (!cancelled) setTemplateError(err.message || 'Failed to load templates');
      })
      .finally(() => {
        if (!cancelled) setLoadingTemplates(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ─── Selected state display ─────────────────────────────

  const selectedFramework = selectedFrameworkId ? frameworks.find(f => f.id === selectedFrameworkId) : null;
  const selectedTemplate = selectedTemplateId ? userTemplates.find(t => t.id === selectedTemplateId) : null;

  if (selectedFramework) {
    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700">Selected Framework</div>
        <div
          className="border-2 rounded-xl p-4 flex items-start justify-between"
          style={{ borderColor: getDomainColor(selectedFramework.domain) }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: getDomainColor(selectedFramework.domain) }}
              >
                {getDomainLabel(selectedFramework.domain)}
              </span>
              <span className="text-xs text-gray-500">{selectedFramework.itemCount} items</span>
            </div>
            <div className="font-semibold text-gray-900">{selectedFramework.name}</div>
            <div className="text-sm text-gray-500 mt-1">{selectedFramework.description}</div>
          </div>
          <button
            onClick={() => onSelect({ type: 'system', frameworkId: '' })}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Change selection"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (selectedTemplate) {
    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700">Selected Template</div>
        <div className="border-2 border-blue-400 rounded-xl p-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: getDomainColor(selectedTemplate.domain) }}
              >
                {getDomainLabel(selectedTemplate.domain)}
              </span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Custom
              </span>
              <span className="text-xs text-gray-500">{selectedTemplate.itemCount} items</span>
            </div>
            <div className="font-semibold text-gray-900">{selectedTemplate.name}</div>
            {selectedTemplate.description && (
              <div className="text-sm text-gray-500 mt-1">{selectedTemplate.description}</div>
            )}
          </div>
          <button
            onClick={() => onSelect({ type: 'user', templateId: '' })}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Change selection"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // If selectedTemplateId is set but template isn't in userTemplates yet (loading), show loading
  if (selectedTemplateId && !selectedTemplate) {
    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700">Selected Template</div>
        <div className="border-2 border-blue-400 rounded-xl p-4 flex items-center gap-3">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent" />
          <span className="text-sm text-gray-500">Loading template...</span>
          <button
            onClick={() => onSelect({ type: 'user', templateId: '' })}
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
            title="Change selection"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // ─── Search logic ───────────────────────────────────────

  const query = searchQuery.trim().toLowerCase();
  const isSearching = query.length >= 2;

  const systemSearchResults = isSearching
    ? frameworks.filter(f =>
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.type.toLowerCase().includes(query) ||
        (f.subtype && f.subtype.toLowerCase().includes(query)) ||
        getDomainLabel(f.domain).toLowerCase().includes(query)
      )
    : [];

  const customSearchResults = isSearching
    ? userTemplates.filter(t =>
        t.name.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query)) ||
        t.noteFormat.toLowerCase().includes(query) ||
        (t.subtype && t.subtype.toLowerCase().includes(query)) ||
        getDomainLabel(t.domain).toLowerCase().includes(query)
      )
    : [];

  const domainFrameworks = selectedDomain ? frameworks.filter(f => f.domain === selectedDomain) : [];

  // ─── Render ─────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search frameworks and templates..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
        />
      </div>

      {/* Search results (combined) */}
      {isSearching ? (
        <div className="space-y-4">
          {systemSearchResults.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                System Frameworks ({systemSearchResults.length})
              </div>
              <div className="grid grid-cols-1 gap-2">
                {systemSearchResults.map(fw => (
                  <SystemFrameworkCard key={fw.id} fw={fw} onSelect={(id) => onSelect({ type: 'system', frameworkId: id })} />
                ))}
              </div>
            </div>
          )}
          {customSearchResults.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                My Templates ({customSearchResults.length})
              </div>
              <div className="grid grid-cols-1 gap-2">
                {customSearchResults.map(tmpl => (
                  <UserTemplateCard key={tmpl.id} tmpl={tmpl} onSelect={(id) => onSelect({ type: 'user', templateId: id })} />
                ))}
              </div>
            </div>
          )}
          {systemSearchResults.length === 0 && customSearchResults.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              No frameworks or templates match &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Tab selector */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'system'
                  ? 'border-[#0d9488] text-[#0d9488]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              System Frameworks
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'custom'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Templates
              {userTemplates.length > 0 && (
                <span className="ml-1.5 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                  {userTemplates.length}
                </span>
              )}
            </button>
          </div>

          {/* System Frameworks tab */}
          {activeTab === 'system' && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">
                {selectedDomain ? 'Step 2: Choose Framework' : 'Step 1: Select Domain'}
              </div>

              {!selectedDomain ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {domains.map((domain) => (
                    <button
                      key={domain.id}
                      onClick={() => setSelectedDomain(domain.id)}
                      className="border-2 border-gray-200 hover:border-gray-400 rounded-xl p-4 text-left transition-all hover:shadow-sm group"
                    >
                      <div className="mb-3 text-gray-400 group-hover:text-[#1e3a5f] transition-colors">
                        {domain.icon}
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">{domain.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{domain.description}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedDomain(null)}
                    className="text-sm text-[#0d9488] hover:text-[#0f766e] font-medium flex items-center gap-1"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to domains
                  </button>
                  <div className="grid grid-cols-1 gap-2">
                    {domainFrameworks.map(fw => (
                      <SystemFrameworkCard key={fw.id} fw={fw} onSelect={(id) => onSelect({ type: 'system', frameworkId: id })} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* My Templates tab */}
          {activeTab === 'custom' && (
            <div className="space-y-3">
              {loadingTemplates ? (
                <div className="flex items-center justify-center py-8 gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent" />
                  <span className="text-sm text-gray-500">Loading templates...</span>
                </div>
              ) : templateError ? (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {templateError}
                </div>
              ) : userTemplates.length === 0 ? (
                <div className="text-center py-8">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-3">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                  <p className="text-sm text-gray-500 mb-1">No custom templates yet</p>
                  <p className="text-xs text-gray-400">
                    Create templates from the Templates page to customize your clinical notes.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {userTemplates.map(tmpl => (
                    <UserTemplateCard key={tmpl.id} tmpl={tmpl} onSelect={(id) => onSelect({ type: 'user', templateId: id })} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
