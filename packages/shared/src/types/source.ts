import type { RouteData } from './quote.js';

/** A successful response from a single source during multi-source query. */
export interface SourceResponse {
  /** Adapter name, e.g. "1inch", "okx-aggregator". */
  source: string;
  /** Expected output in smallest unit as decimal string. */
  expectedOutput: string;
  /** Human-readable expected output. */
  expectedOutputFormatted: string;
  /** Route details from this source. */
  route: RouteData;
  /** Gas estimate in native token's smallest unit as decimal string. */
  gasEstimate: string;
  /** Price impact in basis points. */
  priceImpactBps: number;
  /** Latency for this specific query in milliseconds. */
  latencyMs: number;
  /** Unix timestamp (seconds) when this quote was fetched. */
  fetchedAt: number;
}

/** A failed source during multi-source query. */
export interface SourceFailure {
  /** Adapter name that failed. */
  source: string;
  /** Error message or reason for failure. */
  error: string;
  /** Unix timestamp (seconds) when the failure occurred. */
  failedAt: number;
}

/** Aggregated results from the multi-source query pipeline. */
export interface MultiSourceQueryResult {
  /** All sources that were queried (for the record). */
  queriedSources: string[];
  /** Successful responses. */
  successful: SourceResponse[];
  /** Failed sources. */
  failed: SourceFailure[];
  /** Unix timestamp (seconds) when the query batch started. */
  queryStartedAt: number;
  /** Unix timestamp (seconds) when the query batch completed. */
  queryCompletedAt: number;
  /** Total wall-clock time for the parallel query in milliseconds. */
  totalQueryDurationMs: number;
}
