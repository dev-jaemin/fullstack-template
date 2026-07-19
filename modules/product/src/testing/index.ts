import { randomUUID } from 'node:crypto';
import { ProductSchema, type Product } from '../contract/index.js';

export function createProductFixture(overrides: Partial<Product> = {}): Product {
  return ProductSchema.parse({
    id: randomUUID(),
    name: '오후의 숲 스테이',
    city: '강릉',
    category: 'pension',
    description: '바다와 숲 사이에서 쉬어가는 작은 숙소입니다.',
    pricePerNight: 148000,
    rating: 4.8,
    status: 'active',
    accent: 'lagoon',
    ...overrides,
  });
}
