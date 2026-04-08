/** Known chain identifiers used by Bench. */
export const CHAINS = {
  ETHEREUM: 1,
  BSC: 56,
  POLYGON: 137,
  AVALANCHE: 43114,
  FANTOM: 250,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  BASE: 8453,
  XLAYER: 196,
  GNOSIS: 100,
  ZKSYNC: 324,
  AURORA: 1313161554,
  KLAYTN: 8217,
  LINEA: 59144,
  SCROLL: 534352,
  // Solana uses a non-EVM identifier
  SOLANA: 501,
} as const;

export type ChainId = (typeof CHAINS)[keyof typeof CHAINS];

export const CHAIN_NAMES: Record<number, string> = {
  [CHAINS.ETHEREUM]: 'Ethereum',
  [CHAINS.BSC]: 'BNB Chain',
  [CHAINS.POLYGON]: 'Polygon',
  [CHAINS.AVALANCHE]: 'Avalanche',
  [CHAINS.FANTOM]: 'Fantom',
  [CHAINS.ARBITRUM]: 'Arbitrum',
  [CHAINS.OPTIMISM]: 'Optimism',
  [CHAINS.BASE]: 'Base',
  [CHAINS.XLAYER]: 'X Layer',
  [CHAINS.GNOSIS]: 'Gnosis',
  [CHAINS.ZKSYNC]: 'zkSync Era',
  [CHAINS.AURORA]: 'Aurora',
  [CHAINS.KLAYTN]: 'Klaytn',
  [CHAINS.LINEA]: 'Linea',
  [CHAINS.SCROLL]: 'Scroll',
  [CHAINS.SOLANA]: 'Solana',
};

/** Bench Registry is deployed on X Layer. */
export const BENCH_CHAIN_ID = CHAINS.XLAYER;

/** EVM chain IDs (all chains except Solana). */
export const EVM_CHAIN_IDS: number[] = Object.values(CHAINS).filter((id) => id !== CHAINS.SOLANA);

/** Check if a chain ID is a supported EVM chain. */
export function isEvmChain(chainId: number): boolean {
  return EVM_CHAIN_IDS.includes(chainId);
}
