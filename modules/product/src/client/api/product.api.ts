import {
  ProductListResponseSchema,
  ProductResponseSchema,
  type ProductQuery,
} from '../../contract/index.js';

const apiOrigin = '';

export async function fetchProducts(query: ProductQuery = {}) {
  const params = new URLSearchParams();
  if (query.search) params.set('search', query.search);
  if (query.category) params.set('category', query.category);
  if (query.status) params.set('status', query.status);
  const response = await fetch(`${apiOrigin}/api/products?${params.toString()}`);
  if (!response.ok) throw new Error('상품 목록을 불러오지 못했습니다.');
  return ProductListResponseSchema.parse(await response.json());
}

export async function fetchProduct(id: string) {
  const response = await fetch(`${apiOrigin}/api/products/${id}`);
  if (!response.ok) throw new Error('상품을 불러오지 못했습니다.');
  return ProductResponseSchema.parse(await response.json());
}
