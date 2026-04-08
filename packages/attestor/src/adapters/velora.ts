import type { QuoteRequest, QuoteResponse } from '@bench/shared';
import { createSimpleAdapter, formatUnits } from './utils.js';

export const veloraAdapter = createSimpleAdapter({
  name: 'velora',
  displayName: 'Velora (ParaSwap)',
  supportedChains: [1, 56, 137, 43114, 250, 42161, 10, 8453, 100],
  rateLimit: { requestsPerSecond: 5, burstCapacity: 10 },
  requiresApiKey: false,

  async fetchQuote(req: QuoteRequest): Promise<QuoteResponse> {
    const startTime = Date.now();
    const url = `https://api.paraswap.io/prices`;
    const params = new URLSearchParams({
      srcToken: req.inputToken,
      destToken: req.outputToken,
      amount: req.amount,
      srcDecimals: '18',
      destDecimals: '18',
      side: 'SELL',
      network: req.chainId.toString(),
    });

    const response = await fetch(`${url}?${params}`);
    if (!response.ok) throw new Error(`Velora API error: ${response.status}`);

    const data = await response.json();
    const priceRoute = data.priceRoute;
    if (!priceRoute) throw new Error('Velora: no price route returned');

    return {
      expectedOutput: priceRoute.destAmount,
      expectedOutputFormatted: formatUnits(priceRoute.destAmount, parseInt(priceRoute.destDecimals ?? '18')),
      route: { hops: [], summary: `via Velora (${priceRoute.bestRoute?.length ?? 0} routes)` },
      gasEstimate: priceRoute.gasCost ?? '0',
      priceImpactBps: 0,
      latencyMs: Date.now() - startTime,
    };
  },
});
