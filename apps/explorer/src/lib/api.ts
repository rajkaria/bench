/**
 * Server-side API client for the Bench Explorer.
 * Uses BENCH_API_URL (set at deploy time) for server components.
 * Falls back to demo data when the API is unreachable.
 */

const API_URL = process.env['BENCH_API_URL'] ?? process.env['NEXT_PUBLIC_API_URL'] ?? '';

export async function fetchApi<T>(path: string, fallback: T): Promise<T> {
  if (!API_URL) return fallback;
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
