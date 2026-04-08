import type { QuoteRequest, QuoteResponse } from '@bench/shared';
import { createSimpleAdapter, formatUnits } from './utils.js';
import { CHAINS } from '@bench/shared';

export const jupiterAdapter = createSimpleAdapter({
  name: 'jupiter',
  displayName: 'Jupiter',
  supportedChains: [CHAINS.SOLANA],
  rateLimit: { requestsPerSecond: 10, burstCapacity: 20 },
  requiresApiKey: false,

  async fetchQuote(req: QuoteRequest): Promise<QuoteResponse> {
    const startTime = Date.now();
    const url = 'https://quote-api.jup.ag/v6/quote';
    const params = new URLSearchParams({
      inputMint: req.inputToken,
      outputMint: req.outputToken,
      amount: req.amount,
      slippageBps: (req.slippageBps ?? 50).toString(),
    });

    const response = await fetch(`${url}?${params}`);
    if (!response.ok) throw new Error(`Jupiter API error: ${response.status}`);

    const data = await response.json();
    return {
      expectedOutput: data.outAmount,
      expectedOutputFormatted: formatUnits(data.outAmount, 6), // Most Solana tokens are 6 or 9 decimals
      route: { hops: [], summary: `via Jupiter (${data.routePlan?.length ?? 0} hops)` },
      gasEstimate: '5000', // Solana fees are fixed ~5000 lamports
      priceImpactBps: Math.round(parseFloat(data.priceImpactPct ?? '0') * 100),
      latencyMs: Date.now() - startTime,
    };
  },
});
