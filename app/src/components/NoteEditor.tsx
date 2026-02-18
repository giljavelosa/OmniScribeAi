'use client';

import { useState, useRef, useEffect } from 'react';
import { NoteSection } from '@/lib/types';

interface MissingItem {
  item: string;
  section: string;
  category: 'critical' | 'required' | 'recommended';
  emrProvided?: boolean;
  description?: string;
}

interface VisitMeta {
  patientName?: string;
  date?: string;
  providerType?: string;
  frameworkName?: string;
  duration?: number; // seconds
  complianceGrade?: string;
  complianceScore?: number;
  complianceDocumented?: number;
  complianceTotal?: number;
  amendments?: any[];
}

interface NoteEditorProps {
  sections: NoteSection[];
  onUpdate?: (sections: NoteSection[]) => void;
  readOnly?: boolean;
  missingItems?: MissingItem[];
  visitMeta?: VisitMeta;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded" title="Copy section">
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
      )}
    </button>
  );
}

function FeedbackButtons({ feedback, onChange }: { feedback?: 'up' | 'down' | null; onChange: (val: 'up' | 'down' | null) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(feedback === 'up' ? null : 'up')} className={`p-1 rounded transition-colors ${feedback === 'up' ? 'text-[#0d9488]' : 'text-gray-300 hover:text-gray-500'}`} title="Good output">
        <svg width="14" height="14" viewBox="0 0 24 24" fill={feedback === 'up' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
      </button>
      <button onClick={() => onChange(feedback === 'down' ? null : 'down')} className={`p-1 rounded transition-colors ${feedback === 'down' ? 'text-red-500' : 'text-gray-300 hover:text-gray-500'}`} title="Needs improvement">
        <svg width="14" height="14" viewBox="0 0 24 24" fill={feedback === 'down' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>
      </button>
    </div>
  );
}

// Get priority of a blank line based on compliance
function getBlankPriority(line: string, sectionTitle: string, missingItems: MissingItem[]): 'critical' | 'required' | null {
  if (!line.includes('___')) return null;
  if (!missingItems || missingItems.length === 0) return null;

  const lineLower = line.toLowerCase();
  for (const item of missingItems) {
    if (item.category === 'recommended' || item.emrProvided) continue;
    const itemLower = item.item.toLowerCase();
    const itemBase = itemLower.split('(')[0].trim();
    if (lineLower.includes(itemLower) || lineLower.includes(itemBase)) {
      return item.category as 'critical' | 'required';
    }
  }
  return null;
}

function renderMarkdown(text: string, sectionTitle: string, missingItems?: MissingItem[]): string {
  const lines = text.split('\n');
  const coloredLines: string[] = [];

  for (const line of lines) {
    let processed = line;
    if (line.includes('___') && missingItems && missingItems.length > 0) {
      const priority = getBlankPriority(line, sectionTitle, missingItems);
      if (priority === 'critical') {
        // Red background strip for critical blanks
        processed = `<div class="bg-red-50 border-l-3 border-red-400 pl-2 py-0.5 my-0.5 rounded-r">${line.replace(/___/g, '<span class="text-red-600 font-semibold">___</span>')}</div>`;
      } else if (priority === 'required') {
        // Orange left-border for required blanks
        processed = `<div class="bg-orange-50 border-l-3 border-orange-400 pl-2 py-0.5 my-0.5 rounded-r">${line.replace(/___/g, '<span class="text-orange-500 font-semibold">___</span>')}</div>`;
      } else {
        // Non-important blanks — hide them (don't render)
        continue;
      }
    }
    coloredLines.push(processed);
  }

  let html = coloredLines.join('\n')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');

  // Table rendering
  if (html.includes('|')) {
    const tlines = html.split('<br/>');
    let inTable = false;
    let tableHtml = '';
    const processed: string[] = [];
    for (const line of tlines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        if (trimmed.replace(/[|\-\s]/g, '') === '') continue;
        const cells = trimmed.split('|').filter(c => c.trim() !== '');
        if (!inTable) {
          inTable = true;
          tableHtml = '<table class="w-full text-sm border-collapse my-2"><thead><tr>';
          cells.forEach(c => { tableHtml += `<th class="border border-gray-200 px-3 py-1.5 bg-gray-50 text-left font-medium text-gray-700">${c.trim()}</th>`; });
          tableHtml += '</tr></thead><tbody>';
        } else {
          tableHtml += '<tr>';
          cells.forEach(c => { tableHtml += `<td class="border border-gray-200 px-3 py-1.5 text-gray-600">${c.trim()}</td>`; });
          tableHtml += '</tr>';
        }
      } else {
        if (inTable) { tableHtml += '</tbody></table>'; processed.push(tableHtml); inTable = false; tableHtml = ''; }
        processed.push(line);
      }
    }
    if (inTable) { tableHtml += '</tbody></table>'; processed.push(tableHtml); }
    html = processed.join('<br/>');
  }

  html = html.replace(/(^|<br\/>)\s*- /g, '$1• ');
  return `<p>${html}</p>`;
}

