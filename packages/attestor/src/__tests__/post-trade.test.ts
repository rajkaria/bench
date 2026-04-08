import { describe, it, expect } from 'vitest';
import { computeReputationScore, updateStatsFromCert, type AggregatorStats } from '../workers/aggregator-reputation.js';

describe('computeReputationScore', () => {
  it('returns 50 for new source with no queries', () => {
    expect(computeReputationScore({
      bestRateCount: 0, totalQueries: 0, successfulQueries: 0, avgLatencyMs: 0,
    })).toBe(50);
  });

  it('returns high score for source that is frequently best with low latency', () => {
    const score = computeReputationScore({
      bestRateCount: 40, totalQueries: 100, successfulQueries: 99, avgLatencyMs: 150,
    });
    expect(score).toBeGreaterThan(75);
  });

  it('returns low score for source that is never best with high latency', () => {
    const score = computeReputationScore({
      bestRateCount: 0, totalQueries: 100, successfulQueries: 80, avgLatencyMs: 900,
    });
    expect(score).toBeLessThan(30);
  });

  it('returns moderate score for average source', () => {
    const score = computeReputationScore({
      bestRateCount: 10, totalQueries: 100, successfulQueries: 95, avgLatencyMs: 300,
    });
    expect(score).toBeGreaterThan(30);
    expect(score).toBeLessThan(70);
  });

  it('clamps to 0-100 range', () => {
    const extreme = computeReputationScore({
      bestRateCount: 1000, totalQueries: 10, successfulQueries: 10, avgLatencyMs: 1,
    });
    expect(extreme).toBeLessThanOrEqual(100);
    expect(extreme).toBeGreaterThanOrEqual(0);
  });
});

describe('updateStatsFromCert', () => {
  it('creates new stats for unknown sources', () => {
    const stats = new Map<string, AggregatorStats>();
    const updated = updateStatsFromCert(
      stats,
      [{ source: '1inch', latencyMs: 200 }, { source: 'okx', latencyMs: 150 }],
      [{ source: 'cow-swap' }],
      '1inch',
    );

    expect(updated.size).toBe(3);
    expect(updated.get('1inch')!.bestRateCount).toBe(1);
    expect(updated.get('1inch')!.totalQueries).toBe(1);
    expect(updated.get('okx')!.bestRateCount).toBe(0);
    expect(updated.get('cow-swap')!.successfulQueries).toBe(0);
    expect(updated.get('cow-swap')!.totalQueries).toBe(1);
  });

  it('accumulates stats across multiple certs', () => {
    const stats = new Map<string, AggregatorStats>();

    updateStatsFromCert(stats,
      [{ source: '1inch', latencyMs: 200 }], [], '1inch');
    updateStatsFromCert(stats,
      [{ source: '1inch', latencyMs: 300 }], [], '1inch');
    updateStatsFromCert(stats,
      [{ source: '1inch', latencyMs: 100 }], [], 'okx');

    const oneInch = stats.get('1inch')!;
    expect(oneInch.totalQueries).toBe(3);
    expect(oneInch.bestRateCount).toBe(2);
    expect(oneInch.avgLatencyMs).toBe(200); // (200+300+100)/3
  });

  it('updates uptime correctly for failed sources', () => {
    const stats = new Map<string, AggregatorStats>();

    updateStatsFromCert(stats, [{ source: 'src1', latencyMs: 100 }], [], 'src1');
    updateStatsFromCert(stats, [], [{ source: 'src1' }], '');

    const src1 = stats.get('src1')!;
    expect(src1.totalQueries).toBe(2);
    expect(src1.successfulQueries).toBe(1);
    expect(src1.uptimePct).toBe(50);
  });
});
