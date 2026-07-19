import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller.js';
import { OrderRepository } from './repositories/order.repository.js';
import { OrderService } from './services/order.service.js';

@Module({
  controllers: [OrderController],
  providers: [OrderRepository, OrderService],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
