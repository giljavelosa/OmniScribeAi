'use client';

import type { TemplateStructure } from '@/lib/template-schema';
import { templateStructureToFrameworkSections, countTemplateItems } from '@/lib/template-schema';

interface TemplatePreviewProps {
  structure: TemplateStructure;
}

export default function TemplatePreview({ structure }: TemplatePreviewProps) {
  const sections = templateStructureToFrameworkSections(structure);
  const totalItems = countTemplateItems(structure);

  if (sections.length === 0) {
    return (
      <div className="text-center py-10">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-3">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <p className="text-sm text-gray-400">No visible sections to preview.</p>
        <p className="text-xs text-gray-300 mt-1">All sections may be hidden or the template is empty.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with summary stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="text-sm font-medium text-gray-600">Template Preview</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">{structure.formatType}</span>
          <span>{sections.length} section{sections.length !== 1 ? 's' : ''}</span>
          <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Section cards */}
      {sections.map((section) => (
        <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-900">{section.title}</h4>
              <span className="text-[10px] text-gray-400">{section.items.length} item{section.items.length !== 1 ? 's' : ''}</span>
            </div>
            {section.required && (
              <span className="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                Required
              </span>
            )}
          </div>
          {section.items.length > 0 ? (
            <ul className="px-4 py-2 divide-y divide-gray-100">
              {section.items.map((itemLabel, i) => (
                <li key={i} className="py-1.5 text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                  {itemLabel}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-xs text-gray-400 italic">No items in this section</div>
          )}
        </div>
      ))}
    </div>
  );
}
