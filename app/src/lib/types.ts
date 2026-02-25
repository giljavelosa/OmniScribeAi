export interface Framework {
  id: string;
  domain: 'medical' | 'rehabilitation' | 'behavioral_health';
  type: string;
  subtype: string;
  name: string;
  description: string;
  sections: FrameworkSection[];
  regulatorySources: string[];
  itemCount: number;
}

export interface FrameworkSection {
  id: string;
  title: string;
  items: string[];
  required: boolean;
}

export interface Visit {
  id: string;
  patientName: string;
  providerType: string;
  frameworkId: string;
  frameworkName: string;
  domain: string;
  date: string;
  duration: number;
  status: 'recording' | 'processing' | 'complete' | 'draft';
  transcript: string;
  note: NoteSection[];
  summary: string;
  templateId?: string | null;
  templateSnapshotJson?: unknown | null;
}

export interface NoteSection {
  id: string;
  title: string;
  content: string;
  feedback?: 'up' | 'down' | null;
}

export type ProviderType = 'MD' | 'DO' | 'PA-C' | 'NP' | 'PT' | 'OT' | 'SLP' | 'LCSW' | 'PhD' | 'PsyD';

export type Domain = 'medical' | 'rehabilitation' | 'behavioral_health';

// ─── Note Template Types ──────────────────────────────────

export interface NoteTemplateSummary {
  id: string;
  name: string;
  description: string | null;
  domain: string;
  noteFormat: string;
  subtype: string | null;
  sourceType: 'system' | 'user';
  sourceFrameworkId: string | null;
  ownerUserId: string | null;
  visibility: 'private' | 'organization' | null;  // null for system
  organizationId: string | null;
  itemCount: number;
  version: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteTemplateDetail extends NoteTemplateSummary {
  structureJson: unknown;  // TemplateStructure (validated by zod at runtime)
}
