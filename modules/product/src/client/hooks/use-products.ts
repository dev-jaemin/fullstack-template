import { useQuery } from '@tanstack/react-query';
import type { ProductQuery } from '../../contract/index.js';
import { fetchProducts } from '../api/product.api.js';
import { productKeys } from '../queries/product.keys.js';

export function useProducts(query: ProductQuery = {}) {
  return useQuery({ queryKey: productKeys.list(query), queryFn: () => fetchProducts(query) });
}
