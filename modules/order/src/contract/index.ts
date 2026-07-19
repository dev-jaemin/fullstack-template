import { z } from 'zod';

export const OrderStatusSchema = z.enum(['pending', 'confirmed', 'cancelled']);
export const OrderSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  productName: z.string().min(1),
  roomName: z.string().min(1),
  guestName: z.string().min(1),
  guestCount: z.number().int().positive(),
  nights: z.number().int().positive(),
  totalPrice: z.number().int().positive(),
  status: OrderStatusSchema,
  createdAt: z.string().datetime(),
});

export const OrderQuerySchema = z.object({ status: OrderStatusSchema.optional() });
export const CreateOrderInputSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string().min(1),
  pricePerNight: z.number().int().positive(),
  guestName: z.string().trim().min(2).max(40),
  guestCount: z.number().int().positive().max(8),
  nights: z.number().int().positive().max(30),
  roomName: z.string().min(1),
});
export const UpdateOrderStatusInputSchema = z.object({
  status: z.enum(['confirmed', 'cancelled']),
});
export const OrderListResponseSchema = z.object({
  data: z.array(OrderSchema),
  total: z.number().int().nonnegative(),
});
export const OrderResponseSchema = z.object({ data: OrderSchema });
export const OrderErrorSchema = z.object({ code: z.string(), message: z.string() });

export type Order = z.infer<typeof OrderSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type OrderQuery = z.infer<typeof OrderQuerySchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusInputSchema>;
