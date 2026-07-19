import { Module } from '@nestjs/common';
import { OrderModule } from '@repo/order/server';
import { ProductModule } from '@repo/product/server';
import { HealthController } from './health.controller.js';

@Module({ controllers: [HealthController], imports: [ProductModule, OrderModule] })
export class AppModule {}
