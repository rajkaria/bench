import type { TokenInfo } from './token.js';
import type { SourceResponse, SourceFailure } from './source.js';
import type { RouteData, SwapType } from './quote.js';
import type { ConfidenceTier, CertificationLevel } from './consensus.js';

/** Agent identity in a certificate. */
export interface CertAgent {
  /** Agent's wallet address (EVM checksummed or Solana base58). */
  walletAddress: string;
  /** Optional human-readable agent identifier. */
  agentId?: string;
  /** Agent framework, e.g. "eliza", "langchain", "custom". */
  framework?: string;
}

/** Trade context in a certificate. */
export interface CertTrade {
  /** Chain ID where the swap occurs. */
  chainId: number;
  /** Block number at time of quote (EVM) or slot (Solana). */
  blockNumber: number;
  /** Unix timestamp (seconds) of the quote. */
  timestamp: number;
  /** Input token details. */
  inputToken: TokenInfo;
  /** Output token details. */
  outputToken: TokenInfo;
  /** Swap type classification. */
  swapType: SwapType;
}

/** Multi-source query results in a certificate. */
export interface CertSources {
  /** Names of all sources that were queried. */
  queried: string[];
  /** All successful source responses. */
  successful: SourceResponse[];
  /** Filtered responses (after outlier removal). */
  filtered: SourceResponse[];
  /** Sources that failed or timed out. */
  failed: SourceFailure[];
  /** Unix timestamp (seconds) when the query started. */
  queryStartedAt: number;
  /** Unix timestamp (seconds) when the query completed. */
  queryCompletedAt: number;
  /** Total wall-clock query duration in milliseconds. */
  totalQueryDurationMs: number;
}

/** Consensus analysis result in a certificate. */
export interface CertConsensus {
  /** Best source and its output. */
  best: {
    source: string;
    expectedOutput: string;
    expectedOutputFormatted: string;
    route: RouteData;
  };
  /** Median output across filtered sources as decimal string. */
  median: string;
  /** Standard deviation across filtered sources as decimal string. */
  stddev: string;
  /** Source agreement score (0-100). */
  sourceAgreementScore: number;
  /** Confidence tier. */
  confidenceTier: ConfidenceTier;
  /** Sources excluded as outliers. */
  outliersExcluded: SourceResponse[];
}

/** The agent's chosen route for comparison. */
export interface CertChosen {
  /** Source or DEX the agent chose. */
  source: string;
  /** Expected output from the chosen source. */
  expectedOutput: string;
  /** Formatted expected output. */
  expectedOutputFormatted: string;
  /** Route details. */
  route: RouteData;
}

/** Quality assessment in a certificate. */
export interface CertQuality {
  /** Slippage delta vs consensus best in basis points. */
  slippageDeltaBps: number;
  /** Absolute difference in expected output as decimal string. */
  expectedOutputDelta: string;
  /** Approximate USD value of the difference. */
  expectedOutputDeltaUsd: number;
  /** Certification level. */
  certificationLevel: CertificationLevel;
  /** Human-readable reason for the certification level. */
  reason: string;
}

/** Post-trade execution verification (populated after swap executes). */
export interface CertExecution {
  /** Transaction hash of the executed swap. */
  txHash: string;
  /** Actual output received as decimal string. */
  actualOutput: string;
  /** Predicted output from the chosen route as decimal string. */
  predictedOutput: string;
  /** Deviation between actual and predicted in basis points. */
  deviationBps: number;
  /** Verification status. */
  status: 'PENDING' | 'HONORED' | 'VIOLATED';
  /** Unix timestamp (seconds) when verification occurred. */
  verifiedAt: number;
  /** Whether MEV sandwich attack was detected. */
  mevDetected?: boolean;
}

/** Attestor signature metadata. */
export interface CertAttestor {
  /** Attestor's Ethereum address. */
  address: string;
  /** Attestor's compressed public key (hex). */
  publicKey: string;
  /** EIP-712 signature over the certificate hash (hex). */
  signature: string;
  /** Unix timestamp (seconds) when the certificate was signed. */
  signedAt: number;
}

/** On-chain anchor reference (after BenchRegistry.sol write). */
export interface CertOnChainAnchor {
  /** BenchRegistry contract address. */
  contractAddress: string;
  /** Anchor transaction hash. */
  txHash: string;
  /** Block number of the anchor transaction. */
  blockNumber: number;
  /** Chain ID where the anchor was posted (X Layer = 196). */
  chainId: number;
}

/**
 * Best Execution Certificate v2 (BEC v2).
 *
 * The core artifact Bench produces — a signed, verifiable attestation that
 * an agent's chosen swap route was within acceptable slippage of the
 * multi-source consensus best price.
 */
export interface BestExecutionCertificateV2 {
  /** Protocol version. Always "bench-v2". */
  version: 'bench-v2';
  /** Unique certificate ID (UUID v4). */
  certId: string;
  /** SHA-256 hash of the canonical certificate body. */
  certHash: string;

  /** Agent identity. */
  agent: CertAgent;
  /** Trade context. */
  trade: CertTrade;
  /** Multi-source query results. */
  sources: CertSources;
  /** Consensus analysis. */
  consensus: CertConsensus;
  /** Agent's chosen route. */
  chosen: CertChosen;
  /** Quality assessment. */
  quality: CertQuality;

  /** Post-trade execution verification (optional, populated after swap). */
  execution?: CertExecution;
  /** Attestor signature. */
  attestor: CertAttestor;
  /** On-chain anchor (optional, populated after anchoring). */
  onChainAnchor?: CertOnChainAnchor;
}

/**
 * The subset of BEC v2 fields that are included in the canonical hash.
 * Excludes: certHash (circular), attestor (signature over the hash),
 * onChainAnchor (added after signing), execution (added after trade).
 */
export type CertHashableBody = Pick<
  BestExecutionCertificateV2,
  'version' | 'certId' | 'agent' | 'trade' | 'sources' | 'consensus' | 'chosen' | 'quality'
>;
