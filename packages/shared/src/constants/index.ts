export {
  CHAINS,
  CHAIN_NAMES,
  BENCH_CHAIN_ID,
  EVM_CHAIN_IDS,
  isEvmChain,
} from './chains.js';
export type { ChainId } from './chains.js';

/** Current BEC protocol version. */
export const BEC_VERSION = 'bench-v2' as const;

/** Default query timeout per adapter in milliseconds. */
export const ADAPTER_TIMEOUT_MS = 3000;

/** Maximum retries per adapter before giving up. */
export const ADAPTER_MAX_RETRIES = 2;

/** Outlier filtering threshold: exclude sources > N standard deviations from median. */
export const OUTLIER_STDDEV_THRESHOLD = 2n;

/** Certification thresholds in basis points. */
export const CERT_THRESHOLDS = {
  /** Max bps delta for CERTIFIED. */
  CERTIFIED_MAX_BPS: 10,
  /** Max bps delta for WARNING (above this = FAILED). */
  WARNING_MAX_BPS: 50,
  /** Minimum agreement score for CERTIFIED. */
  CERTIFIED_MIN_AGREEMENT: 70,
  /** Minimum agreement score to avoid FAILED. */
  WARNING_MIN_AGREEMENT: 50,
} as const;

/** Redis cache TTL for source responses (seconds). One EVM block ~12s. */
export const QUOTE_CACHE_TTL_SECONDS = 12;
