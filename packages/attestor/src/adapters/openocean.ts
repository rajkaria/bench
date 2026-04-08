import type { QuoteRequest, QuoteResponse } from '@bench/shared';
import { createSimpleAdapter, formatUnits } from './utils.js';

export const openoceanAdapter = createSimpleAdapter({
  name: 'openocean',
  displayName: 'OpenOcean',
  supportedChains: [1, 56, 137, 43114, 250, 42161, 10, 8453, 100, 324, 59144],
  rateLimit: { requestsPerSecond: 5, burstCapacity: 10 },
  requiresApiKey: false,

  async fetchQuote(req: QuoteRequest): Promise<QuoteResponse> {
    const startTime = Date.now();
    const chainName = OPENOCEAN_CHAINS[req.chainId] ?? 'eth';
    const url = `https://open-api.openocean.finance/v3/${chainName}/quote`;
    const params = new URLSearchParams({
      inTokenAddress: req.inputToken,
      outTokenAddress: req.outputToken,
      amount: req.amount,
      gasPrice: '5',
      slippage: ((req.slippageBps ?? 50) / 100).toString(),
    });

    const response = await fetch(`${url}?${params}`);
    if (!response.ok) throw new Error(`OpenOcean API error: ${response.status}`);

    const data = await response.json();
    if (data.code !== 200) throw new Error(`OpenOcean error: ${data.error ?? 'unknown'}`);

    const result = data.data;
    return {
      expectedOutput: result.outAmount,
      expectedOutputFormatted: formatUnits(result.outAmount, parseInt(result.outToken?.decimals ?? '18')),
      route: { hops: [], summary: `via OpenOcean` },
      gasEstimate: result.estimatedGas ?? '0',
      priceImpactBps: 0,
      latencyMs: Date.now() - startTime,
    };
  },
});

const OPENOCEAN_CHAINS: Record<number, string> = {
  1: 'eth',
  56: 'bsc',
  137: 'polygon',
  43114: 'avax',
  250: 'fantom',
  42161: 'arbitrum',
  10: 'optimism',
  8453: 'base',
  100: 'xdai',
  324: 'zksync',
  59144: 'linea',
};
