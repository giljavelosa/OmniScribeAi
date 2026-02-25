'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { frameworks, getDomainColor, getDomainLabel } from '@/lib/frameworks';

interface RecentFramework {
  frameworkId: string;
  usedAt: number;
}

interface VisitDraft {
  patientName: string;
  patientId: string;
  providerType: string;
  frameworkId: string;
  savedAt: number;
}

interface ApiVisit {
  id: string;
  frameworkId: string;
  domain: string;
  date: string;
  duration: number | null;
  status: string;
  patient: {
    id: string;
    identifier: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export default function DashboardPage() {
  const [recentFrameworks, setRecentFrameworks] = useState<RecentFramework[]>([]);
  const [draft, setDraft] = useState<VisitDraft | null>(null);
  const [visits, setVisits] = useState<ApiVisit[]>([]);
  const [visitsLoading, setVisitsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('omniscribe-recent-frameworks');
      if (raw) {
        const parsed = JSON.parse(raw) as RecentFramework[];
        const valid = parsed.filter(r => frameworks.some(f => f.id === r.frameworkId));
        setRecentFrameworks(valid.slice(0, 5));
      }
    } catch { /* ignore parse errors */ }

    // Check for saved draft (expire after 24h)
    try {
      const draftRaw = localStorage.getItem('omniscribe-visit-draft');
      if (draftRaw) {
        const parsed = JSON.parse(draftRaw) as VisitDraft;
        const ageMs = Date.now() - (parsed.savedAt || 0);
        if (ageMs < 24 * 60 * 60 * 1000 && (parsed.patientName || parsed.frameworkId)) {
          setDraft(parsed);
        } else {
          localStorage.removeItem('omniscribe-visit-draft');
        }
      }
    } catch { /* ignore parse errors */ }

    // Fetch real visits from API
    fetch('/api/visits?limit=20')
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => setVisits(data.visits || []))
      .catch(() => { /* fail silently — empty state shown */ })
      .finally(() => setVisitsLoading(false));
  }, []);

  // Resolve framework objects for display
  const recentFwObjects = recentFrameworks
    .map(r => frameworks.find(f => f.id === r.frameworkId))
    .filter(Boolean) as typeof frameworks;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-5xl">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500">Here are your recent clinical notes, quick actions, and template shortcuts.</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            <Link
              href="/visit/new"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-[#0d9488] hover:shadow-sm transition-all"
            >
              <div className="text-sm font-semibold text-gray-900 mb-1">Start New Visit</div>
              <div className="text-xs text-gray-500">Open the visit workflow and choose a framework or template.</div>
            </Link>
            <Link
              href="/templates"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-[#1e3a5f] hover:shadow-sm transition-all"
            >
              <div className="text-sm font-semibold text-gray-900 mb-1">Manage Templates</div>
              <div className="text-xs text-gray-500">Create, edit, clone, or archive your reusable note templates.</div>
            </Link>
            <Link
              href="/frameworks"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-400 hover:shadow-sm transition-all"
            >
              <div className="text-sm font-semibold text-gray-900 mb-1">Browse Frameworks</div>
              <div className="text-xs text-gray-500">Review built-in evidence-based frameworks by clinical domain.</div>
            </Link>
          </div>

          {/* Resume Draft */}
          {draft && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-amber-900">Unsaved draft</div>
                  <div className="text-xs text-amber-700 truncate">
                    {[
                      draft.patientName && `Patient: ${draft.patientName}`,
                      draft.frameworkId && frameworks.find(f => f.id === draft.frameworkId)?.name,
                    ].filter(Boolean).join(' — ') || 'In-progress visit'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => { localStorage.removeItem('omniscribe-visit-draft'); setDraft(null); }}
                  className="text-xs text-amber-600 hover:text-amber-800 font-medium px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  Discard
                </button>
                <Link
                  href="/visit/new"
                  className="text-xs text-white bg-amber-600 hover:bg-amber-700 font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  Resume
                </Link>
              </div>
            </div>
          )}

          {/* Quick Start — recent frameworks */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3 gap-3">
              <h2 className="font-semibold text-gray-900">Quick Start</h2>
              <div className="flex items-center gap-3">
                <Link href="/templates" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                  Templates
                </Link>
                <Link href="/visit/new" className="text-sm text-[#0d9488] hover:text-[#0f766e] font-medium">
                  Browse all frameworks
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentFwObjects.length > 0 ? (
                recentFwObjects.map((fw) => (
                  <Link
                    key={fw.id}
                    href={`/visit/new?frameworkId=${fw.id}`}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-400 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: getDomainColor(fw.domain) }}
                      >
                        {getDomainLabel(fw.domain)}
                      </span>
                    </div>
                    <div className="font-medium text-gray-900 text-sm group-hover:text-[#0d9488] transition-colors">
                      {fw.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{fw.description}</div>
                  </Link>
                ))
              ) : (
                <Link
                  href="/visit/new"
                  className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-[#0d9488] hover:bg-[#0d9488]/5 transition-all text-center col-span-full sm:col-span-2 lg:col-span-3"
                >
                  <div className="text-sm font-medium text-gray-700">Start your first visit</div>
                  <div className="text-xs text-gray-400 mt-1">Select a framework and begin recording</div>
                </Link>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {(() => {
              const now = new Date();
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              const thisWeek = visits.filter(v => new Date(v.date) >= weekAgo).length;
              const durations = visits.map(v => v.duration).filter((d): d is number => d != null && d > 0);
              const avgDur = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
              const uniqueFrameworks = new Set(visits.map(v => v.frameworkId)).size;
              return [
                { label: 'Total Notes', value: visits.length.toString(), color: '#1e3a5f' },
                { label: 'This Week', value: thisWeek.toString(), color: '#0d9488' },
                { label: 'Avg Duration', value: avgDur > 0 ? `${avgDur} min` : '—', color: '#7c3aed' },
                { label: 'Frameworks Used', value: uniqueFrameworks.toString(), color: '#f59e0b' },
              ];
            })().map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Notes list */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Notes</h2>
              <Link href="/visit/new" className="text-sm text-[#0d9488] hover:text-[#0f766e] font-medium">
                + New Visit
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {visitsLoading ? (
                <div className="px-5 py-8 text-center text-sm text-gray-400">Loading visits...</div>
              ) : visits.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <div className="text-sm text-gray-500 mb-2">No notes yet</div>
                  <Link href="/visit/new" className="text-sm text-[#0d9488] hover:text-[#0f766e] font-medium">
                    Start your first visit
                  </Link>
                </div>
              ) : (
                visits.map((visit) => {
                  const fw = frameworks.find(f => f.id === visit.frameworkId);
                  const domainLabel = getDomainLabel(visit.domain);
                  const domainColor = getDomainColor(visit.domain);
                  const patientName = [visit.patient.firstName, visit.patient.lastName].filter(Boolean).join(' ') || visit.patient.identifier || 'Unknown';
                  const dateStr = new Date(visit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  return (
                    <Link
                      key={visit.id}
                      href={`/visit/${visit.id}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: domainColor }}
                      >
                        {domainLabel.slice(0, 3)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 truncate">{patientName}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                            visit.status === 'complete' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {visit.status === 'complete' ? 'Complete' : visit.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 truncate mt-0.5">{fw?.name || visit.frameworkId}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm text-gray-900">{dateStr}</div>
                        {visit.duration != null && <div className="text-xs text-gray-400">{visit.duration} min</div>}
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