// Action Banner — shows encounter-specific missing items as a checklist
function ActionBanner({ missingItems, sections }: { missingItems: MissingItem[]; sections: NoteSection[] }) {
  const [collapsed, setCollapsed] = useState(false);

  // Filter: only encounter-specific items (not emrProvided), only critical + required
  const actionable = missingItems.filter(m => !m.emrProvided && (m.category === 'critical' || m.category === 'required'));
  const critical = actionable.filter(m => m.category === 'critical');
  const required = actionable.filter(m => m.category === 'required');

  if (actionable.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
        <span className="text-green-600 text-lg">✅</span>
        <div>
          <p className="text-sm font-semibold text-green-800">Ready to sign</p>
          <p className="text-xs text-green-600">All encounter-specific requirements documented</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200 hover:from-red-100 hover:to-orange-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">
              {actionable.length} item{actionable.length !== 1 ? 's' : ''} needed before signing
            </p>
            <p className="text-xs text-gray-500">
              {critical.length > 0 && <span className="text-red-600 font-medium">{critical.length} critical</span>}
              {critical.length > 0 && required.length > 0 && ' · '}
              {required.length > 0 && <span className="text-orange-500 font-medium">{required.length} required</span>}
            </p>
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${collapsed ? '' : 'rotate-180'}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {!collapsed && (
        <div className="p-3 space-y-1 max-h-64 overflow-y-auto">
          {critical.map((item, i) => (
            <div key={`c-${i}`} className="flex items-start gap-2 py-1.5 px-2 bg-red-50 rounded-lg">
              <span className="text-red-500 mt-0.5 text-xs font-bold shrink-0">●</span>
              <div>
                <p className="text-sm font-medium text-red-800">{item.item}</p>
                <p className="text-xs text-red-500">{item.section} — {item.description || 'Required for reimbursement'}</p>
              </div>
            </div>
          ))}
          {required.map((item, i) => (
            <div key={`r-${i}`} className="flex items-start gap-2 py-1.5 px-2 bg-orange-50 rounded-lg">
              <span className="text-orange-400 mt-0.5 text-xs font-bold shrink-0">●</span>
              <div>
                <p className="text-sm font-medium text-orange-800">{item.item}</p>
                <p className="text-xs text-orange-500">{item.section} — {item.description || 'Strengthens claim'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NoteEditor({ sections, onUpdate, readOnly, missingItems, visitMeta }: NoteEditorProps) {
  const [localSections, setLocalSections] = useState<NoteSection[]>(sections);
  const editRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Sync when sections prop changes (e.g., after regeneration)
  useEffect(() => {
    setLocalSections(sections);
  }, [sections]);

  const handleFeedback = (sectionId: string, val: 'up' | 'down' | null) => {
    const updated = localSections.map(s =>
      s.id === sectionId ? { ...s, feedback: val } : s
    );
    setLocalSections(updated);
    onUpdate?.(updated);
  };

  const handleBlur = (sectionId: string) => {
    const el = editRefs.current[sectionId];
    if (!el) return;
    const updated = localSections.map(s =>
      s.id === sectionId ? { ...s, content: el.innerText } : s
    );
    setLocalSections(updated);
    onUpdate?.(updated);
  };

  // Filter encounter-specific missing items
  const encounterMissing = missingItems?.filter(m => !m.emrProvided) || [];
  const actionableCount = encounterMissing.filter(m => m.category === 'critical' || m.category === 'required').length;

  // Copy All: header + sections + amendments
  const copyAll = async () => {
    // Build header
    const headerLines: string[] = [];
    headerLines.push('CLINICAL NOTE');
    headerLines.push('─'.repeat(50));
    if (visitMeta?.patientName) {
      headerLines.push(`Patient: ${visitMeta.patientName}`);
    }
    if (visitMeta?.date) {
      try {
        const d = new Date(visitMeta.date);
        headerLines.push(`Date: ${d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`);
      } catch { headerLines.push(`Date: ${visitMeta.date}`); }
    }
    if (visitMeta?.providerType) {
      headerLines.push(`Provider: ${visitMeta.providerType}`);
    }
    if (visitMeta?.frameworkName) {
      headerLines.push(`Framework: ${visitMeta.frameworkName}`);
    }
    if (visitMeta?.duration) {
      headerLines.push(`Duration: ${Math.round(visitMeta.duration / 60)} min`);
    }
    if (visitMeta?.complianceGrade && visitMeta?.complianceScore != null) {
      headerLines.push(`CMS Compliance: ${visitMeta.complianceGrade} (${visitMeta.complianceScore}%) — ${visitMeta.complianceDocumented || 0}/${visitMeta.complianceTotal || 0} items documented`);
    }
    headerLines.push('─'.repeat(50));

    // Build sections
    const sectionText = localSections
      .map(s => {
        const lines = s.content.split('\n').filter(line => {
          const trimmed = line.trim();
          if (!trimmed) return false;
          if (!trimmed.includes('___')) return true;
          const priority = getBlankPriority(line, s.title, encounterMissing);
          return priority === 'critical' || priority === 'required';
        });
        if (lines.length === 0) return null;
        return `${s.title}\n${'='.repeat(s.title.length)}\n${lines.join('\n')}`;
      })
      .filter(Boolean)
      .join('\n\n');

    // Build amendments section
    let amendmentText = '';
    if (visitMeta?.amendments && visitMeta.amendments.length > 0) {
      amendmentText = '\n\n' + '─'.repeat(50) + '\nAMENDMENTS\n' + '─'.repeat(50);
      for (const a of visitMeta.amendments) {
        const ts = a.timestamp ? new Date(a.timestamp).toLocaleString() : 'Unknown date';
        amendmentText += `\n\nAmendment — ${ts}`;
        amendmentText += `\nBy: ${a.authorName || 'Unknown'}`;
        amendmentText += `\nReason: ${a.reason}`;
        if (a.changes) {
          for (const c of a.changes) {
            amendmentText += `\nSection: ${c.section}`;
            amendmentText += `\n  Previous: ${(c.oldContent || '').substring(0, 200)}${(c.oldContent || '').length > 200 ? '...' : ''}`;
            amendmentText += `\n  Amended:  ${(c.newContent || '').substring(0, 200)}${(c.newContent || '').length > 200 ? '...' : ''}`;
          }
        }
      }
    }

    // Signature line
    const signatureLine = '\n\n' + '─'.repeat(50) + '\nClinician Signature / Date: ________________________\n';

    const fullText = headerLines.join('\n') + '\n\n' + sectionText + amendmentText + signatureLine;
    await navigator.clipboard.writeText(fullText);
  };

  const [allCopied, setAllCopied] = useState(false);
  const handleCopyAll = async () => {
    await copyAll();
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Action Banner */}
      {missingItems && missingItems.length > 0 && (
        <ActionBanner missingItems={encounterMissing} sections={localSections} />
      )}

      {/* Copy All button */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Copy note to clipboard"
        >
          {allCopied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              Copy All
            </>
          )}
        </button>
      </div>

      {localSections.map((section) => (
        <div key={section.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-[#1e3a5f] text-sm">{section.title}</h3>
            <div className="flex items-center gap-2">
              <FeedbackButtons feedback={section.feedback} onChange={(val) => handleFeedback(section.id, val)} />
              <div className="w-px h-4 bg-gray-200" />
              <CopyButton text={`${section.title}\n${section.content}`} />
            </div>
          </div>
          <div
            ref={(el) => { editRefs.current[section.id] = el; }}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onBlur={() => handleBlur(section.id)}
            className="p-4 text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:ring-inset min-h-[60px]"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content, section.title, encounterMissing) }}
          />
        </div>
      ))}
    </div>
  );
}
