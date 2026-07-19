import { afterEach, describe, expect, it, vi } from 'vitest';
import { OrderProxyController } from './order-proxy.controller.js';

describe('OrderProxyController', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('reads the public API order store for the admin app', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [],
          total: 0,
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await new OrderProxyController().list({ status: 'pending' });

    expect(response).toEqual({ data: [], total: 0 });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/orders?status=pending',
      undefined,
    );
  });
});
