'use client';

import { useState, useEffect, useRef } from 'react';
import { frameworks, getDomainLabel, getDomainColor } from '@/lib/frameworks';
import { Domain } from '@/lib/types';

interface FrameworkSelectorProps {
  onSelect: (frameworkId: string) => void;
  selectedId?: string;
  suggestedDomain?: Domain;
}

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

function FrameworkCard({ fw, onSelect }: { fw: typeof frameworks[number]; onSelect: (id: string) => void }) {
  return (
    <button
      key={fw.id}
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

export default function FrameworkSelector({ onSelect, selectedId, suggestedDomain }: FrameworkSelectorProps) {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const appliedSuggestionRef = useRef<string | null>(null);

  // Auto-select domain when provider type changes (suggestion, not restriction)
  useEffect(() => {
    if (suggestedDomain && !selectedId && appliedSuggestionRef.current !== suggestedDomain) {
      setSelectedDomain(suggestedDomain);
      appliedSuggestionRef.current = suggestedDomain;
    }
  }, [suggestedDomain, selectedId]);

  const domainFrameworks = selectedDomain ? frameworks.filter(f => f.domain === selectedDomain) : [];
  const selectedFramework = selectedId ? frameworks.find(f => f.id === selectedId) : null;

  // Search across all frameworks
  const query = searchQuery.trim().toLowerCase();
  const searchResults = query.length >= 2
    ? frameworks.filter(f =>
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.type.toLowerCase().includes(query) ||
        (f.subtype && f.subtype.toLowerCase().includes(query)) ||
        getDomainLabel(f.domain).toLowerCase().includes(query)
      )
    : [];

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
            onClick={() => {
              onSelect('');
              setSelectedDomain(null);
              setSearchQuery('');
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

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
          placeholder="Search frameworks by name, type, or domain..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
        />
      </div>

      {/* Search results */}
      {query.length >= 2 ? (
        <div className="space-y-2">
          <div className="text-sm text-gray-500">{searchResults.length} framework{searchResults.length !== 1 ? 's' : ''} found</div>
          <div className="grid grid-cols-1 gap-2">
            {searchResults.map((fw) => (
              <FrameworkCard key={fw.id} fw={fw} onSelect={onSelect} />
            ))}
          </div>
        </div>
      ) : (
        <>
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
                {domainFrameworks.map((fw) => (
                  <FrameworkCard key={fw.id} fw={fw} onSelect={onSelect} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
