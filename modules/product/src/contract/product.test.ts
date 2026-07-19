import { describe, expect, it } from 'vitest';
import { ProductQuerySchema, ProductSchema } from './index.js';
import { createProductFixture } from '../testing/index.js';

describe('product contract', () => {
  it('fixture는 product schema를 통과한다', () => {
    expect(ProductSchema.safeParse(createProductFixture()).success).toBe(true);
  });
  it('빈 검색어를 trim하고 query를 검증한다', () => {
    expect(ProductQuerySchema.parse({ search: ' cabin ' }).search).toBe('cabin');
  });
});
