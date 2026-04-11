import { Hono } from 'hono';
import { query } from '@bench/db';

export function createExplorerRoutes() {
  const app = new Hono();

  // GET /v1/stats — global platform stats for StatsBar
  app.get('/v1/stats', async (c) => {
    try {
      const [totals, avgAgreement, avgLatency] = await Promise.all([
        query<{ total: string; certified: string; warning: string; failed: string }>(
          `SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE certification_level = 'CERTIFIED') AS certified,
            COUNT(*) FILTER (WHERE certification_level = 'WARNING') AS warning,
            COUNT(*) FILTER (WHERE certification_level = 'FAILED') AS failed
          FROM certificates`,
        ),
        query<{ avg_agreement: string }>(
          `SELECT ROUND(AVG(source_agreement_score), 0) AS avg_agreement FROM certificates`,
        ),
        query<{ avg_latency: string; total_source_queries: string }>(
          `SELECT
            ROUND(AVG(latency_ms) / 1000.0, 1) AS avg_latency,
            COUNT(*) AS total_source_queries
          FROM source_responses`,
        ),
      ]);

      const total = parseInt(totals.rows[0]?.total ?? '0', 10);
      const certified = parseInt(totals.rows[0]?.certified ?? '0', 10);
      const certifiedRate = total > 0 ? Math.round((certified / total) * 1000) / 10 : 0;

      return c.json({
        totalCerts: total,
        certifiedRate,
        avgAgreement: parseInt(avgAgreement.rows[0]?.avg_agreement ?? '0', 10),
        sourcesQueried: parseInt(avgLatency.rows[0]?.total_source_queries ?? '0', 10),
        avgQueryTime: `${avgLatency.rows[0]?.avg_latency ?? '0'}s`,
      });
    } catch {
      return c.json({ error: 'Database unavailable' }, 503);
    }
  });

  // GET /v1/certs — recent certificates feed
  app.get('/v1/certs', async (c) => {
    const limit = Math.min(parseInt(c.req.query('limit') ?? '20', 10), 100);
    try {
      const result = await query<{
        cert_hash: string;
        agent_address: string;
        agent_id: string | null;
        certification_level: string;
        source_agreement_score: number;
        slippage_delta_bps: number;
        sources_successful: number;
        chain_id: number;
        input_token_symbol: string;
        output_token_symbol: string;
        created_at: string;
      }>(
        `SELECT
          cert_hash, agent_address, agent_id, certification_level,
          source_agreement_score, slippage_delta_bps, sources_successful,
          chain_id, input_token_symbol, output_token_symbol, created_at
        FROM certificates
        ORDER BY created_at DESC
        LIMIT $1`,
        [limit],
      );
      return c.json(result.rows);
    } catch {
      return c.json({ error: 'Database unavailable' }, 503);
    }
  });

  // GET /v1/certs/:hash — full certificate detail
  app.get('/v1/certs/:hash', async (c) => {
    const hash = c.req.param('hash');
    try {
      const certResult = await query<{ full_certificate: object; cert_hash: string }>(
        `SELECT cert_hash, full_certificate FROM certificates WHERE cert_hash = $1`,
        [hash],
      );
      if (!certResult.rows[0]) return c.json({ error: 'Certificate not found' }, 404);

      const cert = certResult.rows[0];
      const [sources, failures, execution] = await Promise.all([
        query<{
          source_name: string;
          expected_output_formatted: string;
          expected_output: string;
          latency_ms: number;
          is_outlier: boolean;
        }>(
          `SELECT source_name, expected_output_formatted, expected_output, latency_ms, is_outlier
           FROM source_responses WHERE cert_id = (SELECT cert_id FROM certificates WHERE cert_hash = $1)
           ORDER BY expected_output DESC`,
          [hash],
        ),
        query<{ source_name: string; error: string }>(
          `SELECT source_name, error FROM source_failures
           WHERE cert_id = (SELECT cert_id FROM certificates WHERE cert_hash = $1)`,
          [hash],
        ),
        query<{ tx_hash: string; actual_output: string; status: string }>(
          `SELECT tx_hash, actual_output, status FROM executions
           WHERE cert_id = (SELECT cert_id FROM certificates WHERE cert_hash = $1)`,
          [hash],
        ),
      ]);

      return c.json({
        ...cert.full_certificate,
        certHash: cert.cert_hash,
        sources: sources.rows,
        failedSources: failures.rows,
        execution: execution.rows[0] ?? null,
      });
    } catch {
      return c.json({ error: 'Database unavailable' }, 503);
    }
  });

  // GET /v1/aggregators — aggregator leaderboard
  app.get('/v1/aggregators', async (c) => {
    try {
      const result = await query<{
        source_name: string;
        display_name: string;
        best_rate_count: number;
        total_queries: number;
        uptime_pct: number;
        avg_latency_ms: number;
        reputation_score: number;
      }>(
        `SELECT source_name, display_name, best_rate_count, total_queries,
                uptime_pct, avg_latency_ms, reputation_score
         FROM aggregator_stats
         WHERE total_queries > 0
         ORDER BY best_rate_count DESC`,
      );

      const rows = result.rows.map((r, i) => ({
        rank: i + 1,
        name: r.display_name,
        sourceName: r.source_name,
        bestRate:
          r.total_queries > 0
            ? Math.round((r.best_rate_count / r.total_queries) * 1000) / 10
            : 0,
        uptime: r.uptime_pct,
        avgLatency: Math.round(r.avg_latency_ms),
        queries: r.total_queries,
      }));

      return c.json(rows);
    } catch {
      return c.json({ error: 'Database unavailable' }, 503);
    }
  });

  // GET /v1/agents — agent leaderboard
  app.get('/v1/agents', async (c) => {
    const limit = Math.min(parseInt(c.req.query('limit') ?? '20', 10), 100);
    try {
      const result = await query<{
        agent_address: string;
        bench_score: number;
        certification_rate: number;
        avg_slippage_delta_bps: number;
        honor_rate: number;
        total_certs: number;
      }>(
        `SELECT agent_address, bench_score, certification_rate,
                avg_slippage_delta_bps, honor_rate, total_certs
         FROM agent_scores
         WHERE total_certs > 0
         ORDER BY bench_score DESC
         LIMIT $1`,
        [limit],
      );

      // Try to enrich with agentId from certificates
      const rows = await Promise.all(
        result.rows.map(async (r, i) => {
          const idResult = await query<{ agent_id: string | null }>(
            `SELECT agent_id FROM certificates WHERE agent_address = $1 AND agent_id IS NOT NULL LIMIT 1`,
            [r.agent_address],
          );
          return {
            rank: i + 1,
            address: r.agent_address,
            agentId: idResult.rows[0]?.agent_id ?? null,
            score: r.bench_score,
            certs: r.total_certs,
            certRate: r.certification_rate,
            honorRate: r.honor_rate,
          };
        }),
      );

      return c.json(rows);
    } catch {
      return c.json({ error: 'Database unavailable' }, 503);
    }
  });

  // GET /v1/agents/:addr — single agent profile
  app.get('/v1/agents/:addr', async (c) => {
    const addr = c.req.param('addr').toLowerCase();
    try {
      const [scoreResult, recentCerts] = await Promise.all([
        query<{
          agent_address: string;
          bench_score: number;
          certification_rate: number;
          avg_slippage_delta_bps: number;
          honor_rate: number;
          total_certs: number;
          certified_count: number;
          warning_count: number;
          failed_count: number;
          honored_count: number;
          violated_count: number;
        }>(
          `SELECT * FROM agent_scores WHERE LOWER(agent_address) = $1`,
          [addr],
        ),
        query<{
          cert_hash: string;
          certification_level: string;
          source_agreement_score: number;
          slippage_delta_bps: number;
          input_token_symbol: string;
          output_token_symbol: string;
          created_at: string;
        }>(
          `SELECT cert_hash, certification_level, source_agreement_score, slippage_delta_bps,
                  input_token_symbol, output_token_symbol, created_at
           FROM certificates
           WHERE LOWER(agent_address) = $1
           ORDER BY created_at DESC
           LIMIT 10`,
          [addr],
        ),
      ]);

      if (!scoreResult.rows[0]) {
        return c.json({ error: 'Agent not found' }, 404);
      }

      const s = scoreResult.rows[0]!;
      const agentIdResult = await query<{ agent_id: string | null; agent_framework: string | null }>(
        `SELECT agent_id, agent_framework FROM certificates WHERE LOWER(agent_address) = $1 LIMIT 1`,
        [addr],
      );

      return c.json({
        address: s.agent_address,
        agentId: agentIdResult.rows[0]?.agent_id ?? null,
        framework: agentIdResult.rows[0]?.agent_framework ?? null,
        benchScore: s.bench_score,
        certificationRate: s.certification_rate,
        avgSlippage: s.avg_slippage_delta_bps,
        honorRate: s.honor_rate,
        stats: {
          total: s.total_certs,
          certified: s.certified_count,
          warning: s.warning_count,
          failed: s.failed_count,
          honored: s.honored_count,
          violated: s.violated_count,
        },
        recentCerts: recentCerts.rows,
      });
    } catch {
      return c.json({ error: 'Database unavailable' }, 503);
    }
  });

  return app;
}
