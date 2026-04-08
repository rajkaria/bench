import type { QuoteRequest, QuoteResponse } from '@bench/shared';
import { createSimpleAdapter, formatUnits } from './utils.js';

export const cowswapAdapter = createSimpleAdapter({
  name: 'cow-swap',
  displayName: 'CoW Swap',
  supportedChains: [1, 100, 42161, 8453, 11155111],
  rateLimit: { requestsPerSecond: 5, burstCapacity: 10 },
  requiresApiKey: false,

  async fetchQuote(req: QuoteRequest): Promise<QuoteResponse> {
    const startTime = Date.now();
    const baseUrl = COW_API_URLS[req.chainId] ?? 'https://api.cow.fi/mainnet';
    const url = `${baseUrl}/api/v1/quote`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sellToken: req.inputToken,
        buyToken: req.outputToken,
        sellAmountBeforeFee: req.amount,
        kind: 'sell',
        from: req.recipientAddress ?? '0x0000000000000000000000000000000000000000',
        slippageBps: req.slippageBps ?? 50,
      }),
    });

    if (!response.ok) throw new Error(`CoW Swap API error: ${response.status}`);

    const data = await response.json();
    const buyAmount = data.quote?.buyAmount ?? '0';

    return {
      expectedOutput: buyAmount,
      expectedOutputFormatted: formatUnits(buyAmount, 18),
      route: { hops: [], summary: 'via CoW Protocol (batch auction)' },
      gasEstimate: data.quote?.feeAmount ?? '0',
      priceImpactBps: 0,
      latencyMs: Date.now() - startTime,
    };
  },
});

const COW_API_URLS: Record<number, string> = {
  1: 'https://api.cow.fi/mainnet',
  100: 'https://api.cow.fi/xdai',
  42161: 'https://api.cow.fi/arbitrum_one',
  8453: 'https://api.cow.fi/base',
};
