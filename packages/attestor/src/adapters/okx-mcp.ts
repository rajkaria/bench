import type { QuoteRequest, QuoteResponse } from '@bench/shared';
import { createSimpleAdapter, formatUnits } from './utils.js';

/**
 * OKX DEX Aggregator via Onchain OS MCP Server.
 *
 * Uses the public MCP endpoint (no HMAC API keys needed) to query
 * OKX's aggregated routing across 500+ DEX liquidity sources.
 *
 * MCP docs: https://web3.okx.com/onchainos/dev-docs/trade/dex-ai-tools-mcp-server
 */

const MCP_ENDPOINT = 'https://web3.okx.com/api/v1/onchainos-mcp';
const MCP_ACCESS_KEY = 'd573a84c-8e79-4a35-b0c6-427e9ad2478d';

export const okxMCPAdapter = createSimpleAdapter({
  name: 'okx-mcp',
  displayName: 'OKX DEX (Onchain OS MCP)',
  supportedChains: [1, 56, 137, 43114, 42161, 10, 8453, 196, 1952, 324],
  rateLimit: { requestsPerSecond: 5, burstCapacity: 10 },
  requiresApiKey: false,

  async fetchQuote(req: QuoteRequest): Promise<QuoteResponse> {
    const startTime = Date.now();

    const body = {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'dex-okx-dex-quote',
        arguments: {
          chainIndex: String(req.chainId),
          fromTokenAddress: req.inputToken,
          toTokenAddress: req.outputToken,
          amount: req.amount,
        },
      },
      id: 1,
    };

    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OK-ACCESS-KEY': MCP_ACCESS_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`OKX MCP error: ${response.status}`);

    const data = await response.json() as {
      result?: {
        content?: Array<{ text?: string }>;
      };
      error?: { message?: string };
    };

    if (data.error) throw new Error(`OKX MCP: ${data.error.message}`);

    // MCP response wraps tool output in result.content[0].text as JSON string
    const textContent = data.result?.content?.[0]?.text;
    if (!textContent) throw new Error('OKX MCP: empty response');

    const quoteData = JSON.parse(textContent) as {
      data?: Array<{
        toTokenAmount?: string;
        estimateGasFee?: string;
        toToken?: { decimals?: string };
        dexRouterList?: unknown[];
      }>;
    };

    const route = quoteData.data?.[0];
    if (!route?.toTokenAmount) throw new Error('OKX MCP: no quote data');

    const decimals = parseInt(route.toToken?.decimals ?? '18', 10);

    return {
      expectedOutput: route.toTokenAmount,
      expectedOutputFormatted: formatUnits(route.toTokenAmount, decimals),
      route: {
        hops: [],
        summary: `via OKX Onchain OS MCP (${route.dexRouterList?.length ?? 0} routes)`,
      },
      gasEstimate: route.estimateGasFee ?? '0',
      priceImpactBps: 0,
      latencyMs: Date.now() - startTime,
    };
  },
});
