import { describe, expect, it } from 'vitest';
import { HealthController } from './health.controller.js';

describe('public API health route', () => {
  it('returns an ok status payload', () => {
    expect(new HealthController().getHealth()).toEqual({ status: 'ok' });
  });
});
