import { describe, expect, it } from 'vitest';
import { createOrderFixture } from '../../testing/index.js';
import { OrderRepository } from './order.repository.js';

describe('OrderRepository', () => {
  it('keeps new orders in the in-memory database for the process lifetime', () => {
    const repository = new OrderRepository();
    const order = createOrderFixture({
      id: 'b3f4eb4b-1c25-4d1c-9f90-bca1a44b0a99',
      guestName: '테스트 예약자',
    });

    repository.save(order);

    expect(repository.findById(order.id)).toEqual(order);
  });
});
