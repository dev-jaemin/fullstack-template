import { createProductFixture } from '@repo/product/testing';
import { ProductListResponseSchema, ProductQuerySchema } from '@repo/product/contract';
import { createOrderFixture } from '@repo/order/testing';
import { OrderListResponseSchema } from '@repo/order/contract';

const apiOrigin = process.env['API_ORIGIN'] ?? 'http://localhost:3000';
const [command, ...args] = process.argv.slice(2);

function readArg(name: string): string | undefined {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

async function fetchOrFallback<T>(
  url: string,
  schema: { parse: (value: unknown) => T },
  fallback: T,
): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) return fallback;
    return schema.parse(await response.json());
  } catch {
    return fallback;
  }
}

async function main(): Promise<void> {
  if (command === 'products:list') {
    const search = readArg('--search');
    const query = ProductQuerySchema.parse(search ? { search } : {});
    const params = query.search ? `?search=${encodeURIComponent(query.search)}` : '';
    const fallback = { data: [createProductFixture()], total: 1 };
    const result = await fetchOrFallback(
      `${apiOrigin}/api/products${params}`,
      ProductListResponseSchema,
      fallback,
    );
    for (const product of result.data)
      console.log(`${product.name} · ${product.city} · ₩${product.pricePerNight.toLocaleString()}`);
    return;
  }
  if (command === 'orders:list') {
    const fallback = { data: [createOrderFixture()], total: 1 };
    const result = await fetchOrFallback(
      `${apiOrigin}/api/orders`,
      OrderListResponseSchema,
      fallback,
    );
    for (const order of result.data)
      console.log(
        `${order.id.slice(0, 8)} · ${order.guestName} · ${order.status} · ${order.productName}`,
      );
    return;
  }
  console.log('사용법: bun run cli products:list [--search 키워드] | orders:list');
}

void main();
