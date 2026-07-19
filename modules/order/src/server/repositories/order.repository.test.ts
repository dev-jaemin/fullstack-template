import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createOrderFixture } from '../../testing/index.js';
import { OrderRepository } from './order.repository.js';

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('OrderRepository', () => {
  it('shares persisted orders between repository instances', () => {
    const directory = mkdtempSync(join(tmpdir(), 'stayline-order-'));
    temporaryDirectories.push(directory);
    const storePath = join(directory, 'orders.json');
    const order = createOrderFixture({
      id: 'b3f4eb4b-1c25-4d1c-9f90-bca1a44b0a99',
      guestName: '테스트 예약자',
    });

    new OrderRepository(storePath).save(order);

    expect(new OrderRepository(storePath).findById(order.id)).toEqual(order);
  });
});
