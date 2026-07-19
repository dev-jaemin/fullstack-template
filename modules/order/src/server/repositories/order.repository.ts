import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { OrderSchema, type Order, type OrderStatus } from '../../contract/index.js';
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
  constructor(private readonly storePath?: string) {
    if (storePath) this.ensureStore();
  }

  private readonly orders = [...seedOrders];

  private ensureStore(): void {
    if (!this.storePath) return;
    try {
      readFileSync(this.storePath, 'utf8');
    } catch {
      this.writeOrders(seedOrders);
    }
  }

  private readOrders(): Order[] {
    if (!this.storePath) return this.orders.map((order) => ({ ...order }));
    try {
      const parsed: unknown = JSON.parse(readFileSync(this.storePath, 'utf8'));
      return OrderSchema.array().parse(parsed);
    } catch {
      this.writeOrders(seedOrders);
      return seedOrders.map((order) => ({ ...order }));
    }
  }

  private writeOrders(orders: Order[]): void {
    if (!this.storePath) return;
    mkdirSync(dirname(this.storePath), { recursive: true });
    const temporaryPath = `${this.storePath}.${process.pid}.tmp`;
    writeFileSync(temporaryPath, JSON.stringify(orders, null, 2));
    renameSync(temporaryPath, this.storePath);
  }

  findAll(status?: OrderStatus): Order[] {
    return this.readOrders()
      .filter((order) => !status || order.status === status)
      .map((order) => ({ ...order }));
  }
  findById(id: string): Order | undefined {
    const order = this.readOrders().find((current) => current.id === id);
    return order ? { ...order } : undefined;
  }
  save(order: Order): Order {
    const orders = this.readOrders();
    orders.push(order);
    this.writeOrders(orders);
    return { ...order };
  }
  update(order: Order): Order {
    const orders = this.readOrders();
    const index = orders.findIndex((current) => current.id === order.id);
    if (index < 0) throw new Error('Order not found');
    orders[index] = order;
    this.writeOrders(orders);
    return { ...order };
  }
}
