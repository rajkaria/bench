import type { QuoteRequest, QuoteResponse } from '@bench/shared';
import { createSimpleAdapter, formatUnits } from './utils.js';

export const oneinchAdapter = createSimpleAdapter({
  name: '1inch',
  displayName: '1inch Pathfinder',
  supportedChains: [1, 56, 137, 43114, 250, 42161, 10, 8453, 100, 324, 1313161554, 8217],
  rateLimit: { requestsPerSecond: 1, burstCapacity: 5 },
  requiresApiKey: true,

  async fetchQuote(req: QuoteRequest): Promise<QuoteResponse> {
    const startTime = Date.now();
    const apiKey = process.env['ONEINCH_API_KEY'];
    if (!apiKey) throw new Error('1inch: ONEINCH_API_KEY not set');

    const url = `https://api.1inch.dev/swap/v6.0/${req.chainId}/quote`;
    const params = new URLSearchParams({
      src: req.inputToken,
      dst: req.outputToken,
      amount: req.amount,
    });

    const response = await fetch(`${url}?${params}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) throw new Error(`1inch API error: ${response.status}`);

    const data = await response.json();
    return {
      expectedOutput: data.dstAmount,
      expectedOutputFormatted: formatUnits(data.dstAmount, parseInt(data.dstToken?.decimals ?? '18')),
      route: { hops: [], summary: `via 1inch (${data.protocols?.length ?? 0} protocols)` },
      gasEstimate: data.gas?.toString() ?? '0',
      priceImpactBps: 0,
      latencyMs: Date.now() - startTime,
    };
  },
});
