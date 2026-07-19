import type { Product } from '../../contract/index.js';

export function toProductResponse(product: Product): Product {
  return { ...product };
}
