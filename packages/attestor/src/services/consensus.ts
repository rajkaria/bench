import type { SourceResponse, ConsensusResult, ConfidenceTier } from '@bench/shared';
import { scoreToConfidenceTier } from '@bench/shared';

/**
 * Compute consensus from a set of successful source responses.
 *
 * Algorithm:
 * 1. Extract output amounts as BigInts
 * 2. Compute median and stddev
 * 3. Filter outliers (>2σ from median)
 * 4. Re-compute median/stddev on filtered set
 * 5. Find the best (max) output among filtered
 * 6. Compute source agreement score = 100 × (1 - σ/median)
 *
 * Edge cases:
 * - 0 sources: throws
 * - 1 source: returns it with agreement=0, tier=NONE
 * - All same value: agreement=100, tier=STRONG
 */
export function computeConsensus(successful: SourceResponse[]): ConsensusResult {
  if (successful.length === 0) {
    throw new Error('Cannot compute consensus: no successful source responses');
  }

  // Single source — insufficient for consensus
  if (successful.length === 1) {
    return {
      best: successful[0]!,
      median: successful[0]!.expectedOutput,
      stddev: '0',
      sourceAgreementScore: 0,
      confidenceTier: 'NONE',
      filtered: successful,
      outliersExcluded: [],
    };
  }

  const outputs = successful.map((r) => BigInt(r.expectedOutput));

  // Step 1: Compute median and stddev on full set
  const median = computeMedian(outputs);
  const stddev = computeStdDev(outputs, median);

  // Step 2: Filter outliers (>2σ from median)
  const threshold = 2n * stddev;
  const filtered: SourceResponse[] = [];
  const outliersExcluded: SourceResponse[] = [];

  for (const resp of successful) {
    const diff = absBigInt(BigInt(resp.expectedOutput) - median);
    if (diff <= threshold) {
      filtered.push(resp);
    } else {
      outliersExcluded.push(resp);
    }
  }

  // If filtering removed everything (shouldn't happen with 2σ), keep all
  if (filtered.length === 0) {
    filtered.push(...successful);
    outliersExcluded.length = 0;
  }

  // Step 3: Re-compute stats on filtered set
  const filteredOutputs = filtered.map((r) => BigInt(r.expectedOutput));
  const filteredMedian = computeMedian(filteredOutputs);
  const filteredStdDev = computeStdDev(filteredOutputs, filteredMedian);

  // Step 4: Find best (highest output) among filtered
  const best = filtered.reduce((max, current) =>
    BigInt(current.expectedOutput) > BigInt(max.expectedOutput) ? current : max,
  );

  // Step 5: Agreement score
  const agreementScore = computeAgreementScore(filteredMedian, filteredStdDev);
  const confidenceTier = scoreToConfidenceTier(agreementScore);

  return {
    best,
    median: filteredMedian.toString(),
    stddev: filteredStdDev.toString(),
    sourceAgreementScore: agreementScore,
    confidenceTier,
    filtered,
    outliersExcluded,
  };
}

/** Compute median of a sorted array of BigInts. */
export function computeMedian(values: bigint[]): bigint {
  if (values.length === 0) return 0n;
  const sorted = [...values].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2n;
  }
  return sorted[mid]!;
}

/** Compute standard deviation of BigInts from a given mean. Uses integer math. */
export function computeStdDev(values: bigint[], mean: bigint): bigint {
  if (values.length <= 1) return 0n;
  const n = BigInt(values.length);
  const sumSquaredDiffs = values.reduce((sum, v) => {
    const diff = v - mean;
    return sum + diff * diff;
  }, 0n);
  const variance = sumSquaredDiffs / n;
  return bigIntSqrt(variance);
}

/** Integer square root using Newton's method. */
export function bigIntSqrt(n: bigint): bigint {
  if (n < 0n) throw new Error('Square root of negative number');
  if (n === 0n) return 0n;
  if (n === 1n) return 1n;

  let x = n;
  let y = (x + 1n) / 2n;
  while (y < x) {
    x = y;
    y = (x + n / x) / 2n;
  }
  return x;
}

/** Absolute value for BigInt. */
function absBigInt(n: bigint): bigint {
  return n < 0n ? -n : n;
}

/**
 * Compute source agreement score (0-100).
 * Formula: 100 × (1 - stddev/median)
 * Higher = more agreement.
 */
function computeAgreementScore(median: bigint, stddev: bigint): number {
  if (median === 0n) return 0;
  // Use 10000n for 4 decimal places of precision
  const ratio = Number(stddev * 10000n / median) / 10000;
  const score = Math.round(100 * (1 - ratio));
  return Math.max(0, Math.min(100, score));
}
