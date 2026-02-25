'use client';

import { useCallback, useMemo } from 'react';
import { safeJsonKey } from '@/lib/prompt-sanitizer';
import type { TemplateItem } from '@/lib/template-schema';

interface ItemEditorProps {
  item: TemplateItem;
  index: number;
  totalItems: number;
  onChange: (item: TemplateItem) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  error?: string;
}

export default function ItemEditor({
  item,
  index,
  totalItems,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  error,
}: ItemEditorProps) {
  const generatedKey = useMemo(() => safeJsonKey(item.label).substring(0, 100), [item.label]);

  const updateField = useCallback(
    <K extends keyof TemplateItem>(field: K, value: TemplateItem[K]) => {
      const updated = { ...item, [field]: value };
      // Auto-sync key from label
      if (field === 'label' && typeof value === 'string') {
        updated.key = safeJsonKey(value).substring(0, 100) || item.key;
      }
      onChange(updated);
    },
    [item, onChange],
  );

  return (
    <div className={`border rounded-lg p-3 bg-white ${error ? 'border-red-300' : 'border-gray-200'}`}>
      <div className="flex items-start gap-2">
        {/* Move/Delete controls */}
        <div className="flex flex-col gap-0.5 pt-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            title="Move up"
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === totalItems - 1}
            title="Move down"
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </button>
        </div>

        {/* Main fields */}
        <div className="flex-1 space-y-2">
          {/* Label */}
          <input
            type="text"
            value={item.label}
            onChange={(e) => updateField('label', e.target.value)}
            placeholder="Item label"
            maxLength={200}
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488]"
          />

          {/* Key (read-only) */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Key:</span>
            <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">{generatedKey || '—'}</code>
          </div>

          {/* Toggles row */}
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={item.required}
                onChange={(e) => updateField('required', e.target.checked)}
                className="rounded border-gray-300 text-[#0d9488] focus:ring-[#0d9488]"
              />
              <span className="text-gray-600">Required</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={item.hidden}
                onChange={(e) => updateField('hidden', e.target.checked)}
                className="rounded border-gray-300 text-[#0d9488] focus:ring-[#0d9488]"
              />
              <span className="text-gray-600">Hidden</span>
            </label>
          </div>

          {/* Guidance text (collapsible) */}
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
              Advanced options
            </summary>
            <div className="mt-2 space-y-2">
              <div>
                <label className="block text-gray-500 mb-0.5">Guidance Text</label>
                <textarea
                  value={item.guidanceText || ''}
                  onChange={(e) => updateField('guidanceText', e.target.value || undefined)}
                  maxLength={2000}
                  rows={2}
                  placeholder="Instructions for AI generation..."
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] resize-none"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-0.5">Style Hints</label>
                <input
                  type="text"
                  value={item.styleHints || ''}
                  onChange={(e) => updateField('styleHints', e.target.value || undefined)}
                  maxLength={500}
                  placeholder="e.g., bullet list, brief paragraph"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488]"
                />
              </div>
            </div>
          </details>

          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={onDelete}
          title="Remove item"
          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}
