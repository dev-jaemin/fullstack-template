import { InMemoryDatabase } from '@repo/platform';
import type { Order, OrderStatus } from '../../contract/index.js';
import { createOrderFixture } from '../../testing/index.js';

const seedOrders: Order[] = [
  createOrderFixture({
    id: 'b3f4eb4b-1c25-4d1c-9f90-bca1a44b0a01',
    guestName: '김도윤',
    roomName: '느티나무 전망실',
    status: 'pending',
  }),
  createOrderFixture({
    id: 'b3f4eb4b-1c25-4d1c-9f90-bca1a44b0a02',
    productId: 'a2f4eb4b-1c25-4d1c-9f90-bca1a44b0a02',
    productName: '파도선 호텔',
    guestName: '박서연',
    roomName: '블루 코너룸',
    totalPrice: 438000,
    status: 'confirmed',
  }),
  createOrderFixture({
    id: 'b3f4eb4b-1c25-4d1c-9f90-bca1a44b0a03',
    productId: 'a2f4eb4b-1c25-4d1c-9f90-bca1a44b0a03',
    productName: '느린 오후 리조트',
    guestName: '이현우',
    roomName: '오션 테라스',
    totalPrice: 285000,
    status: 'cancelled',
  }),
];

export class OrderRepository {
  private readonly database = new InMemoryDatabase<Order>(seedOrders);

  findAll(status?: OrderStatus): Order[] {
    return this.database
      .findAll()
      .filter((order) => !status || order.status === status)
      .map((order) => ({ ...order }));
  }
  findById(id: string): Order | undefined {
    return this.database.findById(id);
  }
  save(order: Order): Order {
    return this.database.insert(order);
  }
  update(order: Order): Order {
    return this.database.update(order);
  }
}
