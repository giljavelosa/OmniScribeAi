import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mockAuth = vi.hoisted(() => vi.fn());

vi.mock('@/lib/auth', () => ({
  auth: mockAuth,
}));

describe('API error envelope integration', () => {
  beforeEach(() => {
    mockAuth.mockReset();
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
});
