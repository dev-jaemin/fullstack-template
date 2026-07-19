import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateOrderInputSchema,
  OrderQuerySchema,
  UpdateOrderStatusInputSchema,
  type Order,
} from '../../contract/index.js';
import { toOrderResponse } from '../mappers/order.mapper.js';
import { OrderRepository } from '../repositories/order.repository.js';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  list(rawQuery: unknown): { data: Order[]; total: number } {
    const query = OrderQuerySchema.parse(rawQuery);
    const orders = this.orderRepository.findAll(query.status);
    return { data: orders.map(toOrderResponse), total: orders.length };
  }

  create(rawInput: unknown): Order {
    const input = CreateOrderInputSchema.parse(rawInput);
    const order = toOrderResponse({
      id: crypto.randomUUID(),
      totalPrice: input.nights * input.pricePerNight,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...input,
    });
    return this.orderRepository.save(order);
  }

  updateStatus(id: string, rawInput: unknown): Order {
    const input = UpdateOrderStatusInputSchema.parse(rawInput);
    const order = this.orderRepository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'pending')
      throw new BadRequestException('Only pending orders can change status');
    const updated: Order = { ...order, status: input.status };
    return this.orderRepository.update(updated);
  }

  getById(id: string): Order {
    const order = this.orderRepository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return toOrderResponse(order);
  }
}
