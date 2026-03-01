import { describe, expect, it } from 'vitest';
import { fail, ok } from '../../src/lib/api-contract';

describe('api-contract helpers', () => {
  it('ok() wraps success payload in canonical envelope', async () => {
    const response = ok({ patients: [] });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({
      success: true,
      data: { patients: [] },
      meta: {
        timestamp: expect.any(String),
      },
    });
  });

  it('fail() wraps error payload in canonical envelope', async () => {
    const response = fail('PATIENT_VALIDATION_FAILED', 'Patient identifier is required', 400);

    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body).toEqual({
      success: false,
      error: {
        code: 'PATIENT_VALIDATION_FAILED',
        message: 'Patient identifier is required',
        retryable: false,
        details: {},
      },
      meta: {
        timestamp: expect.any(String),
      },
    });
  });
});
