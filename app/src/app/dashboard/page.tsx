'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { mockVisits } from '@/lib/mock-data';

const domainColors: Record<string, string> = {
  Medical: '#1e3a5f',
  Rehabilitation: '#0d9488',
  'Behavioral Health': '#7c3aed',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-5xl">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500">Here are your recent clinical notes.</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Notes', value: mockVisits.length.toString(), color: '#1e3a5f' },
              { label: 'This Week', value: '3', color: '#0d9488' },
              { label: 'Avg Duration', value: '50 min', color: '#7c3aed' },
              { label: 'Frameworks Used', value: '4', color: '#f59e0b' },
            ].map((s) => (
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
              {mockVisits.map((visit) => (
                <Link
                  key={visit.id}
                  href={`/visit/${visit.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: domainColors[visit.domain] || '#1e3a5f' }}
                  >
                    {visit.providerType}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 truncate">{visit.patientName}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium shrink-0">
                        {visit.status === 'complete' ? 'Complete' : visit.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 truncate mt-0.5">{visit.frameworkName}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm text-gray-900">{visit.date}</div>
                    <div className="text-xs text-gray-400">{visit.duration} min</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
