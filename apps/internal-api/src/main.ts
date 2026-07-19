import 'reflect-metadata';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  process.env['ORDER_STORE_PATH'] ??= resolve(process.cwd(), '.data/orders.json');
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });
  app.setGlobalPrefix('api');
  await app.listen(Number(process.env['PORT'] ?? 3001), '0.0.0.0');
}

void bootstrap();
