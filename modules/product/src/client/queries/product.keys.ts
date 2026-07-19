import type { ProductQuery } from '../../contract/index.js';

export const productKeys = {
  all: ['products'] as const,
  list: (query: ProductQuery) => [...productKeys.all, 'list', query] as const,
};
