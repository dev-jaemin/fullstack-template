import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import {
  CreateOrderInputSchema,
  OrderListResponseSchema,
  OrderQuerySchema,
  OrderResponseSchema,
  UpdateOrderStatusInputSchema,
} from '@repo/order/contract';
import { createRequestUrl, requestJson } from '@repo/platform';

const publicApiOrigin = process.env['PUBLIC_API_ORIGIN'] ?? 'http://localhost:3000';

function orderPath(query: Record<string, string | undefined>): string {
  const parsedQuery = OrderQuerySchema.parse(query);
  const params = new URLSearchParams();
  if (parsedQuery.status) params.set('status', parsedQuery.status);
  const suffix = params.toString();
  return `/api/orders${suffix ? `?${suffix}` : ''}`;
}

@Controller('orders')
export class OrderProxyController {
  @Get()
  async list(@Query() query: Record<string, string | undefined>) {
    const response = await requestJson<unknown>(
      createRequestUrl(orderPath(query), publicApiOrigin),
    );
    return OrderListResponseSchema.parse(response);
  }

  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const response = await requestJson<unknown>(
      createRequestUrl(`/api/orders/${id}`, publicApiOrigin),
    );
    return OrderResponseSchema.parse(response);
  }

  @Post()
  async create(@Body() body: unknown) {
    const input = CreateOrderInputSchema.parse(body);
    const response = await requestJson<unknown>(createRequestUrl('/api/orders', publicApiOrigin), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    });
    return OrderResponseSchema.parse(response);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: unknown) {
    const input = UpdateOrderStatusInputSchema.parse(body);
    const response = await requestJson<unknown>(
      createRequestUrl(`/api/orders/${id}/status`, publicApiOrigin),
      {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input),
      },
    );
    return OrderResponseSchema.parse(response);
  }
}
