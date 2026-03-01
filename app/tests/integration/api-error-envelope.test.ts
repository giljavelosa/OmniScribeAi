import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mockAuth = vi.hoisted(() => vi.fn());
const mockAuditLog = vi.hoisted(() => vi.fn());
const mockPrisma = vi.hoisted(() => ({
  user: { findUnique: vi.fn() },
  patient: { findMany: vi.fn(), create: vi.fn() },
  visit: { findMany: vi.fn(), create: vi.fn() },
  noteTemplate: { findMany: vi.fn(), count: vi.fn(), create: vi.fn() },
}));

vi.mock('@/lib/auth', () => ({
  auth: mockAuth,
}));

vi.mock('@/lib/audit', () => ({
  auditLog: mockAuditLog,
}));

vi.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}));

describe('API error envelope integration', () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockAuditLog.mockReset();
    mockPrisma.user.findUnique.mockReset();
    mockPrisma.patient.findMany.mockReset();
    mockPrisma.patient.create.mockReset();
    mockPrisma.visit.findMany.mockReset();
    mockPrisma.visit.create.mockReset();
    mockPrisma.noteTemplate.findMany.mockReset();
    mockPrisma.noteTemplate.count.mockReset();
    mockPrisma.noteTemplate.create.mockReset();
  });

  it('patients GET unauthorized returns AUTH_UNAUTHORIZED envelope', async () => {
    mockAuth.mockResolvedValue(null);
    const { GET } = await import('../../src/app/api/patients/route');

    const response = await GET(new NextRequest('http://localhost/api/patients'));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toMatchObject({ code: 'AUTH_UNAUTHORIZED', message: 'Unauthorized' });
    expect(body.meta.timestamp).toEqual(expect.any(String));
  });

  it('patients POST validation failure returns PATIENT_VALIDATION_FAILED envelope', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user_123', role: 'CLINICIAN' } });
    const { POST } = await import('../../src/app/api/patients/route');

    const response = await POST(new NextRequest('http://localhost/api/patients', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toMatchObject({
      code: 'PATIENT_VALIDATION_FAILED',
      message: 'Patient identifier is required',
    });
  });

  it('patients POST success returns canonical envelope', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user_123', role: 'CLINICIAN' } });
    mockPrisma.patient.create.mockResolvedValue({ id: 'p1', identifier: 'PT-001' });

    const { POST } = await import('../../src/app/api/patients/route');
    const response = await POST(new NextRequest('http://localhost/api/patients', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ identifier: 'PT-001', organizationId: 'org_1' }),
    }));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({
      success: true,
      data: { patient: { id: 'p1', identifier: 'PT-001' } },
      meta: { timestamp: expect.any(String) },
    });
  });

  it('patients GET success returns canonical envelope', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user_123', role: 'CLINICIAN' } });
    mockPrisma.user.findUnique.mockResolvedValue({ organizationId: 'org_1' });
    mockPrisma.patient.findMany.mockResolvedValue([{ id: 'p1', identifier: 'PT-001' }]);

    const { GET } = await import('../../src/app/api/patients/route');
    const response = await GET(new NextRequest('http://localhost/api/patients'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: true,
      data: { patients: [{ id: 'p1', identifier: 'PT-001' }] },
      meta: { timestamp: expect.any(String) },
    });
  });

  it('visits GET unauthorized returns AUTH_UNAUTHORIZED envelope', async () => {
    mockAuth.mockResolvedValue(null);
    const { GET } = await import('../../src/app/api/visits/route');

    const response = await GET(new NextRequest('http://localhost/api/visits'));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toMatchObject({ code: 'AUTH_UNAUTHORIZED', message: 'Unauthorized' });
  });

  it('visits POST validation failure returns VISIT_VALIDATION_FAILED envelope', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user_123', role: 'CLINICIAN' } });
    const { POST } = await import('../../src/app/api/visits/route');

    const response = await POST(new NextRequest('http://localhost/api/visits', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ frameworkId: 'soap-md-general' }),
    }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toMatchObject({
      code: 'VISIT_VALIDATION_FAILED',
      message: 'patientId and frameworkId required',
    });
  });

  it('visits POST success returns canonical envelope', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user_123', role: 'CLINICIAN' } });
    mockPrisma.visit.create.mockResolvedValue({ id: 'v1', patientId: 'p1', frameworkId: 'med-soap-followup' });

    const { POST } = await import('../../src/app/api/visits/route');
    const response = await POST(new NextRequest('http://localhost/api/visits', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ patientId: 'p1', frameworkId: 'med-soap-followup' }),
    }));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({
      success: true,
      data: { visit: { id: 'v1', patientId: 'p1', frameworkId: 'med-soap-followup' } },
      meta: { timestamp: expect.any(String) },
    });
  });

  it('visits GET success returns canonical envelope', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user_123', role: 'CLINICIAN' } });
    mockPrisma.visit.findMany.mockResolvedValue([{ id: 'v1', patientId: 'p1' }]);

    const { GET } = await import('../../src/app/api/visits/route');
    const response = await GET(new NextRequest('http://localhost/api/visits'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: true,
      data: { visits: [{ id: 'v1', patientId: 'p1' }] },
      meta: { timestamp: expect.any(String) },
    });
  });

  it('templates GET unauthorized returns AUTH_UNAUTHORIZED envelope', async () => {
    mockAuth.mockResolvedValue(null);
    const { GET } = await import('../../src/app/api/templates/route');

    const response = await GET(new NextRequest('http://localhost/api/templates'));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toMatchObject({ code: 'AUTH_UNAUTHORIZED', message: 'Unauthorized' });
  });

  it('templates POST validation failure returns TEMPLATE_VALIDATION_FAILED envelope', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user_123', role: 'CLINICIAN' } });
    const { POST } = await import('../../src/app/api/templates/route');

    const response = await POST(new NextRequest('http://localhost/api/templates', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ domain: 'medical', noteFormat: 'SOAP' }),
    }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toMatchObject({
      code: 'TEMPLATE_VALIDATION_FAILED',
      message: 'Name is required',
    });
  });

  it('templates POST success returns canonical envelope', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user_123', role: 'CLINICIAN' } });
    mockPrisma.user.findUnique.mockResolvedValue({ organizationId: 'org_1' });
    mockPrisma.noteTemplate.create.mockResolvedValue({ id: 't1', name: 'My Template' });

    const { POST } = await import('../../src/app/api/templates/route');
    const response = await POST(new NextRequest('http://localhost/api/templates', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'My Template',
        domain: 'medical',
        noteFormat: 'SOAP',
        sourceFrameworkId: 'med-soap-followup',
      }),
    }));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({
      success: true,
      data: { template: { id: 't1', name: 'My Template' } },
      meta: { timestamp: expect.any(String) },
    });
  });

  it('templates GET success returns canonical envelope', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user_123', role: 'CLINICIAN' } });

    const { GET } = await import('../../src/app/api/templates/route');
    const response = await GET(new NextRequest('http://localhost/api/templates?sourceType=system&limit=1'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(body.data.templates)).toBe(true);
    expect(body).toEqual({
      success: true,
      data: {
        templates: expect.any(Array),
        total: expect.any(Number),
      },
      meta: { timestamp: expect.any(String) },
    });
  });
});
