import type { QuoteRequest, SourceResponse, SourceFailure, MultiSourceQueryResult, SwapType } from '@bench/shared';
import { ADAPTER_TIMEOUT_MS, ADAPTER_MAX_RETRIES } from '@bench/shared';
import { selectAdapters, withTimeout, withRetry } from '../adapters/index.js';

/**
 * Query all relevant adapters in parallel for a given swap request.
 *
 * Returns successful responses + failures. Does NOT compute consensus.
 * That's a separate step so it can be tested independently.
 */
export async function queryAllSources(
  req: QuoteRequest,
  swapType: SwapType,
  timeoutMs: number = ADAPTER_TIMEOUT_MS,
  maxRetries: number = ADAPTER_MAX_RETRIES,
): Promise<MultiSourceQueryResult> {
  const adapters = selectAdapters(swapType, req.chainId);
  const queryStartedAt = Math.floor(Date.now() / 1000);
  const startMs = Date.now();

  const results = await Promise.allSettled(
    adapters.map(async (adapter) => {
      try {
        const response = await withRetry(
          () => withTimeout(adapter.getQuote(req), timeoutMs, adapter.name),
          maxRetries,
          300,
        );
        return {
          status: 'success' as const,
          source: adapter.name,
          response,
        };
      } catch (error) {
        return {
          status: 'failed' as const,
          source: adapter.name,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }),
  );

  const successful: SourceResponse[] = [];
  const failed: SourceFailure[] = [];
  const queriedSources: string[] = adapters.map((a) => a.name);
  const now = Math.floor(Date.now() / 1000);

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const inner = result.value;
      if (inner.status === 'success') {
        successful.push({
          source: inner.source,
          ...inner.response,
          fetchedAt: now,
        });
      } else {
        failed.push({
          source: inner.source,
          error: inner.error,
          failedAt: now,
        });
      }
    }
  }

  return {
    queriedSources,
    successful,
    failed,
    queryStartedAt,
    queryCompletedAt: Math.floor(Date.now() / 1000),
    totalQueryDurationMs: Date.now() - startMs,
  };
}
