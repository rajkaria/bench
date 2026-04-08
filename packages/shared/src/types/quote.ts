/** Swap type determines which adapter tier is queried. */
export type SwapType = 'single-chain-evm' | 'single-chain-solana' | 'cross-chain';

/** A hop in a swap route (e.g., USDC -> WETH via Uniswap V3 pool). */
export interface RouteHop {
  /** DEX or pool used for this hop. */
  dex: string;
  /** Pool address or identifier. */
  pool: string;
  /** Input token address for this hop. */
  tokenIn: string;
  /** Output token address for this hop. */
  tokenOut: string;
  /** Percentage of the total amount routed through this hop (0-100). */
  portion: number;
}

/** Full route data returned by an aggregator. */
export interface RouteData {
  /** Ordered list of hops in the route. */
  hops: RouteHop[];
  /** Human-readable route summary, e.g. "USDC -> WETH via Uniswap V3". */
  summary: string;
}

/** Standardized quote request sent to every adapter. */
export interface QuoteRequest {
  /** Chain ID (e.g., 1 for Ethereum, 196 for X Layer, 501 for Solana). */
  chainId: number;
  /** Input token contract address. */
  inputToken: string;
  /** Output token contract address. */
  outputToken: string;
  /** Input amount in smallest unit (wei/lamports) as decimal string. */
  amount: string;
  /** Max acceptable slippage in basis points. Default: 50 (0.5%). */
  slippageBps?: number;
  /** Recipient address for the swap output. */
  recipientAddress?: string;
  /** Target chain ID for cross-chain swaps. */
  destinationChainId?: number;
}

/** Standardized quote response from an adapter. */
export interface QuoteResponse {
  /** Expected output in smallest unit as decimal string. */
  expectedOutput: string;
  /** Human-readable expected output. */
  expectedOutputFormatted: string;
  /** Route taken by this aggregator. */
  route: RouteData;
  /** Estimated gas cost in native token's smallest unit as decimal string. */
  gasEstimate: string;
  /** Price impact in basis points. */
  priceImpactBps: number;
  /** Time taken to fetch this quote in milliseconds. */
  latencyMs: number;
}
