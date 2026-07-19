import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { OrderListResponseSchema, OrderResponseSchema } from '../../contract/index.js';
import { OrderService } from '../services/order.service.js';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  list(@Query() query: Record<string, string | undefined>) {
    return OrderListResponseSchema.parse(this.orderService.list(query));
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return OrderResponseSchema.parse({ data: this.orderService.getById(id) });
  }

  @Post()
  create(@Body() body: unknown) {
    return OrderResponseSchema.parse({ data: this.orderService.create(body) });
  }

  @Patch(':id/status')
  updateStatus(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: unknown) {
    return OrderResponseSchema.parse({ data: this.orderService.updateStatus(id, body) });
  }
}
