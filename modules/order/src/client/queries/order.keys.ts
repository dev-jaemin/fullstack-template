import type { OrderQuery } from '../../contract/index.js';

export const orderKeys = {
  all: ['orders'] as const,
  list: (query: OrderQuery) => [...orderKeys.all, 'list', query] as const,
};
