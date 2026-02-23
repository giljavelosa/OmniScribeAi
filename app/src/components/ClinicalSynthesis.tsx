'use client';

import { useState, useEffect } from 'react';

interface ClinicalSynthesisData {
  clinical_impression: string;
  problem_list: string[];
  severity_assessment: string;
  rehab_potential: string;
  recommended_focus: string[];
  reasoning_notes: string;
}

interface ClinicalSynthesisProps {
  synthesis: ClinicalSynthesisData;
  onUpdate?: (synthesis: ClinicalSynthesisData) => void;
  onRegenerateNote?: (synthesis: ClinicalSynthesisData) => void;
  regenerating?: boolean;
}

function getRehabLevel(text: string): 'good' | 'fair' | 'poor' | 'unknown' {
  const lower = text.toLowerCase();
  if (lower.includes('good') || lower.includes('excellent') || lower.includes('high')) return 'good';
  if (lower.includes('fair') || lower.includes('moderate') || lower.includes('guarded')) return 'fair';
  if (lower.includes('poor') || lower.includes('low') || lower.includes('limited')) return 'poor';
  return 'unknown';
}

const rehabColors = {
  good: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-500', label: 'Good' },
  fair: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Fair' },
  poor: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500', label: 'Poor' },
  unknown: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', dot: 'bg-gray-400', label: '—' },
};

function EditableText({ value, onChange, multiline = false, className = '' }: {
  value: string; onChange: (v: string) => void; multiline?: boolean; className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => { setDraft(value); }, [value]);

  if (!editing) {
    return (
      <div
        onClick={() => setEditing(true)}
        className={`cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 -mx-2 -my-1 transition-colors group ${className}`}
        title="Click to edit"
      >
        <span>{value}</span>
        <span className="ml-2 text-gray-300 group-hover:text-gray-400 text-xs">✏️</span>
      </div>
    );
  }

  const save = () => { setEditing(false); onChange(draft); };

  return multiline ? (
    <textarea
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => { if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
      autoFocus
      rows={3}
      className={`w-full px-3 py-2 border border-[#0d9488] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 resize-y ${className}`}
    />
  ) : (
    <input
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
      autoFocus
      className={`w-full px-3 py-2 border border-[#0d9488] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 ${className}`}
    />
  );
}

function EditableList({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState('');

  const startEdit = (i: number) => { setEditIdx(i); setDraft(items[i]); };
  const save = () => {
    if (editIdx === null) return;
    const updated = [...items];
    if (draft.trim() === '') { updated.splice(editIdx, 1); } else { updated[editIdx] = draft; }
    onChange(updated);
    setEditIdx(null);
  };
  const addItem = () => { onChange([...items, 'New item — click to edit']); };
  const removeItem = (i: number) => { onChange(items.filter((_, idx) => idx !== i)); };

  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 group">
          <span className="text-[#0d9488] font-semibold text-sm mt-0.5 shrink-0">{i + 1}.</span>
          {editIdx === i ? (
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={save}
              onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditIdx(null); }}
              autoFocus
              className="flex-1 px-2 py-1 border border-[#0d9488] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30"
            />
          ) : (
            <span
              onClick={() => startEdit(i)}
              className="flex-1 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 rounded px-1 -mx-1 transition-colors"
              title="Click to edit"
            >
              {item}
              <span className="ml-1 text-gray-300 group-hover:text-gray-400 text-xs">✏️</span>
            </span>
          )}
          <button onClick={() => removeItem(i)} className="text-gray-300 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" title="Remove">✕</button>
        </div>
      ))}
      <button onClick={addItem} className="text-xs text-[#0d9488] hover:text-[#0a7c72] font-medium mt-1">+ Add item</button>
    </div>
  );
}

export default function ClinicalSynthesis({ synthesis, onUpdate, onRegenerateNote, regenerating }: ClinicalSynthesisProps) {
  const [local, setLocal] = useState<ClinicalSynthesisData>(synthesis);
  const [dirty, setDirty] = useState(false);
  const [prevSynthesis, setPrevSynthesis] = useState(synthesis);

  // Sync local state when parent prop changes (e.g., after regeneration)
  if (prevSynthesis !== synthesis) {
    setPrevSynthesis(synthesis);
    setLocal(synthesis);
    setDirty(false);
  }

  const update = (field: keyof ClinicalSynthesisData, value: string | string[]) => {
    const updated = { ...local, [field]: value };
    setLocal(updated);
    setDirty(true);
    onUpdate?.(updated);
  };

  const rehabLevel = getRehabLevel(local.rehab_potential);
  const rc = rehabColors[rehabLevel];

  return (
    <div className="space-y-4">
      {/* Clinical Impression — prominent */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-[#1e3a5f] text-white flex items-center justify-between">
          <h3 className="font-semibold text-sm">⚡ Clinical Impression</h3>
          <span className="text-xs text-white/60">Primary diagnosis / assessment</span>
        </div>
        <div className="p-4">
          <EditableText
            value={local.clinical_impression}
            onChange={(v) => update('clinical_impression', v)}
            multiline
            className="text-sm text-gray-700 leading-relaxed"
          />
        </div>
      </div>

      {/* Problem List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-[#1e3a5f] text-sm">Problem List</h3>
        </div>
        <div className="p-4">
          <EditableList items={local.problem_list} onChange={(items) => update('problem_list', items)} />
        </div>
      </div>

      {/* Severity + Rehab Potential side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-[#1e3a5f] text-sm">Severity / Functional Impact</h3>
          </div>
          <div className="p-4">
            <EditableText
              value={local.severity_assessment}
              onChange={(v) => update('severity_assessment', v)}
              multiline
              className="text-sm text-gray-700 leading-relaxed"
            />
          </div>
        </div>

        <div className={`border rounded-xl overflow-hidden ${rc.border}`}>
          <div className={`px-4 py-2.5 border-b ${rc.border} ${rc.bg} flex items-center justify-between`}>
            <h3 className="font-semibold text-[#1e3a5f] text-sm">Rehab Potential</h3>
            <div className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${rc.dot}`} />
              <span className={`text-xs font-semibold ${rc.text}`}>{rc.label}</span>
            </div>
          </div>
          <div className={`p-4 ${rc.bg}`}>
            <EditableText
              value={local.rehab_potential}
              onChange={(v) => update('rehab_potential', v)}
              multiline
              className="text-sm text-gray-700 leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Recommended Focus Areas */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-[#1e3a5f] text-sm">Recommended Focus Areas</h3>
        </div>
        <div className="p-4">
          <EditableList items={local.recommended_focus} onChange={(items) => update('recommended_focus', items)} />
        </div>
      </div>

      {/* Reasoning Notes */}
      {local.reasoning_notes && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Reasoning Chain</h3>
          <EditableText
            value={local.reasoning_notes}
            onChange={(v) => update('reasoning_notes', v)}
            multiline
            className="text-xs text-gray-600 leading-relaxed"
          />
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          ⚡ AI-generated reasoning from documented findings. Edit any field, then regenerate.
        </div>
        {onRegenerateNote && (
          <button
            onClick={() => onRegenerateNote(local)}
            disabled={regenerating || !dirty}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              regenerating
                ? 'bg-purple-100 text-purple-500 cursor-wait'
                : dirty
                  ? 'bg-[#0d9488] text-white hover:bg-[#0a7c72] shadow-sm hover:shadow'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {regenerating ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full" />
                Regenerating...
              </>
            ) : (
              <>🔄 Regenerate Note from Synthesis</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
