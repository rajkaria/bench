import type { QuoteRequest, QuoteResponse } from '@bench/shared';
import { createSimpleAdapter, formatUnits } from './utils.js';

export const kyberAdapter = createSimpleAdapter({
  name: 'kyber',
  displayName: 'KyberSwap',
  supportedChains: [1, 56, 137, 43114, 250, 42161, 10, 8453, 324, 59144, 534352],
  rateLimit: { requestsPerSecond: 5, burstCapacity: 10 },
  requiresApiKey: false,

  async fetchQuote(req: QuoteRequest): Promise<QuoteResponse> {
    const startTime = Date.now();

    const chainSlug = KYBER_CHAIN_SLUGS[req.chainId] ?? 'ethereum';
    const url = `https://aggregator-api.kyberswap.com/${chainSlug}/api/v1/routes`;
    const params = new URLSearchParams({
      tokenIn: req.inputToken,
      tokenOut: req.outputToken,
      amountIn: req.amount,
      saveGas: 'false',
      gasInclude: 'true',
    });

    const response = await fetch(`${url}?${params}`);
    if (!response.ok) throw new Error(`KyberSwap API error: ${response.status}`);

    const data = await response.json();
    const routeData = data.data?.routeSummary;
    if (!routeData) throw new Error('KyberSwap: no route summary');

    return {
      expectedOutput: routeData.amountOut,
      expectedOutputFormatted: formatUnits(routeData.amountOut, parseInt(routeData.tokenOutDecimals ?? '18')),
      route: { hops: [], summary: `via KyberSwap (${routeData.route?.length ?? 0} routes)` },
      gasEstimate: routeData.gas ?? '0',
      priceImpactBps: Math.round((routeData.amountOutUsd && routeData.amountInUsd
        ? (1 - parseFloat(routeData.amountOutUsd) / parseFloat(routeData.amountInUsd)) * 10000
        : 0)),
      latencyMs: Date.now() - startTime,
    };
  },
});

const KYBER_CHAIN_SLUGS: Record<number, string> = {
  1: 'ethereum',
  56: 'bsc',
  137: 'polygon',
  43114: 'avalanche',
  250: 'fantom',
  42161: 'arbitrum',
  10: 'optimism',
  8453: 'base',
  324: 'zksync',
  59144: 'linea',
  534352: 'scroll',
};
