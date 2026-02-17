'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { frameworks, getDomainColor, getDomainLabel } from '@/lib/frameworks';
import { Framework, Domain } from '@/lib/types';

export default function FrameworksPage() {
  const [selectedDomain, setSelectedDomain] = useState<Domain | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = selectedDomain === 'all'
    ? frameworks
    : frameworks.filter(f => f.domain === selectedDomain);

  const domainCounts = {
    all: frameworks.length,
    medical: frameworks.filter(f => f.domain === 'medical').length,
    rehabilitation: frameworks.filter(f => f.domain === 'rehabilitation').length,
    behavioral_health: frameworks.filter(f => f.domain === 'behavioral_health').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Clinical Frameworks</h1>
            <p className="text-gray-500">Browse all evidence-based documentation frameworks. Each one is built from regulatory sources and professional guidelines.</p>
          </div>

          {/* Domain filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'all' as const, label: 'All Frameworks' },
              { id: 'medical' as const, label: 'Medical' },
              { id: 'rehabilitation' as const, label: 'Rehabilitation' },
              { id: 'behavioral_health' as const, label: 'Behavioral Health' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDomain(d.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDomain === d.id
                    ? 'bg-[#1e3a5f] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {d.label}
                <span className={`ml-1.5 text-xs ${selectedDomain === d.id ? 'text-white/70' : 'text-gray-400'}`}>
                  ({domainCounts[d.id]})
                </span>
              </button>
            ))}
          </div>

          {/* Framework grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((fw) => (
              <FrameworkCard
                key={fw.id}
                framework={fw}
                expanded={expandedId === fw.id}
                onToggle={() => setExpandedId(expandedId === fw.id ? null : fw.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function FrameworkCard({ framework, expanded, onToggle }: { framework: Framework; expanded: boolean; onToggle: () => void }) {
  const color = getDomainColor(framework.domain);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white uppercase tracking-wide"
              style={{ backgroundColor: color }}
            >
              {getDomainLabel(framework.domain)}
            </span>
          </div>
          <div className="text-xs text-gray-400 font-medium">{framework.itemCount} items</div>
        </div>
        <h3 className="font-bold text-gray-900 mb-1.5">{framework.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-3">{framework.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {framework.regulatorySources.map((src) => (
            <span key={src} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
              {src}
            </span>
          ))}
        </div>
        <button
          onClick={onToggle}
          className="text-sm text-[#0d9488] hover:text-[#0f766e] font-medium flex items-center gap-1 transition-colors"
        >
          {expanded ? 'Hide' : 'Preview'} structure
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-5">
          <div className="space-y-3">
            {framework.sections.map((section) => (
              <div key={section.id}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm font-semibold text-gray-900">{section.title}</span>
                  {!section.required && (
                    <span className="text-[10px] text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">Optional</span>
                  )}
                </div>
                <div className="ml-4 flex flex-wrap gap-1">
                  {section.items.map((item) => (
                    <span key={item} className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200">
            <Link
              href="/visit/new"
              className="text-sm font-medium text-white px-4 py-2 rounded-lg transition-colors inline-block"
              style={{ backgroundColor: color }}
            >
              Use this framework →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
