import { createProductFixture } from '@repo/product/testing';
import { ProductQuerySchema, ProductSchema, type ProductQuery } from '@repo/product/contract';
import { z } from 'zod';

type ToolDefinition<TInput extends z.ZodType, TOutput extends z.ZodType> = {
  input: TInput;
  output: TOutput;
  run: (input: z.infer<TInput>) => Promise<z.infer<TOutput>>;
};
const ProductSearchOutputSchema = z.object({ products: z.array(ProductSchema) });
const productSearch: ToolDefinition<typeof ProductQuerySchema, typeof ProductSearchOutputSchema> = {
  input: ProductQuerySchema,
  output: ProductSearchOutputSchema,
  run(input: ProductQuery) {
    const products = [
      createProductFixture(),
      createProductFixture({ name: '구름 결 스테이', city: '속초', accent: 'forest' }),
    ].filter(
      (product) => !input.search || `${product.name} ${product.city}`.includes(input.search),
    );
    return Promise.resolve({ products });
  },
};

export const toolRegistry = { 'product:search': productSearch };

export async function runTool(name: keyof typeof toolRegistry, rawInput: unknown) {
  const tool = toolRegistry[name];
  const input = tool.input.parse(rawInput);
  return tool.output.parse(await tool.run(input));
}
