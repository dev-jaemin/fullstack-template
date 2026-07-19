import { z } from 'zod';

export const ProductCategorySchema = z.enum(['hotel', 'resort', 'pension', 'camping']);
export const ProductStatusSchema = z.enum(['active', 'inactive']);

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  city: z.string().min(1),
  category: ProductCategorySchema,
  description: z.string().min(1),
  pricePerNight: z.number().int().positive(),
  rating: z.number().min(0).max(5),
  status: ProductStatusSchema,
  accent: z.string().min(1),
});

export const ProductQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: ProductCategorySchema.optional(),
  status: ProductStatusSchema.optional(),
});

export const ProductListResponseSchema = z.object({
  data: z.array(ProductSchema),
  total: z.number().int().nonnegative(),
});
export const ProductResponseSchema = z.object({ data: ProductSchema });
export const ProductErrorSchema = z.object({ code: z.string(), message: z.string() });

export type Product = z.infer<typeof ProductSchema>;
export type ProductCategory = z.infer<typeof ProductCategorySchema>;
export type ProductQuery = z.infer<typeof ProductQuerySchema>;
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
