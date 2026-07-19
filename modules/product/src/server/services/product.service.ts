import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductQuerySchema, type Product } from '../../contract/index.js';
import { toProductResponse } from '../mappers/product.mapper.js';
import { ProductRepository } from '../repositories/product.repository.js';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  list(rawQuery: unknown): { data: Product[]; total: number } {
    const query = ProductQuerySchema.parse(rawQuery);
    const normalizedSearch = query.search?.toLocaleLowerCase('ko-KR');
    const products = this.productRepository.findAll().filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        `${product.name} ${product.city}`.toLocaleLowerCase('ko-KR').includes(normalizedSearch);
      const matchesCategory = !query.category || product.category === query.category;
      const matchesStatus = !query.status || product.status === query.status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
    return { data: products.map(toProductResponse), total: products.length };
  }

  getById(id: string): Product {
    const product = this.productRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return toProductResponse(product);
  }
}
