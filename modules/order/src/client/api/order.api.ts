import {
  CreateOrderInputSchema,
  OrderListResponseSchema,
  OrderResponseSchema,
  type CreateOrderInput,
  type OrderQuery,
  UpdateOrderStatusInputSchema,
  type UpdateOrderStatusInput,
} from '../../contract/index.js';

async function parseResponse(response: Response): Promise<unknown> {
  if (!response.ok) throw new Error('예약 요청을 처리하지 못했습니다.');
  const body: unknown = await response.json();
  return body;
}

export async function fetchOrders(query: OrderQuery = {}) {
  const params = new URLSearchParams();
  if (query.status) params.set('status', query.status);
  const response = await fetch(`/api/orders?${params.toString()}`);
  return OrderListResponseSchema.parse(await parseResponse(response));
}

export async function createOrder(input: CreateOrderInput) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(CreateOrderInputSchema.parse(input)),
  });
  return OrderResponseSchema.parse(await parseResponse(response));
}

export async function updateOrderStatus(id: string, input: UpdateOrderStatusInput) {
  const response = await fetch(`/api/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(UpdateOrderStatusInputSchema.parse(input)),
  });
  return OrderResponseSchema.parse(await parseResponse(response));
}
