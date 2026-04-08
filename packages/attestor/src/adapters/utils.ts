import { createHmac } from 'node:crypto';
import type { QuoteRequest, QuoteResponse, BaseAdapter, AdapterRateLimit } from '@bench/shared';

/** Execute a promise with a timeout. Rejects with a descriptive error on timeout. */
export function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label}: timeout after ${ms}ms`)), ms);
    promise.then(
      (val) => { clearTimeout(timer); resolve(val); },
      (err) => { clearTimeout(timer); reject(err); },
    );
  });
}

/** Retry a function with exponential backoff. */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  baseDelayMs: number = 500,
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries) {
        await sleep(baseDelayMs * Math.pow(2, attempt));
      }
    }
  }
  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Shared helper to build a simple adapter with common patterns. */
export function createSimpleAdapter(config: {
  name: string;
  displayName: string;
  supportedChains: readonly number[];
  rateLimit: AdapterRateLimit;
  requiresApiKey: boolean;
  fetchQuote: (req: QuoteRequest) => Promise<QuoteResponse>;
}): BaseAdapter {
  return {
    name: config.name,
    displayName: config.displayName,
    supportedChains: config.supportedChains,
    rateLimit: config.rateLimit,
    requiresApiKey: config.requiresApiKey,
    supportsChain(chainId: number): boolean {
      return this.supportedChains.includes(chainId);
    },
    getQuote: config.fetchQuote,
  };
}

/** Format raw token amount to human-readable string given decimals. */
export function formatUnits(amount: string, decimals: number): string {
  const str = amount.padStart(decimals + 1, '0');
  const intPart = str.slice(0, str.length - decimals) || '0';
  const fracPart = str.slice(str.length - decimals);
  const trimmed = fracPart.replace(/0+$/, '');
  return trimmed ? `${intPart}.${trimmed}` : intPart;
}

/** Create OKX HMAC-SHA256 signature headers. */
export function signOKXRequest(
  method: string,
  path: string,
  body: string,
): Record<string, string> {
  const timestamp = new Date().toISOString();
  const secretKey = process.env['OKX_SECRET_KEY'] ?? '';
  const passphrase = process.env['OKX_PASSPHRASE'] ?? '';
  const apiKey = process.env['OKX_API_KEY'] ?? '';
  const projectId = process.env['OKX_PROJECT_ID'] ?? '';

  const prehash = timestamp + method.toUpperCase() + path + body;
  const signature = createHmac('sha256', secretKey).update(prehash).digest('base64');

  return {
    'OK-ACCESS-KEY': apiKey,
    'OK-ACCESS-SIGN': signature,
    'OK-ACCESS-TIMESTAMP': timestamp,
    'OK-ACCESS-PASSPHRASE': passphrase,
    'OK-ACCESS-PROJECT': projectId,
    'Content-Type': 'application/json',
  };
}

/** Standard empty route for adapters that don't return route details. */
export const EMPTY_ROUTE = { hops: [], summary: '' } as const;
