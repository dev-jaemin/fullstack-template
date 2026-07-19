import { describe, expect, it } from 'vitest';
import { OrderService } from './order.service.js';
import { OrderRepository } from '../repositories/order.repository.js';

describe('OrderService', () => {
  it('pending 주문을 confirmed로 전환한다', () => {
    const service = new OrderService(new OrderRepository());
    const order = service.list({ status: 'pending' }).data[0];
    if (!order) throw new Error('fixture missing');
    expect(service.updateStatus(order.id, { status: 'confirmed' }).status).toBe('confirmed');
  });

  it('이미 처리된 주문은 다시 전환하지 않는다', () => {
    const service = new OrderService(new OrderRepository());
    const order = service.list({ status: 'confirmed' }).data[0];
    if (!order) throw new Error('fixture missing');
    expect(() => service.updateStatus(order.id, { status: 'cancelled' })).toThrow('Only pending');
  });
});
