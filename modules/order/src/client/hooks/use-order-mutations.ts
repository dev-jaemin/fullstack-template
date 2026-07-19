import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateOrderInput, UpdateOrderStatusInput } from '../../contract/index.js';
import { createOrder, updateOrderStatus } from '../api/order.api.js';
import { orderKeys } from '../queries/order.keys.js';

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => createOrder(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });
}
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateOrderStatusInput }) =>
      updateOrderStatus(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });
}
