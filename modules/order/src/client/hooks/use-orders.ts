import { useQuery } from '@tanstack/react-query';
import type { OrderQuery } from '../../contract/index.js';
import { fetchOrders } from '../api/order.api.js';
import { orderKeys } from '../queries/order.keys.js';

export function useOrders(query: OrderQuery = {}) {
  return useQuery({ queryKey: orderKeys.list(query), queryFn: () => fetchOrders(query) });
}
