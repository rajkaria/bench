import type { QuoteRequest, QuoteResponse } from '@bench/shared';
import { createSimpleAdapter, formatUnits } from './utils.js';

export const rangoAdapter = createSimpleAdapter({
  name: 'rango',
  displayName: 'Rango',
  supportedChains: [1, 56, 137, 43114, 250, 42161, 10, 8453, 100, 324, 59144],
  rateLimit: { requestsPerSecond: 3, burstCapacity: 5 },
  requiresApiKey: false,

  async fetchQuote(req: QuoteRequest): Promise<QuoteResponse> {
    const startTime = Date.now();
    const apiKey = process.env['RANGO_API_KEY'] ?? '';
    const url = 'https://api.rango.exchange/routing/best';

    const params = new URLSearchParams({
      apiKey,
      from: `${chainToBlockchain(req.chainId)}.${req.inputToken}`,
      to: `${chainToBlockchain(req.destinationChainId ?? req.chainId)}.${req.outputToken}`,
      amount: req.amount,
      slippage: ((req.slippageBps ?? 50) / 100).toString(),
    });

    const response = await fetch(`${url}?${params}`);
    if (!response.ok) throw new Error(`Rango API error: ${response.status}`);

    const data = await response.json();
    if (data.error) throw new Error(`Rango error: ${data.error}`);

    const result = data.result;
    if (!result) throw new Error('Rango: no result returned');

    const outputAmount = result.outputAmount ?? '0';

    return {
      expectedOutput: outputAmount,
      expectedOutputFormatted: formatUnits(outputAmount, parseInt(result.outputAmountDecimals ?? '18')),
      route: { hops: [], summary: `via Rango (${result.swaps?.length ?? 0} swaps)` },
      gasEstimate: result.fee?.[0]?.amount ?? '0',
      priceImpactBps: 0,
      latencyMs: Date.now() - startTime,
    };
  },
});

function chainToBlockchain(chainId: number): string {
  const map: Record<number, string> = {
    1: 'ETH', 56: 'BSC', 137: 'POLYGON', 43114: 'AVAX_CCHAIN',
    250: 'FANTOM', 42161: 'ARBITRUM', 10: 'OPTIMISM', 8453: 'BASE',
    100: 'GNOSIS', 324: 'ZKSYNC', 59144: 'LINEA',
  };
  return map[chainId] ?? 'ETH';
}
