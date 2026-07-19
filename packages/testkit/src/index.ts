import { expect } from 'vitest';
import type { z } from 'zod';

export function expectSchema<TOutput>(schema: z.ZodType<TOutput>, value: unknown): TOutput {
  const result = schema.safeParse(value);
  expect(result.success).toBe(true);
  if (!result.success) {
    throw new Error(result.error.message);
  }
  return result.data;
}
