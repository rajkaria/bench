import { fetchApi } from '@/lib/api';

interface Aggregator {
  rank: number;
  name: string;
  sourceName: string;
  bestRate: number;
  uptime: number;
  avgLatency: number;
  queries: number;
}

const DEMO_AGGREGATORS: Aggregator[] = [
  { rank: 1, name: '1inch Pathfinder', sourceName: '1inch', bestRate: 34.2, uptime: 99.8, avgLatency: 180, queries: 4200 },
  { rank: 2, name: 'OKX DEX Aggregator', sourceName: 'okx', bestRate: 31.7, uptime: 99.5, avgLatency: 142, queries: 4200 },
  { rank: 3, name: 'Velora (ParaSwap)', sourceName: 'velora', bestRate: 18.4, uptime: 98.9, avgLatency: 215, queries: 4100 },
  { rank: 4, name: 'Odos', sourceName: 'odos', bestRate: 12.1, uptime: 99.2, avgLatency: 312, queries: 4150 },
  { rank: 5, name: 'KyberSwap', sourceName: 'kyber', bestRate: 8.3, uptime: 99.0, avgLatency: 256, queries: 4180 },
  { rank: 6, name: '0x', sourceName: '0x', bestRate: 7.9, uptime: 99.6, avgLatency: 234, queries: 3900 },
  { rank: 7, name: 'Uniswap AI', sourceName: 'uniswap-ai', bestRate: 6.1, uptime: 100, avgLatency: 178, queries: 4200 },
  { rank: 8, name: 'CoW Swap', sourceName: 'cow', bestRate: 4.8, uptime: 95.2, avgLatency: 847, queries: 4000 },
  { rank: 9, name: 'OpenOcean', sourceName: 'openocean', bestRate: 3.2, uptime: 97.8, avgLatency: 367, queries: 4100 },
  { rank: 10, name: 'Jupiter', sourceName: 'jupiter', bestRate: 2.1, uptime: 98.4, avgLatency: 190, queries: 1200 },
  { rank: 11, name: 'LI.FI', sourceName: 'lifi', bestRate: 1.8, uptime: 97.2, avgLatency: 520, queries: 800 },
  { rank: 12, name: 'Squid', sourceName: 'squid', bestRate: 1.2, uptime: 96.5, avgLatency: 680, queries: 750 },
];

const MEDALS = ['🥇', '🥈', '🥉'];

export default async function AggregatorsPage() {
  const aggregators = await fetchApi<Aggregator[]>('/v1/aggregators', DEMO_AGGREGATORS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Aggregator Leaderboard</h1>
        <p className="text-bench-muted mt-1">
          Which aggregators consistently return the best prices? Ranked by best-rate frequency across all Bench certifications.
        </p>
      </div>

      <div className="bg-bench-surface border border-bench-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-bench-border text-bench-muted text-left">
              <th className="px-4 py-3 w-16">Rank</th>
              <th className="px-4 py-3">Aggregator</th>
              <th className="px-4 py-3 text-right">Best Rate</th>
              <th className="px-4 py-3 text-right">Uptime</th>
              <th className="px-4 py-3 text-right">Avg Latency</th>
              <th className="px-4 py-3 text-right">Total Queries</th>
            </tr>
          </thead>
          <tbody>
            {aggregators.map((agg) => (
              <tr key={agg.sourceName} className="border-b border-bench-border/50 hover:bg-bench-border/20 transition-colors">
                <td className="px-4 py-3 text-center">
                  {agg.rank <= 3 ? (
                    <span className="text-lg">{MEDALS[agg.rank - 1]}</span>
                  ) : (
                    <span className="text-bench-muted">{agg.rank}</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{agg.name}</td>
                <td className="px-4 py-3 text-right font-mono text-bench-accent">{agg.bestRate}%</td>
                <td className="px-4 py-3 text-right font-mono">
                  <span className={agg.uptime >= 99 ? 'text-bench-green' : agg.uptime >= 97 ? 'text-bench-yellow' : 'text-bench-red'}>
                    {agg.uptime}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-bench-muted">{agg.avgLatency}ms</td>
                <td className="px-4 py-3 text-right font-mono text-bench-muted">{agg.queries.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-bench-muted text-xs text-center">
        Best Rate = % of queries where this aggregator returned the consensus best price (or within 1 bp of it).
        Updated from live certification data.
      </p>
    </div>
  );
}
