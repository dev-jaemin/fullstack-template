import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Product } from '@repo/product/contract';
import { App } from './app';

const { createOrderMock } = vi.hoisted(() => ({ createOrderMock: vi.fn() }));

vi.mock('@repo/product/client', () => ({
  useProducts: () => ({
    data: { data: [productFixture], total: 1 },
    isError: false,
    isLoading: false,
    refetch: vi.fn(),
  }),
}));

vi.mock('@repo/order/client', () => ({
  useCreateOrder: () => ({
    isError: false,
    isPending: false,
    mutateAsync: createOrderMock,
  }),
}));

const productFixture: Product = {
  id: 'a2f4eb4b-1c25-4d1c-9f90-bca1a44b0a01',
  name: '오후의 숲 스테이',
  city: '강릉',
  category: 'pension',
  description: '가상의 숙소 fixture입니다.',
  pricePerNight: 148000,
  rating: 4.8,
  status: 'active',
  accent: 'lagoon',
};

describe('web home flow', () => {
  beforeEach(() => {
    createOrderMock.mockReset();
    createOrderMock.mockResolvedValue({ data: productFixture });
  });

  it('홈 화면에서 상품 목록과 예약 CTA를 보여준다', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: '쉬어갈 곳을 찾는 가장 가벼운 방법' }),
    ).toBeInTheDocument();
    expect(screen.getByText(productFixture.name)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /예약하기/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '예약 관리' })).toHaveAttribute(
      'href',
      'http://localhost:5174',
    );
  });

  it('예약자명을 입력하면 예약 요청 payload에 포함한다', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /예약하기/ }));
    await user.type(screen.getByRole('textbox', { name: '예약자명' }), '홍길동');
    await user.click(screen.getByRole('button', { name: '예약 요청 보내기' }));

    expect(screen.queryByText('예약자명을 입력해주세요.')).not.toBeInTheDocument();
    expect(createOrderMock).toHaveBeenCalledWith(
      expect.objectContaining({ guestName: '홍길동', productId: productFixture.id }),
    );
  });

  it('예약자명이 비어 있으면 제출하지 않고 validation message를 보여준다', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /예약하기/ }));
    await user.click(screen.getByRole('button', { name: '예약 요청 보내기' }));

    expect(screen.getByText('예약자명을 입력해주세요.')).toBeInTheDocument();
    expect(createOrderMock).not.toHaveBeenCalled();
  });
});
