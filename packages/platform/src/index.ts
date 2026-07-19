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
