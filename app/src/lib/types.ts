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
}

export interface NoteSection {
  id: string;
  title: string;
  content: string;
  feedback?: 'up' | 'down' | null;
}

export type ProviderType = 'MD' | 'DO' | 'PA-C' | 'NP' | 'PT' | 'OT' | 'SLP' | 'LCSW' | 'PhD' | 'PsyD';

export type Domain = 'medical' | 'rehabilitation' | 'behavioral_health';
