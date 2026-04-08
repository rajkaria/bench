/** Token metadata used in swap quotes and certificates. */
export interface TokenInfo {
  /** Token contract address (checksummed for EVM, base58 for Solana). */
  address: string;
  /** Token symbol, e.g. "USDC", "WETH". */
  symbol: string;
  /** Token name, e.g. "USD Coin". */
  name: string;
  /** Token decimals. */
  decimals: number;
  /** Amount in smallest unit (wei, lamports, etc.) as a decimal string. */
  amount: string;
  /** Human-readable formatted amount. */
  amountFormatted: string;
}
