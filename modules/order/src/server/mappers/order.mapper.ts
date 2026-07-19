import type { Order } from '../../contract/index.js';

export function toOrderResponse(order: Order): Order {
  return { ...order };
}
