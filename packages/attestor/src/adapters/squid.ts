import type { QuoteRequest, QuoteResponse } from '@bench/shared';
import { createSimpleAdapter, formatUnits } from './utils.js';

export const squidAdapter = createSimpleAdapter({
  name: 'squid',
  displayName: 'Squid (Axelar)',
  supportedChains: [1, 56, 137, 43114, 250, 42161, 10, 8453, 59144],
  rateLimit: { requestsPerSecond: 3, burstCapacity: 5 },
  requiresApiKey: false,

  async fetchQuote(req: QuoteRequest): Promise<QuoteResponse> {
    const startTime = Date.now();
    const url = 'https://apiplus.squidrouter.com/v2/route';

    const integratorId = process.env['SQUID_INTEGRATOR_ID'] ?? 'bench-v2';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-integrator-id': integratorId,
      },
      body: JSON.stringify({
        fromChain: req.chainId.toString(),
        toChain: (req.destinationChainId ?? req.chainId).toString(),
        fromToken: req.inputToken,
        toToken: req.outputToken,
        fromAmount: req.amount,
        fromAddress: req.recipientAddress ?? '0x0000000000000000000000000000000000000000',
        toAddress: req.recipientAddress ?? '0x0000000000000000000000000000000000000000',
        slippageConfig: { autoMode: 1 },
      }),
    });

    if (!response.ok) throw new Error(`Squid API error: ${response.status}`);

    const data = await response.json();
    const estimate = data.route?.estimate;
    if (!estimate) throw new Error('Squid: no estimate returned');

    return {
      expectedOutput: estimate.toAmount,
      expectedOutputFormatted: formatUnits(estimate.toAmount, parseInt(estimate.toToken?.decimals ?? '18')),
      route: { hops: [], summary: `via Squid (Axelar)` },
      gasEstimate: estimate.gasCosts?.[0]?.amount ?? '0',
      priceImpactBps: Math.round((estimate.aggregatePriceImpact ?? 0) * 100),
      latencyMs: Date.now() - startTime,
    };
  },
});
