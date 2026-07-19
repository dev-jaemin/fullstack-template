import { Module } from '@nestjs/common';
import { OrderModule } from '@repo/order/server';
import { HealthController } from './health.controller.js';

@Module({ controllers: [HealthController], imports: [OrderModule] })
export class AppModule {}
