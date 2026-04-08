import type { QuoteRequest, QuoteResponse } from '@bench/shared';
import { createSimpleAdapter, signOKXRequest, formatUnits, EMPTY_ROUTE } from './utils.js';

export const okxAdapter = createSimpleAdapter({
  name: 'okx-aggregator',
  displayName: 'OKX DEX Aggregator',
  supportedChains: [1, 56, 137, 43114, 250, 42161, 10, 8453, 196],
  rateLimit: { requestsPerSecond: 10, burstCapacity: 20 },
  requiresApiKey: true,

  async fetchQuote(req: QuoteRequest): Promise<QuoteResponse> {
    const startTime = Date.now();
    const path = '/api/v5/dex/aggregator/quote';
    const params = new URLSearchParams({
      chainId: req.chainId.toString(),
      fromTokenAddress: req.inputToken,
      toTokenAddress: req.outputToken,
      amount: req.amount,
      slippage: ((req.slippageBps ?? 50) / 10000).toString(),
    });

    const fullPath = `${path}?${params}`;
    const headers = signOKXRequest('GET', fullPath, '');
    const response = await fetch(`https://www.okx.com${fullPath}`, { headers });

    if (!response.ok) throw new Error(`OKX API error: ${response.status}`);

    const data = await response.json();
    if (data.code !== '0' || !data.data?.[0]) {
      throw new Error(`OKX API error: ${data.msg || 'unknown'}`);
    }

    const quote = data.data[0];
    return {
      expectedOutput: quote.toTokenAmount,
      expectedOutputFormatted: formatUnits(quote.toTokenAmount, parseInt(quote.toToken?.decimal ?? '18')),
      route: { hops: [], summary: `via OKX (${quote.dexRouterList?.length ?? 0} routes)` },
      gasEstimate: quote.estimateGasFee ?? '0',
      priceImpactBps: Math.round(parseFloat(quote.priceImpactPercentage ?? '0') * 100),
      latencyMs: Date.now() - startTime,
    };
  },
});
