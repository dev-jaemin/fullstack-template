import { randomUUID } from 'node:crypto';
import { OrderSchema, type Order } from '../contract/index.js';

export function createOrderFixture(overrides: Partial<Order> = {}): Order {
  return OrderSchema.parse({
    id: randomUUID(),
    productId: 'a2f4eb4b-1c25-4d1c-9f90-bca1a44b0a01',
    productName: '오후의 숲 스테이',
    roomName: '느티나무 전망실',
    guestName: '김도윤',
    guestCount: 2,
    nights: 2,
    totalPrice: 296000,
    status: 'pending',
    createdAt: new Date('2026-07-18T01:00:00.000Z').toISOString(),
    ...overrides,
  });
}
