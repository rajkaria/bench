import { fetchApi } from '@/lib/api';

interface AgentSummary {
  rank: number;
  address: string;
  agentId: string | null;
  score: number;
  certs: number;
  certRate: number;
  honorRate: number;
}

const DEMO_AGENTS: AgentSummary[] = [
  { rank: 1, address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18', agentId: 'bench-demo-agent', score: 94, certs: 312, certRate: 96.2, honorRate: 99.1 },
  { rank: 2, address: '0x1234abcd5678901234567890abcdef5678901234', agentId: 'alpha-trader', score: 87, certs: 189, certRate: 91.0, honorRate: 97.8 },
  { rank: 3, address: '0xdeadbeef1234567890deadbeef1234567890cafe', agentId: 'defi-scout', score: 82, certs: 145, certRate: 88.3, honorRate: 95.2 },
  { rank: 4, address: '0xfeed000012345678900000feedbabe1234567890', agentId: 'yield-hunter', score: 76, certs: 98, certRate: 82.7, honorRate: 93.1 },
  { rank: 5, address: '0xa1b2c3d4e5f6789012345678a1b2c3d4e5f67890', agentId: null, score: 71, certs: 67, certRate: 79.1, honorRate: 90.5 },
];

export default async function LeaderboardPage() {
  const agents = await fetchApi<AgentSummary[]>('/v1/agents', DEMO_AGENTS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Agent Leaderboard</h1>
        <p className="text-bench-muted mt-1">
          Bench Score ranks agents by execution quality. Higher = better at finding optimal prices.
        </p>
      </div>

      <div className="space-y-3">
        {agents.map((agent, i) => (
          <a
            key={agent.address}
            href={`/agent/${agent.address}`}
            className="block bg-bench-surface border border-bench-border rounded-lg p-5 hover:border-bench-accent/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-bench-muted w-8">#{i + 1}</span>
                <div>
                  <p className="font-mono text-sm">
                    {agent.address.slice(0, 10)}...{agent.address.slice(-4)}
                  </p>
                  {agent.agentId && <p className="text-bench-muted text-xs">{agent.agentId}</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold bench-gradient">{agent.score}</p>
                <p className="text-bench-muted text-xs">Bench Score</p>
              </div>
            </div>
            <div className="mt-3 flex gap-6 text-sm text-bench-muted">
              <span>{agent.certs} certs</span>
              <span>Cert Rate: {agent.certRate}%</span>
              <span>Honor Rate: {agent.honorRate}%</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
