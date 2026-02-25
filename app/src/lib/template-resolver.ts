/**
 * Template Resolver — resolves system frameworks and user templates
 * with visibility/authz checks.
 *
 * System templates are resolved from frameworks.ts (no DB hit).
 * User templates are resolved from the NoteTemplate DB table.
 *
 * CRITICAL: This function MUST NOT silently fall back.
 * If resolution fails, it throws TemplateResolutionError.
 */

import { frameworks } from './frameworks';
import { prisma } from './db';
import {
  TemplateStructureSchema,
  validateTemplateStructure,
  templateStructureToFrameworkSections,
  frameworkSectionsToTemplateStructure,
  countTemplateItems,
  type TemplateStructure,
  type TemplateSnapshot,
  type NoteFormat,
  type Discipline,
} from './template-schema';

// ─── Error Class ──────────────────────────────────────────

export type TemplateResolutionErrorCode =
  | 'TEMPLATE_NOT_FOUND'
  | 'TEMPLATE_ARCHIVED'
  | 'TEMPLATE_INVALID_STRUCTURE'
  | 'TEMPLATE_FORBIDDEN'
  | 'FRAMEWORK_NOT_FOUND'
  | 'NO_TEMPLATE_SPECIFIED';

export class TemplateResolutionError extends Error {
  code: TemplateResolutionErrorCode;
  constructor(message: string, code: TemplateResolutionErrorCode) {
    super(message);
    this.name = 'TemplateResolutionError';
    this.code = code;
  }
}

// ─── Resolved Template Interface ──────────────────────────

export interface ResolvedTemplate {
  id: string;
  name: string;
  domain: string;
  type: string;
  subtype: string;
  structure: TemplateStructure;
  frameworkSections: Array<{ id: string; title: string; items: string[]; required: boolean }>;
  sourceType: 'system' | 'user';
  sourceFrameworkId: string | null;
  visibility: 'private' | 'organization' | null;
  itemCount: number;
  version: number;
}

/**
 * Get the effective frameworkId for Visit persistence.
 * - System templates: the framework ID
 * - User templates cloned from system: the sourceFrameworkId
 * - Fully custom: 'custom'
 */
export function effectiveFrameworkId(resolved: ResolvedTemplate): string {
  if (resolved.sourceType === 'system') return resolved.id;
  return resolved.sourceFrameworkId || 'custom';
}

/**
 * Build a TemplateSnapshot from a resolved template.
 */
export function buildSnapshot(resolved: ResolvedTemplate): TemplateSnapshot {
  return {
    templateId: resolved.sourceType === 'user' ? resolved.id : null,
    sourceFrameworkId: resolved.sourceFrameworkId,
    version: resolved.version,
    structure: resolved.structure,
    resolvedAt: new Date().toISOString(),
  };
}

// ─── Main Resolver ────────────────────────────────────────

/**
 * Resolve a template by templateId or frameworkId.
 *
 * Priority: templateId > frameworkId.
 * Never returns null/default — throws on failure.
 */
export async function resolveTemplate(params: {
  templateId?: string;
  frameworkId?: string;
  userId: string;
  userOrgId?: string | null;
}): Promise<ResolvedTemplate> {
  const { templateId, frameworkId, userId, userOrgId } = params;

  // Route 1: templateId provided — resolve from DB
  if (templateId) {
    return resolveUserTemplate(templateId, userId, userOrgId ?? null);
  }

  // Route 2: frameworkId provided — resolve from frameworks.ts
  if (frameworkId) {
    return resolveSystemFramework(frameworkId);
  }

  throw new TemplateResolutionError(
    'Either templateId or frameworkId must be provided',
    'NO_TEMPLATE_SPECIFIED',
  );
}

// ─── System Framework Resolution ──────────────────────────

