'use client';

import { useState, useCallback } from 'react';
import { safeJsonKey } from '@/lib/prompt-sanitizer';
import type { TemplateSection, TemplateItem } from '@/lib/template-schema';
import ItemEditor from './ItemEditor';

function generateItemId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

interface SectionEditorProps {
  section: TemplateSection;
  index: number;
  totalSections: number;
  onChange: (section: TemplateSection) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  itemErrors?: Record<string, string>;
  sectionError?: string;
}

export default function SectionEditor({
  section,
  index,
  totalSections,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  itemErrors,
  sectionError,
}: SectionEditorProps) {
  const [collapsed, setCollapsed] = useState(false);

  const updateSection = useCallback(
    (updates: Partial<TemplateSection>) => {
      const updated = { ...section, ...updates };
      // Auto-sync key from label
      if (updates.label !== undefined) {
        updated.key = safeJsonKey(updates.label).substring(0, 50) || section.key;
      }
      onChange(updated);
    },
    [section, onChange],
  );

  const updateItem = useCallback(
    (itemIndex: number, updatedItem: TemplateItem) => {
      const newItems = [...section.items];
      newItems[itemIndex] = updatedItem;
      onChange({ ...section, items: newItems });
    },
    [section, onChange],
  );

  const moveItem = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= section.items.length) return;
      const newItems = [...section.items];
      const [moved] = newItems.splice(from, 1);
      newItems.splice(to, 0, moved);
      // Re-number order fields
      const reordered = newItems.map((item, i) => ({ ...item, order: i }));
      onChange({ ...section, items: reordered });
    },
    [section, onChange],
  );

  const deleteItem = useCallback(
    (itemIndex: number) => {
      const newItems = section.items.filter((_, i) => i !== itemIndex).map((item, i) => ({ ...item, order: i }));
      onChange({ ...section, items: newItems });
    },
    [section, onChange],
  );

  const addItem = useCallback(() => {
    const newItem: TemplateItem = {
      id: generateItemId(),
      key: `new_item_${section.items.length}`,
      label: '',
      order: section.items.length,
      required: false,
      hidden: false,
    };
    onChange({ ...section, items: [...section.items, newItem] });
  }, [section, onChange]);

  return (
    <div className={`border rounded-xl overflow-hidden ${sectionError ? 'border-red-300' : 'border-gray-200'}`}>
      {/* Section header */}
      <div className="bg-gray-50 px-4 py-3 flex items-center gap-2">
        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488]/50 rounded"
          title={collapsed ? 'Expand section' : 'Collapse section'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform ${collapsed ? '' : 'rotate-90'}`}
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Section label (inline edit) */}
        <input
          type="text"
          value={section.label}
          onChange={(e) => updateSection({ label: e.target.value })}
          placeholder="Section name"
          maxLength={200}
          className="flex-1 px-2 py-1 border border-transparent rounded text-sm font-medium text-gray-900 bg-transparent hover:border-gray-300 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30"
        />

        {/* Item count badge */}
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {section.items.length} item{section.items.length !== 1 ? 's' : ''}
        </span>

        {/* Section toggles */}
        <label className="flex items-center gap-1 text-xs cursor-pointer whitespace-nowrap">
          <input
            type="checkbox"
            checked={section.required}
            onChange={(e) => updateSection({ required: e.target.checked })}
            className="rounded border-gray-300 text-[#0d9488] focus:ring-[#0d9488]"
          />
          <span className="text-gray-500">Required</span>
        </label>
        <label className="flex items-center gap-1 text-xs cursor-pointer whitespace-nowrap">
          <input
            type="checkbox"
            checked={section.hidden}
            onChange={(e) => updateSection({ hidden: e.target.checked })}
            className="rounded border-gray-300 text-[#0d9488] focus:ring-[#0d9488]"
          />
          <span className="text-gray-500">Hidden</span>
        </label>

        {/* Move/Delete actions */}
        <div className="flex items-center gap-0.5 ml-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            title="Move section up"
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488]/50 rounded"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === totalSections - 1}
            title="Move section down"
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488]/50 rounded"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Delete section"
            className="p-1 text-gray-400 hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 rounded"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {sectionError && (
        <div className="px-4 py-1.5 bg-red-50 text-xs text-red-600">{sectionError}</div>
      )}

      {/* Section key read-only */}
      {!collapsed && (
        <div className="px-4 pt-2 text-xs text-gray-400">
          Key: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">{section.key}</code>
        </div>
      )}

      {/* Items list */}
      {!collapsed && (
        <div className="p-4 space-y-2">
          {section.items.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No items yet. Add one below.
            </p>
          )}
          {section.items
            .sort((a, b) => a.order - b.order)
            .map((item, i) => (
              <ItemEditor
                key={item.id}
                item={item}
                index={i}
                totalItems={section.items.length}
                onChange={(updated) => updateItem(i, updated)}
                onMoveUp={() => moveItem(i, i - 1)}
                onMoveDown={() => moveItem(i, i + 1)}
                onDelete={() => deleteItem(i)}
                error={itemErrors?.[item.id]}
              />
            ))}

          <button
            type="button"
            onClick={addItem}
            aria-label={`Add item to ${section.label}`}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#0d9488] hover:text-[#0d9488] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488]/50 focus-visible:border-[#0d9488]"
          >
            + Add Item
          </button>
        </div>
      )}
    </div>
  );
}
