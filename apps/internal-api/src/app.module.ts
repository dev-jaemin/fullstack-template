import { Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import { OrderProxyController } from './order-proxy.controller.js';

@Module({ controllers: [HealthController, OrderProxyController] })
export class AppModule {}
