import type { QuoteRequest, QuoteResponse } from './quote.js';

/** Rate limit configuration for an adapter. */
export interface AdapterRateLimit {
  /** Maximum sustained requests per second. */
  requestsPerSecond: number;
  /** Maximum burst capacity above sustained rate. */
  burstCapacity: number;
}

/** Common interface every source adapter implements. */
export interface BaseAdapter {
  /** Unique machine-readable name, e.g. "1inch", "okx-aggregator". */
  readonly name: string;
  /** Human-readable display name, e.g. "1inch Pathfinder". */
  readonly displayName: string;
  /** Chain IDs this adapter supports. */
  readonly supportedChains: readonly number[];
  /** Rate limit constraints for this adapter's API. */
  readonly rateLimit: AdapterRateLimit;
  /** Whether this adapter requires an API key. */
  readonly requiresApiKey: boolean;

  /** Check if this adapter supports the given chain. */
  supportsChain(chainId: number): boolean;

  /** Fetch a quote for the given swap request. Throws on failure. */
  getQuote(req: QuoteRequest): Promise<QuoteResponse>;
}