function resolveSystemFramework(frameworkId: string): ResolvedTemplate {
  const framework = frameworks.find(f => f.id === frameworkId);
  if (!framework) {
    throw new TemplateResolutionError(
      `Unknown framework: ${frameworkId}`,
      'FRAMEWORK_NOT_FOUND',
    );
  }

  // Determine format type from framework type
  const formatType = inferFormatType(framework.type);
  const discipline = framework.domain as Discipline;

  const structure = frameworkSectionsToTemplateStructure(
    framework.sections,
    formatType,
    discipline,
  );

  return {
    id: framework.id,
    name: framework.name,
    domain: framework.domain,
    type: framework.type,
    subtype: framework.subtype,
    structure,
    frameworkSections: framework.sections,
    sourceType: 'system',
    sourceFrameworkId: framework.id,
    visibility: null,
    itemCount: framework.itemCount,
    version: 1,
  };
}

// ─── User Template Resolution ─────────────────────────────

async function resolveUserTemplate(
  templateId: string,
  userId: string,
  userOrgId: string | null,
): Promise<ResolvedTemplate> {
  const dbTemplate = await prisma.noteTemplate.findUnique({
    where: { id: templateId },
  });

  if (!dbTemplate) {
    throw new TemplateResolutionError(
      `Template not found: ${templateId}`,
      'TEMPLATE_NOT_FOUND',
    );
  }

  if (dbTemplate.isArchived) {
    throw new TemplateResolutionError(
      `Template is archived: ${templateId}`,
      'TEMPLATE_ARCHIVED',
    );
  }

  // Visibility/authz check
  checkVisibility(dbTemplate, userId, userOrgId);

  // Validate structure from DB (defense-in-depth)
  const parseResult = TemplateStructureSchema.safeParse(dbTemplate.structureJson);
  if (!parseResult.success) {
    throw new TemplateResolutionError(
      `Template structure is invalid: ${parseResult.error.message}`,
      'TEMPLATE_INVALID_STRUCTURE',
    );
  }

  const structure = parseResult.data;
  const deepValidation = validateTemplateStructure(structure);
  if (!deepValidation.valid) {
    throw new TemplateResolutionError(
      `Template structure validation failed: ${deepValidation.errors.join('; ')}`,
      'TEMPLATE_INVALID_STRUCTURE',
    );
  }

  const frameworkSections = templateStructureToFrameworkSections(structure);

  return {
    id: dbTemplate.id,
    name: dbTemplate.name,
    domain: dbTemplate.domain,
    type: dbTemplate.noteFormat,
    subtype: dbTemplate.subtype || '',
    structure,
    frameworkSections,
    sourceType: 'user',
    sourceFrameworkId: dbTemplate.sourceFrameworkId,
    visibility: dbTemplate.visibility as 'private' | 'organization',
    itemCount: countTemplateItems(structure),
    version: dbTemplate.version,
  };
}

// ─── Visibility Check ─────────────────────────────────────

function checkVisibility(
  template: { ownerUserId: string | null; visibility: string; organizationId: string | null },
  userId: string,
  userOrgId: string | null,
): void {
  // Owner always has access
  if (template.ownerUserId === userId) return;

  // Organization-visible: same org has access
  if (
    template.visibility === 'organization' &&
    template.organizationId &&
    userOrgId &&
    template.organizationId === userOrgId
  ) {
    return;
  }

  // Private template, not owner → forbidden
  // Org template, different org → forbidden
  // Note: admin bypass is handled at the API route level, not here
  throw new TemplateResolutionError(
    `Access denied to template: ${template.ownerUserId ? 'not owner' : 'system template'}`,
    'TEMPLATE_FORBIDDEN',
  );
}

// ─── Helpers ──────────────────────────────────────────────

function inferFormatType(frameworkType: string): NoteFormat {
  const lower = frameworkType.toLowerCase();
  if (lower.includes('soap')) return 'SOAP';
  if (lower.includes('dap')) return 'DAP';
  if (lower.includes('h&p') || lower.includes('history')) return 'H&P';
  if (lower.includes('evaluation') || lower.includes('eval') || lower.includes('intake')) return 'eval';
  if (lower.includes('narrative') || lower.includes('discharge') || lower.includes('progress')) return 'narrative';
  return 'custom';
}
