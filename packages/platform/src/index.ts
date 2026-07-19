export const API_ORIGIN = process.env['API_ORIGIN'] ?? 'http://localhost:3000';

export function createRequestUrl(path: string, origin = API_ORIGIN): string {
  return new URL(path, origin).toString();
}

export async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const body: unknown = await response.json();

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return body as T;
}

export class InMemoryDatabase<TEntity extends { id: string }> {
  private readonly records = new Map<string, TEntity>();

  constructor(seed: readonly TEntity[] = []) {
    for (const record of seed) this.records.set(record.id, { ...record });
  }

  findAll(): TEntity[] {
    return [...this.records.values()].map((record) => ({ ...record }));
  }

  findById(id: string): TEntity | undefined {
    const record = this.records.get(id);
    return record ? { ...record } : undefined;
  }

  insert(record: TEntity): TEntity {
    if (this.records.has(record.id)) throw new Error(`Record already exists: ${record.id}`);
    this.records.set(record.id, { ...record });
    return { ...record };
  }

  update(record: TEntity): TEntity {
    if (!this.records.has(record.id)) throw new Error(`Record not found: ${record.id}`);
    this.records.set(record.id, { ...record });
    return { ...record };
  }
}
