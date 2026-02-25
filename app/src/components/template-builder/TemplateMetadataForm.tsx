'use client';

import { getDomainLabel } from '@/lib/frameworks';

const DOMAINS = ['medical', 'rehabilitation', 'behavioral_health'] as const;
const NOTE_FORMATS = ['SOAP', 'DAP', 'narrative', 'H&P', 'eval', 'custom'] as const;
const VISIBILITY_OPTIONS = ['private', 'organization'] as const;

export interface TemplateMetadata {
  name: string;
  description: string;
  domain: string;
  noteFormat: string;
  subtype: string;
  visibility: 'private' | 'organization';
}

interface TemplateMetadataFormProps {
  value: TemplateMetadata;
  onChange: (value: TemplateMetadata) => void;
  errors?: Partial<Record<keyof TemplateMetadata, string>>;
  disabled?: boolean;
}

export default function TemplateMetadataForm({
  value,
  onChange,
  errors,
  disabled = false,
}: TemplateMetadataFormProps) {
  function update<K extends keyof TemplateMetadata>(field: K, fieldValue: TemplateMetadata[K]) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Template Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={value.name}
          onChange={(e) => update('name', e.target.value)}
          disabled={disabled}
          maxLength={200}
          placeholder="e.g., My SOAP Follow-Up Template"
          className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] disabled:bg-gray-100 disabled:text-gray-500 ${
            errors?.name ? 'border-red-400' : 'border-gray-300'
          }`}
        />
        {errors?.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={value.description}
          onChange={(e) => update('description', e.target.value)}
          disabled={disabled}
          maxLength={500}
          rows={2}
          placeholder="Brief description of this template's purpose"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] disabled:bg-gray-100 disabled:text-gray-500 resize-none"
        />
      </div>

      {/* Domain + Note Format row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Domain <span className="text-red-500">*</span>
          </label>
          <select
            value={value.domain}
            onChange={(e) => update('domain', e.target.value)}
            disabled={disabled}
            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] bg-white disabled:bg-gray-100 disabled:text-gray-500 ${
              errors?.domain ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            <option value="">Select domain...</option>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>{getDomainLabel(d)}</option>
            ))}
          </select>
          {errors?.domain && <p className="mt-1 text-xs text-red-600">{errors.domain}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note Format <span className="text-red-500">*</span>
          </label>
          <select
            value={value.noteFormat}
            onChange={(e) => update('noteFormat', e.target.value)}
            disabled={disabled}
            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] bg-white disabled:bg-gray-100 disabled:text-gray-500 ${
              errors?.noteFormat ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            <option value="">Select format...</option>
            {NOTE_FORMATS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          {errors?.noteFormat && <p className="mt-1 text-xs text-red-600">{errors.noteFormat}</p>}
        </div>
      </div>

      {/* Subtype + Visibility row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtype</label>
          <input
            type="text"
            value={value.subtype}
            onChange={(e) => update('subtype', e.target.value)}
            disabled={disabled}
            maxLength={100}
            placeholder="e.g., Follow-Up Visit"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
          <select
            value={value.visibility}
            onChange={(e) => update('visibility', e.target.value as 'private' | 'organization')}
            disabled={disabled}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] bg-white disabled:bg-gray-100 disabled:text-gray-500"
          >
            {VISIBILITY_OPTIONS.map((v) => (
              <option key={v} value={v}>{v === 'private' ? 'Private (only you)' : 'Organization'}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
