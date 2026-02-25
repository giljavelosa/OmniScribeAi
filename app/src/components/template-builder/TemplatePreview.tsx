'use client';

import type { TemplateStructure } from '@/lib/template-schema';
import { templateStructureToFrameworkSections } from '@/lib/template-schema';

interface TemplatePreviewProps {
  structure: TemplateStructure;
}

export default function TemplatePreview({ structure }: TemplatePreviewProps) {
  const sections = templateStructureToFrameworkSections(structure);

  if (sections.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-400">
        No visible sections to preview.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="text-sm font-medium text-gray-600">Template Preview</span>
        <span className="text-xs text-gray-400">
          ({structure.formatType} / {structure.discipline})
        </span>
      </div>

      {sections.map((section) => (
        <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2.5 flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">{section.title}</h4>
            {section.required && (
              <span className="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                Required
              </span>
            )}
          </div>
          {section.items.length > 0 && (
            <ul className="px-4 py-2 divide-y divide-gray-100">
              {section.items.map((itemLabel, i) => (
                <li key={i} className="py-1.5 text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                  {itemLabel}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
