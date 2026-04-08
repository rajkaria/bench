import type { QuoteRequest, QuoteResponse } from '@bench/shared';
import { createSimpleAdapter, formatUnits } from './utils.js';

export const lifiAdapter = createSimpleAdapter({
  name: 'lifi',
  displayName: 'LI.FI',
  supportedChains: [1, 56, 137, 43114, 250, 42161, 10, 8453, 100, 324, 59144, 534352, 196],
  rateLimit: { requestsPerSecond: 5, burstCapacity: 10 },
  requiresApiKey: false,

  async fetchQuote(req: QuoteRequest): Promise<QuoteResponse> {
    const startTime = Date.now();
    const url = 'https://li.quest/v1/quote';
    const params = new URLSearchParams({
      fromChain: req.chainId.toString(),
      toChain: (req.destinationChainId ?? req.chainId).toString(),
      fromToken: req.inputToken,
      toToken: req.outputToken,
      fromAmount: req.amount,
      fromAddress: req.recipientAddress ?? '0x0000000000000000000000000000000000000000',
      slippage: ((req.slippageBps ?? 50) / 10000).toString(),
    });

    const response = await fetch(`${url}?${params}`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) throw new Error(`LI.FI API error: ${response.status}`);

    const data = await response.json();
    const estimate = data.estimate;
    if (!estimate) throw new Error('LI.FI: no estimate returned');

    return {
      expectedOutput: estimate.toAmount,
      expectedOutputFormatted: estimate.toAmountMin
        ? formatUnits(estimate.toAmountMin, parseInt(data.action?.toToken?.decimals ?? '18'))
        : formatUnits(estimate.toAmount, 18),
      route: { hops: [], summary: `via LI.FI (${data.includedSteps?.length ?? 0} steps)` },
      gasEstimate: estimate.gasCosts?.[0]?.amount ?? '0',
      priceImpactBps: 0,
      latencyMs: Date.now() - startTime,
    };
  },
});
