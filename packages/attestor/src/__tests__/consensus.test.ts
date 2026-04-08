import { describe, it, expect } from 'vitest';
import { computeConsensus, computeMedian, computeStdDev, bigIntSqrt } from '../services/consensus.js';
import type { SourceResponse } from '@bench/shared';

// Helper: create a SourceResponse with just the fields consensus cares about
function makeSource(source: string, expectedOutput: string, latencyMs = 200): SourceResponse {
  return {
    source,
    expectedOutput,
    expectedOutputFormatted: '0',
    route: { hops: [], summary: '' },
    gasEstimate: '0',
    priceImpactBps: 0,
    latencyMs,
    fetchedAt: 1712345678,
  };
}

// ============================================================================
// BigInt Math Utilities
// ============================================================================

describe('bigIntSqrt', () => {
  it('sqrt(0) = 0', () => expect(bigIntSqrt(0n)).toBe(0n));
  it('sqrt(1) = 1', () => expect(bigIntSqrt(1n)).toBe(1n));
  it('sqrt(4) = 2', () => expect(bigIntSqrt(4n)).toBe(2n));
  it('sqrt(9) = 3', () => expect(bigIntSqrt(9n)).toBe(3n));
  it('sqrt(16) = 4', () => expect(bigIntSqrt(16n)).toBe(4n));
  it('sqrt(2) = 1 (integer floor)', () => expect(bigIntSqrt(2n)).toBe(1n));
  it('sqrt(10) = 3 (floor)', () => expect(bigIntSqrt(10n)).toBe(3n));
  it('handles very large numbers', () => {
    const n = 10n ** 36n; // 10^36
    expect(bigIntSqrt(n)).toBe(10n ** 18n); // 10^18
  });
  it('throws on negative', () => expect(() => bigIntSqrt(-1n)).toThrow());
});

describe('computeMedian', () => {
  it('empty array returns 0', () => expect(computeMedian([])).toBe(0n));
  it('single value', () => expect(computeMedian([42n])).toBe(42n));
  it('two values — average', () => expect(computeMedian([10n, 20n])).toBe(15n));
  it('odd count — middle value', () => expect(computeMedian([1n, 3n, 5n])).toBe(3n));
  it('even count — average of middle two', () => expect(computeMedian([1n, 3n, 5n, 7n])).toBe(4n));
  it('unsorted input still works', () => expect(computeMedian([5n, 1n, 3n])).toBe(3n));
  it('all same values', () => expect(computeMedian([100n, 100n, 100n])).toBe(100n));
  it('realistic token amounts', () => {
    const amounts = [
      420510000000000000n,
      420500000000000000n,
      420400000000000000n,
      420400000000000000n,
      420300000000000000n,
      420200000000000000n,
      420100000000000000n,
      419800000000000000n,
      419600000000000000n,
    ];
    expect(computeMedian(amounts)).toBe(420300000000000000n);
  });
});

describe('computeStdDev', () => {
  it('single value returns 0', () => expect(computeStdDev([42n], 42n)).toBe(0n));
  it('all same values returns 0', () => expect(computeStdDev([100n, 100n, 100n], 100n)).toBe(0n));
  it('simple case', () => {
    // [2, 4, 4, 4, 5, 5, 7, 9], mean=5
    // variance = ((9+1+1+1+0+0+4+16)/8) = 4, stddev = 2
    const result = computeStdDev([2n, 4n, 4n, 4n, 5n, 5n, 7n, 9n], 5n);
    expect(result).toBe(2n);
  });
});

// ============================================================================
// Consensus Computation
// ============================================================================

