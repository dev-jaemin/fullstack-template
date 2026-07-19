import type { Product } from '../../contract/index.js';
import { createProductFixture } from '../../testing/index.js';

const seedProducts: Product[] = [
  createProductFixture({
    id: 'a2f4eb4b-1c25-4d1c-9f90-bca1a44b0a01',
    name: '오후의 숲 스테이',
    city: '강릉',
    category: 'pension',
    pricePerNight: 148000,
    rating: 4.8,
    accent: 'lagoon',
  }),
  createProductFixture({
    id: 'a2f4eb4b-1c25-4d1c-9f90-bca1a44b0a02',
    name: '파도선 호텔',
    city: '부산',
    category: 'hotel',
    pricePerNight: 219000,
    rating: 4.7,
    accent: 'coral',
  }),
  createProductFixture({
    id: 'a2f4eb4b-1c25-4d1c-9f90-bca1a44b0a03',
    name: '느린 오후 리조트',
    city: '제주',
    category: 'resort',
    pricePerNight: 285000,
    rating: 4.9,
    accent: 'sunset',
  }),
  createProductFixture({
    id: 'a2f4eb4b-1c25-4d1c-9f90-bca1a44b0a04',
    name: '별빛 캠프 클럽',
    city: '가평',
    category: 'camping',
    pricePerNight: 99000,
    rating: 4.6,
    accent: 'forest',
  }),
  createProductFixture({
    id: 'a2f4eb4b-1c25-4d1c-9f90-bca1a44b0a05',
    name: '도시의 결 호텔',
    city: '서울',
    category: 'hotel',
    pricePerNight: 178000,
    rating: 4.5,
    accent: 'midnight',
  }),
];

export class ProductRepository {
  private readonly products = [...seedProducts];

  findAll(): Product[] {
    return [...this.products];
  }
  findById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }
}
