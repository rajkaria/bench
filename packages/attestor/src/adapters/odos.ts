import type { QuoteRequest, QuoteResponse } from '@bench/shared';
import { createSimpleAdapter, formatUnits } from './utils.js';

export const odosAdapter = createSimpleAdapter({
  name: 'odos',
  displayName: 'Odos',
  supportedChains: [1, 56, 137, 43114, 250, 42161, 10, 8453, 324, 59144, 534352],
  rateLimit: { requestsPerSecond: 5, burstCapacity: 10 },
  requiresApiKey: false,

  async fetchQuote(req: QuoteRequest): Promise<QuoteResponse> {
    const startTime = Date.now();
    const url = 'https://api.odos.xyz/sor/quote/v2';

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chainId: req.chainId,
        inputTokens: [{ tokenAddress: req.inputToken, amount: req.amount }],
        outputTokens: [{ tokenAddress: req.outputToken, proportion: 1 }],
        slippageLimitPercent: (req.slippageBps ?? 50) / 100,
        userAddr: req.recipientAddress ?? '0x0000000000000000000000000000000000000000',
      }),
    });

    if (!response.ok) throw new Error(`Odos API error: ${response.status}`);

    const data = await response.json();
    const outAmount = data.outAmounts?.[0] ?? data.outputTokens?.[0]?.amount ?? '0';

    return {
      expectedOutput: outAmount,
      expectedOutputFormatted: formatUnits(outAmount, 18),
      route: { hops: [], summary: `via Odos` },
      gasEstimate: data.gasEstimate?.toString() ?? '0',
      priceImpactBps: Math.round((data.priceImpact ?? 0) * 100),
      latencyMs: Date.now() - startTime,
    };
  },
});
