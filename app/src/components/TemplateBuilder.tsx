'use client';

import { useCallback, useMemo } from 'react';
import { safeJsonKey } from '@/lib/prompt-sanitizer';
import {
  validateTemplateStructure,
  countTemplateItems,
  type TemplateStructure,
  type TemplateSection,
} from '@/lib/template-schema';
import SectionEditor from './template-builder/SectionEditor';

function generateSectionId(): string {
  return `sec-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

interface TemplateBuilderProps {
  structure: TemplateStructure;
  onChange: (structure: TemplateStructure) => void;
  errors?: string[];
}

export default function TemplateBuilder({ structure, onChange, errors: externalErrors }: TemplateBuilderProps) {
  // Validate on every render to show live feedback
  const validation = useMemo(() => validateTemplateStructure(structure), [structure]);
  const itemCount = useMemo(() => countTemplateItems(structure), [structure]);
  const allErrors = useMemo(() => {
    const errs = [...(externalErrors || []), ...validation.errors];
    return [...new Set(errs)];
  }, [externalErrors, validation.errors]);

  const updateSection = useCallback(
    (sectionIndex: number, updated: TemplateSection) => {
      const newSections = [...structure.sections];
      newSections[sectionIndex] = updated;
      onChange({ ...structure, sections: newSections });
    },
    [structure, onChange],
  );

  const moveSection = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= structure.sections.length) return;
      const newSections = [...structure.sections];
      const [moved] = newSections.splice(from, 1);
      newSections.splice(to, 0, moved);
      const reordered = newSections.map((s, i) => ({ ...s, order: i }));
      onChange({ ...structure, sections: reordered });
    },
    [structure, onChange],
  );

  const deleteSection = useCallback(
    (sectionIndex: number) => {
      const newSections = structure.sections
        .filter((_, i) => i !== sectionIndex)
        .map((s, i) => ({ ...s, order: i }));
      onChange({ ...structure, sections: newSections });
    },
    [structure, onChange],
  );

  const addSection = useCallback(() => {
    const label = `New Section ${structure.sections.length + 1}`;
    const newSection: TemplateSection = {
      id: generateSectionId(),
      key: safeJsonKey(label).substring(0, 50),
      label,
      order: structure.sections.length,
      required: false,
      hidden: false,
      items: [],
    };
    onChange({ ...structure, sections: [...structure.sections, newSection] });
  }, [structure, onChange]);

  // Build per-section and per-item error maps from validation errors
  const { sectionErrors, itemErrors } = useMemo(() => {
    const sErrs: Record<string, string> = {};
    const iErrs: Record<string, Record<string, string>> = {};

    for (const err of validation.errors) {
      // Try matching section-level errors
      const sectionMatch = err.match(/section (?:ID|key|label): "([^"]+)"/i);
      if (sectionMatch) {
        const section = structure.sections.find(
          (s) => s.id === sectionMatch[1] || s.key === sectionMatch[1] || s.label === sectionMatch[1],
        );
        if (section) sErrs[section.id] = err;
      }

      // Try matching item-level errors
      const itemMatch = err.match(/item (?:ID|key|label) "([^"]+)" in section "([^"]+)"/i);
      if (itemMatch) {
        const section = structure.sections.find((s) => s.label === itemMatch[2]);
        if (section) {
          if (!iErrs[section.id]) iErrs[section.id] = {};
          const item = section.items.find(
            (it) => it.id === itemMatch[1] || it.key === itemMatch[1] || it.label === itemMatch[1],
          );
          if (item) iErrs[section.id][item.id] = err;
        }
      }
    }

    return { sectionErrors: sErrs, itemErrors: iErrs };
  }, [validation.errors, structure.sections]);

  return (
    <div className="space-y-4">
      {/* Error banner */}
      {allErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-sm font-medium text-red-800 mb-1">Validation Issues</p>
          <ul className="text-xs text-red-700 space-y-0.5">
            {allErrors.map((err, i) => (
              <li key={i}>- {err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Stats bar */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{structure.sections.length} section{structure.sections.length !== 1 ? 's' : ''}</span>
        <span>{itemCount} visible item{itemCount !== 1 ? 's' : ''} / 200 max</span>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {structure.sections
          .sort((a, b) => a.order - b.order)
          .map((section, i) => (
            <SectionEditor
              key={section.id}
              section={section}
              index={i}
              totalSections={structure.sections.length}
              onChange={(updated) => updateSection(i, updated)}
              onMoveUp={() => moveSection(i, i - 1)}
              onMoveDown={() => moveSection(i, i + 1)}
              onDelete={() => deleteSection(i)}
              sectionError={sectionErrors[section.id]}
              itemErrors={itemErrors[section.id]}
            />
          ))}
      </div>

      {/* Add section button */}
      <button
        type="button"
        onClick={addSection}
        disabled={structure.sections.length >= 30}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-[#0d9488] hover:text-[#0d9488] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        + Add Section
      </button>
    </div>
  );
}
