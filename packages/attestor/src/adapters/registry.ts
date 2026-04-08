import type { BaseAdapter } from '@bench/shared';
import { okxAdapter } from './okx.js';
import { oneinchAdapter } from './oneinch.js';
import { veloraAdapter } from './velora.js';
import { odosAdapter } from './odos.js';
import { kyberAdapter } from './kyber.js';
import { cowswapAdapter } from './cowswap.js';
import { uniswapAIAdapter } from './uniswap-ai.js';
import { openoceanAdapter } from './openocean.js';
import { jupiterAdapter } from './jupiter.js';
import { lifiAdapter } from './lifi.js';
import { squidAdapter } from './squid.js';
import { rangoAdapter } from './rango.js';

/** All registered adapters keyed by their unique name. */
export const adapterMap: Record<string, BaseAdapter> = {
  'okx-aggregator': okxAdapter,
  '1inch': oneinchAdapter,
  'velora': veloraAdapter,
  'odos': odosAdapter,
  'kyber': kyberAdapter,
  'cow-swap': cowswapAdapter,
  'uniswap-ai': uniswapAIAdapter,
  'openocean': openoceanAdapter,
  'jupiter': jupiterAdapter,
  'lifi': lifiAdapter,
  'squid': squidAdapter,
  'rango': rangoAdapter,
};

/** Flat list of all adapters. */
export const allAdapters: BaseAdapter[] = Object.values(adapterMap);

/** Tier 1: Universal EVM aggregators. */
export const evmAdapters: BaseAdapter[] = [
  okxAdapter, oneinchAdapter, veloraAdapter, odosAdapter,
  kyberAdapter, cowswapAdapter, uniswapAIAdapter, openoceanAdapter,
];

/** Tier 2: Solana-native aggregators. */
export const solanaAdapters: BaseAdapter[] = [jupiterAdapter];

/** Tier 3: Cross-chain aggregators. */
export const crossChainAdapters: BaseAdapter[] = [lifiAdapter, squidAdapter, rangoAdapter];

/**
 * Select the relevant adapters for a given swap type and chain.
 * Filters by chain support.
 */
export function selectAdapters(
  swapType: 'single-chain-evm' | 'single-chain-solana' | 'cross-chain',
  chainId: number,
): BaseAdapter[] {
  switch (swapType) {
    case 'single-chain-evm':
      return evmAdapters.filter((a) => a.supportsChain(chainId));
    case 'single-chain-solana':
      return solanaAdapters;
    case 'cross-chain':
      return crossChainAdapters.filter((a) => a.supportsChain(chainId));
    default:
      throw new Error(`Unsupported swap type: ${swapType}`);
  }
}
