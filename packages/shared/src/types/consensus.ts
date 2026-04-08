import type { SourceResponse } from './source.js';

/** Confidence tier based on source agreement score. */
export type ConfidenceTier = 'STRONG' | 'MODERATE' | 'WEAK' | 'NONE';

/** Certification level for a Best Execution Certificate. */
export type CertificationLevel = 'CERTIFIED' | 'WARNING' | 'FAILED';

/** Result of the consensus computation across filtered sources. */
export interface ConsensusResult {
  /** The source with the best (highest) output among filtered responses. */
  best: SourceResponse;
  /** Median output across filtered sources as decimal string. */
  median: string;
  /** Standard deviation across filtered sources as decimal string. */
  stddev: string;
  /** Source agreement score (0-100). Higher = more agreement. */
  sourceAgreementScore: number;
  /** Confidence tier derived from agreement score. */
  confidenceTier: ConfidenceTier;
  /** Sources remaining after outlier filtering. */
  filtered: SourceResponse[];
  /** Sources excluded as outliers (>2σ from median). */
  outliersExcluded: SourceResponse[];
}

/** Maps agreement score to confidence tier. */
export function scoreToConfidenceTier(score: number): ConfidenceTier {
  if (score >= 90) return 'STRONG';
  if (score >= 70) return 'MODERATE';
  if (score >= 50) return 'WEAK';
  return 'NONE';
}

/**
 * Determines certification level given slippage delta and agreement score.
 *
 * Rules:
 * - CERTIFIED: within 10 bps of consensus best AND agreement >= 70
 * - WARNING: 10-50 bps worse, OR agreement 50-69, OR single source
 * - FAILED: 50+ bps worse, OR agreement < 50
 */
export function computeCertificationLevel(
  slippageDeltaBps: number,
  sourceAgreementScore: number,
  sourceCount: number,
): CertificationLevel {
  // Single source — insufficient consensus for certification
  if (sourceCount === 1) return 'WARNING';

  // Hard fail conditions
  if (slippageDeltaBps > 50) return 'FAILED';
  if (sourceAgreementScore < 50) return 'FAILED';

  // Warning conditions
  if (slippageDeltaBps > 10) return 'WARNING';
  if (sourceAgreementScore < 70) return 'WARNING';

  return 'CERTIFIED';
}
