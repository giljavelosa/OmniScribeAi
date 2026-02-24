'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { frameworks, getDomainLabel } from '@/lib/frameworks';

interface PatientResult {
  id: string;
  identifier: string;
  firstName: string | null;
  lastName: string | null;
  _count?: { visits: number };
}

interface VisitResult {
  id: string;
  frameworkId: string;
  domain: string;
  date: string;
  status: string;
  patient: { id: string; identifier: string; firstName: string | null; lastName: string | null };
}

export default function SearchModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState<PatientResult[]>([]);
  const [visits, setVisits] = useState<VisitResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Total results for keyboard nav
  const allResults = [
    ...patients.map(p => ({ type: 'patient' as const, id: p.id, data: p })),
    ...visits.map(v => ({ type: 'visit' as const, id: v.id, data: v })),
  ];

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setPatients([]);
      setVisits([]);
      setSelectedIdx(0);
    }
  }, [open]);

  // Debounced search
  const search = useCallback((q: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (q.trim().length < 2) {
      setPatients([]);
      setVisits([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setPatients(data.patients || []);
          setVisits(data.visits || []);
          setSelectedIdx(0);
        }
      } catch { /* network error */ }
      setLoading(false);
    }, 250);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    search(value);
  };

  const navigate = (result: typeof allResults[number]) => {
    setOpen(false);
    if (result.type === 'patient') {
      router.push(`/patients/${result.id}`);
    } else {
      router.push(`/visit/${result.id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => Math.min(prev + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && allResults[selectedIdx]) {
      e.preventDefault();
      navigate(allResults[selectedIdx]);
    }
  };

  const patientName = (p: { firstName: string | null; lastName: string | null; identifier: string }) =>
    [p.firstName, p.lastName].filter(Boolean).join(' ') || p.identifier;

  const frameworkName = (fwId: string) =>
    frameworks.find(f => f.id === fwId)?.name || fwId;

  if (!open) return null;

  let resultIdx = 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search patients, visits..."
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none"
          />
          <kbd className="hidden sm:inline text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">Searching...</div>
          )}

          {!loading && query.trim().length >= 2 && allResults.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">No results found</div>
          )}

          {!loading && patients.length > 0 && (
            <div>
              <div className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">Patients</div>
              {patients.map(p => {
                const idx = resultIdx++;
                return (
                  <button
                    key={p.id}
                    onClick={() => navigate({ type: 'patient', id: p.id, data: p })}
                    className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors ${
                      selectedIdx === idx ? 'bg-[#0d9488]/10' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center text-[#1e3a5f] text-xs font-bold shrink-0">
                      {(p.firstName?.[0] || p.identifier[0] || '?').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{patientName(p)}</div>
                      <div className="text-xs text-gray-400">ID: {p.identifier}</div>
                    </div>
                    {p._count?.visits !== undefined && (
                      <span className="text-[10px] text-gray-400 shrink-0">{p._count.visits} visit{p._count.visits !== 1 ? 's' : ''}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {!loading && visits.length > 0 && (
            <div>
              <div className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">Visits</div>
              {visits.map(v => {
                const idx = resultIdx++;
                return (
                  <button
                    key={v.id}
                    onClick={() => navigate({ type: 'visit', id: v.id, data: v })}
                    className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors ${
                      selectedIdx === idx ? 'bg-[#0d9488]/10' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0d9488]/10 flex items-center justify-center text-[#0d9488] text-xs font-bold shrink-0">
                      {getDomainLabel(v.domain)?.[0] || 'V'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {patientName(v.patient)} — {frameworkName(v.frameworkId)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(v.date).toLocaleDateString()} · {v.status}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {!loading && query.trim().length < 2 && (
            <div className="px-4 py-6 text-center text-xs text-gray-400">
              Type at least 2 characters to search
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-4 text-[10px] text-gray-400">
          <span><kbd className="font-medium bg-gray-100 px-1 py-0.5 rounded border border-gray-200">↑↓</kbd> Navigate</span>
          <span><kbd className="font-medium bg-gray-100 px-1 py-0.5 rounded border border-gray-200">↵</kbd> Open</span>
          <span><kbd className="font-medium bg-gray-100 px-1 py-0.5 rounded border border-gray-200">ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
