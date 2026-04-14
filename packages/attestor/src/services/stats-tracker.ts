/**
 * In-memory stats tracker singleton.
 * Provides live stats even when the database is unavailable.
 * Resets on process restart — intended as a fallback, not a replacement for DB.
 */

interface StatsSnapshot {
  totalCerts: number;
  certifiedRate: number;
  avgAgreement: number;
  sourcesQueried: number;
  avgQueryTime: string;
}

class StatsTracker {
  private totalCerts = 0;
  private certifiedCount = 0;
  private warningCount = 0;
  private failedCount = 0;
  private totalSourcesQueried = 0;
  private totalQueryDurationMs = 0;
  private agreementSum = 0;

  recordCert(
    level: string,
    sourcesQueried: number,
    agreementScore: number,
    queryDurationMs: number,
  ): void {
    this.totalCerts++;
    if (level === 'CERTIFIED') this.certifiedCount++;
    else if (level === 'WARNING') this.warningCount++;
    else if (level === 'FAILED') this.failedCount++;

    this.totalSourcesQueried += sourcesQueried;
    this.agreementSum += agreementScore;
    this.totalQueryDurationMs += queryDurationMs;
  }

  getStats(): StatsSnapshot {
    const certifiedRate =
      this.totalCerts > 0
        ? Math.round((this.certifiedCount / this.totalCerts) * 1000) / 10
        : 0;

    const avgAgreement =
      this.totalCerts > 0
        ? Math.round(this.agreementSum / this.totalCerts)
        : 0;

    const avgQueryTimeSec =
      this.totalCerts > 0
        ? (this.totalQueryDurationMs / this.totalCerts / 1000).toFixed(1)
        : '0.0';

    return {
      totalCerts: this.totalCerts,
      certifiedRate,
      avgAgreement,
      sourcesQueried: this.totalSourcesQueried,
      avgQueryTime: `${avgQueryTimeSec}s`,
    };
  }
}

/** Singleton instance — survives for the lifetime of the process. */
export const statsTracker = new StatsTracker();
