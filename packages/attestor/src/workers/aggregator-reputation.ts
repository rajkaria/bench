/**
 * Aggregator Reputation Updater
 *
 * Background worker that computes reputation scores for each aggregator
 * based on their performance across all certifications.
 *
 * Score formula (0-100):
 * - 50% Best Rate: how often this aggregator returned the consensus best
 * - 20% Consistency: standard deviation of the aggregator's rank across certs
 * - 20% Uptime: successful queries / total queries
 * - 10% Latency: inverse of average latency (faster = higher)
 */

export interface AggregatorStats {
  sourceName: string;
  displayName: string;
  totalQueries: number;
  successfulQueries: number;
  bestRateCount: number;
  avgLatencyMs: number;
  uptimePct: number;
  reputationScore: number;
}

/**
 * Compute reputation score from raw stats.
 */
export function computeReputationScore(stats: {
  bestRateCount: number;
  totalQueries: number;
  successfulQueries: number;
  avgLatencyMs: number;
}): number {
  if (stats.totalQueries === 0) return 50; // Default for new sources

  // Best rate component (50%): % of queries where this was best
  const bestRatePct = stats.bestRateCount / stats.totalQueries;
  const bestRateScore = Math.min(bestRatePct * 200, 100); // Scale: 50% best rate = 100 score

  // Uptime component (20%)
  const uptimePct = stats.successfulQueries / stats.totalQueries;
  const uptimeScore = uptimePct * 100;

  // Latency component (10%): sub-200ms = 100, over 1000ms = 0
  const latencyScore = Math.max(0, Math.min(100, (1000 - stats.avgLatencyMs) / 8));

  // Consistency component (20%): simplified as uptime × bestRate correlation
  const consistencyScore = (bestRateScore + uptimeScore) / 2;

  const weighted =
    bestRateScore * 0.5 +
    consistencyScore * 0.2 +
    uptimeScore * 0.2 +
    latencyScore * 0.1;

  return Math.round(Math.max(0, Math.min(100, weighted)));
}

/**
 * Update aggregator stats from a completed certification.
 * Called after each cert is issued.
 */
export function updateStatsFromCert(
  currentStats: Map<string, AggregatorStats>,
  successful: Array<{ source: string; latencyMs: number }>,
  failed: Array<{ source: string }>,
  bestSource: string,
): Map<string, AggregatorStats> {
  // Update successful sources
  for (const resp of successful) {
    const existing = currentStats.get(resp.source) ?? makeDefaultStats(resp.source);
    existing.totalQueries++;
    existing.successfulQueries++;
    existing.avgLatencyMs =
      (existing.avgLatencyMs * (existing.successfulQueries - 1) + resp.latencyMs) /
      existing.successfulQueries;
    if (resp.source === bestSource) {
      existing.bestRateCount++;
    }
    existing.uptimePct = (existing.successfulQueries / existing.totalQueries) * 100;
    existing.reputationScore = computeReputationScore(existing);
    currentStats.set(resp.source, existing);
  }

  // Update failed sources
  for (const f of failed) {
    const existing = currentStats.get(f.source) ?? makeDefaultStats(f.source);
    existing.totalQueries++;
    existing.uptimePct = (existing.successfulQueries / existing.totalQueries) * 100;
    existing.reputationScore = computeReputationScore(existing);
    currentStats.set(f.source, existing);
  }

  return currentStats;
}

function makeDefaultStats(source: string): AggregatorStats {
  return {
    sourceName: source,
    displayName: source,
    totalQueries: 0,
    successfulQueries: 0,
    bestRateCount: 0,
    avgLatencyMs: 0,
    uptimePct: 100,
    reputationScore: 50,
  };
}
