import { describe, expect, it } from 'vitest';
import { InMemoryDatabase } from './index.js';

type TestRecord = { id: string; value: string };

describe('InMemoryDatabase', () => {
  it('supports isolated insert, lookup, and update operations', () => {
    const database = new InMemoryDatabase<TestRecord>([{ id: 'seed', value: 'initial' }]);

    database.insert({ id: 'new', value: 'created' });
    database.update({ id: 'seed', value: 'updated' });

    expect(database.findById('new')).toEqual({ id: 'new', value: 'created' });
    expect(database.findById('seed')).toEqual({ id: 'seed', value: 'updated' });
    expect(database.findAll()).toHaveLength(2);
  });
});
