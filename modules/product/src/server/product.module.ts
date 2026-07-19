import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller.js';
import { ProductRepository } from './repositories/product.repository.js';
import { ProductService } from './services/product.service.js';

@Module({
  controllers: [ProductController],
  providers: [ProductRepository, ProductService],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