describe('computeConsensus', () => {
  describe('error handling', () => {
    it('throws on empty input', () => {
      expect(() => computeConsensus([])).toThrow('no successful source responses');
    });
  });

  describe('single source', () => {
    it('returns the single source with agreement=0, tier=NONE', () => {
      const sources = [makeSource('1inch', '420510000000000000')];
      const result = computeConsensus(sources);

      expect(result.best.source).toBe('1inch');
      expect(result.sourceAgreementScore).toBe(0);
      expect(result.confidenceTier).toBe('NONE');
      expect(result.filtered.length).toBe(1);
      expect(result.outliersExcluded.length).toBe(0);
    });
  });

  describe('all sources agree (identical outputs)', () => {
    it('returns agreement=100, tier=STRONG', () => {
      const sources = [
        makeSource('1inch', '420000000000000000'),
        makeSource('okx', '420000000000000000'),
        makeSource('velora', '420000000000000000'),
        makeSource('odos', '420000000000000000'),
        makeSource('kyber', '420000000000000000'),
      ];
      const result = computeConsensus(sources);

      expect(result.sourceAgreementScore).toBe(100);
      expect(result.confidenceTier).toBe('STRONG');
      expect(result.stddev).toBe('0');
      expect(result.outliersExcluded.length).toBe(0);
    });
  });

  describe('strong consensus (sources within ~1%)', () => {
    it('returns STRONG tier with high agreement', () => {
      const sources = [
        makeSource('1inch', '420510000000000000'),   // 0.42051
        makeSource('okx', '420500000000000000'),      // 0.42050
        makeSource('velora', '420400000000000000'),    // 0.42040
        makeSource('odos', '420400000000000000'),      // 0.42040
        makeSource('uniswap', '420300000000000000'),   // 0.42030
        makeSource('kyber', '420200000000000000'),     // 0.42020
        makeSource('0x', '420100000000000000'),        // 0.42010
        makeSource('bebop', '419800000000000000'),     // 0.41980
        makeSource('openocean', '419600000000000000'), // 0.41960
      ];
      const result = computeConsensus(sources);

      expect(result.best.source).toBe('1inch');
      expect(result.best.expectedOutput).toBe('420510000000000000');
      expect(result.sourceAgreementScore).toBeGreaterThanOrEqual(90);
      expect(result.confidenceTier).toBe('STRONG');
      // The lowest value (419600...) may be filtered as an outlier depending on σ
      expect(result.outliersExcluded.length).toBeLessThanOrEqual(1);
    });
  });

  describe('outlier filtering', () => {
    it('excludes wildly different outlier', () => {
      const sources = [
        makeSource('1inch', '420000000000000000'),
        makeSource('okx', '420000000000000000'),
        makeSource('velora', '420000000000000000'),
        makeSource('odos', '420000000000000000'),
        makeSource('buggy', '999000000000000000'), // way off
      ];
      const result = computeConsensus(sources);

      expect(result.outliersExcluded.length).toBe(1);
      expect(result.outliersExcluded[0]!.source).toBe('buggy');
      expect(result.best.expectedOutput).toBe('420000000000000000');
      expect(result.confidenceTier).toBe('STRONG');
    });

    it('excludes low outlier too', () => {
      const sources = [
        makeSource('1inch', '420000000000000000'),
        makeSource('okx', '420000000000000000'),
        makeSource('velora', '420000000000000000'),
        makeSource('odos', '420000000000000000'),
        makeSource('stale', '100000000000000000'), // way too low
      ];
      const result = computeConsensus(sources);

      expect(result.outliersExcluded.length).toBe(1);
      expect(result.outliersExcluded[0]!.source).toBe('stale');
    });
  });

  describe('weak consensus (sources disagree significantly)', () => {
    it('returns WEAK/NONE tier', () => {
      const sources = [
        makeSource('src1', '100000000000000000'),
        makeSource('src2', '200000000000000000'),
        makeSource('src3', '300000000000000000'),
      ];
      const result = computeConsensus(sources);

      expect(result.sourceAgreementScore).toBeLessThan(70);
      expect(['WEAK', 'NONE']).toContain(result.confidenceTier);
    });
  });

  describe('two sources', () => {
    it('handles two agreeing sources', () => {
      const sources = [
        makeSource('1inch', '420000000000000000'),
        makeSource('okx', '420100000000000000'),
      ];
      const result = computeConsensus(sources);

      expect(result.best.expectedOutput).toBe('420100000000000000');
      expect(result.filtered.length).toBe(2);
      expect(result.sourceAgreementScore).toBeGreaterThan(90);
    });

    it('handles two disagreeing sources', () => {
      const sources = [
        makeSource('src1', '100000000000000000'),
        makeSource('src2', '500000000000000000'),
      ];
      const result = computeConsensus(sources);

      // Both within 2σ of each other (only 2 data points, σ is large)
      expect(result.filtered.length).toBe(2);
      expect(result.sourceAgreementScore).toBeLessThan(50);
    });
  });

  describe('best source identification', () => {
    it('correctly identifies the source with highest output', () => {
      const sources = [
        makeSource('low', '100000000000000000'),
        makeSource('mid', '200000000000000000'),
        makeSource('high', '300000000000000000'),
      ];
      const result = computeConsensus(sources);
      expect(result.best.source).toBe('high');
    });

    it('handles tie by taking whichever reduce finds first', () => {
      const sources = [
        makeSource('first', '420000000000000000'),
        makeSource('second', '420000000000000000'),
      ];
      const result = computeConsensus(sources);
      // Both are "best" — reduce takes the first one it encounters
      expect(['first', 'second']).toContain(result.best.source);
    });
  });
});
