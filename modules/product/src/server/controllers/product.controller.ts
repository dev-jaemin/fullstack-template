import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductListResponseSchema, ProductResponseSchema } from '../../contract/index.js';
import { ProductService } from '../services/product.service.js';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  list(@Query() query: Record<string, string | undefined>) {
    return ProductListResponseSchema.parse(this.productService.list(query));
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return ProductResponseSchema.parse({ data: this.productService.getById(id) });
  }
}
