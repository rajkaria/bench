const DEMO_AGENT = {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
  agentId: 'bench-demo-agent',
  framework: 'custom-ts',
  benchScore: 94,
  certificationRate: 96.2,
  avgSlippage: 4.7,
  honorRate: 99.1,
  stats: { total: 312, certified: 300, warning: 10, failed: 2, honored: 295, violated: 5 },
  recentCerts: [
    { hash: '0xa7c4...e3f1', level: 'CERTIFIED' as const, agreement: 92, delta: 5, pair: 'USDC/WETH', time: '2m ago' },
    { hash: '0xb8d5...f402', level: 'CERTIFIED' as const, agreement: 88, delta: 8, pair: 'USDC/WOKB', time: '7m ago' },
    { hash: '0xc9e6...0513', level: 'WARNING' as const, agreement: 62, delta: 23, pair: 'WETH/USDC', time: '12m ago' },
    { hash: '0xdaf7...1624', level: 'CERTIFIED' as const, agreement: 95, delta: 2, pair: 'WOKB/USDC', time: '17m ago' },
  ],
};

const LEVEL_COLORS = {
  CERTIFIED: 'text-bench-green',
  WARNING: 'text-bench-yellow',
  FAILED: 'text-bench-red',
};

export default function AgentProfilePage() {
  const agent = DEMO_AGENT;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-bench-muted text-sm">Agent Profile</p>
          <p className="font-mono text-lg">{agent.address}</p>
          {agent.agentId && <p className="text-bench-muted text-sm">{agent.agentId} ({agent.framework})</p>}
        </div>
        <div className="text-right">
          <p className="text-5xl font-bold bench-gradient">{agent.benchScore}</p>
          <p className="text-bench-muted text-sm">Bench Score</p>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-4 gap-4">
        <ScoreCard label="Certification Rate" value={`${agent.certificationRate}%`} sub="50% weight" />
        <ScoreCard label="Avg Slippage" value={`${agent.avgSlippage} bps`} sub="30% weight" />
        <ScoreCard label="Honor Rate" value={`${agent.honorRate}%`} sub="15% weight" />
        <ScoreCard label="Total Certs" value={agent.stats.total.toString()} sub="5% weight" />
      </div>

      {/* Stats */}
      <div className="bg-bench-surface border border-bench-border rounded-lg p-5">
        <h3 className="text-sm font-bold text-bench-muted mb-3">CERTIFICATION BREAKDOWN</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-bench-green text-2xl font-bold">{agent.stats.certified}</p>
            <p className="text-bench-muted text-xs">Certified</p>
          </div>
          <div>
            <p className="text-bench-yellow text-2xl font-bold">{agent.stats.warning}</p>
            <p className="text-bench-muted text-xs">Warning</p>
          </div>
          <div>
            <p className="text-bench-red text-2xl font-bold">{agent.stats.failed}</p>
            <p className="text-bench-muted text-xs">Failed</p>
          </div>
        </div>
      </div>

      {/* Recent Certificates */}
      <div>
        <h3 className="text-lg font-bold mb-3">Recent Certificates</h3>
        <div className="space-y-2">
          {agent.recentCerts.map((cert) => (
            <a
              key={cert.hash}
              href={`/cert/${cert.hash}`}
              className="flex items-center justify-between bg-bench-surface border border-bench-border rounded-lg p-3 hover:border-bench-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`font-bold text-xs ${LEVEL_COLORS[cert.level]}`}>{cert.level}</span>
                <span className="font-mono text-sm text-bench-muted">{cert.hash}</span>
                <span className="text-sm">{cert.pair}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-bench-muted">
                <span>Agreement: {cert.agreement}/100</span>
                <span>{cert.delta} bps</span>
                <span>{cert.time}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-bench-surface border border-bench-border rounded-lg p-4">
      <p className="text-bench-muted text-xs">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
      <p className="text-bench-muted text-xs mt-1">{sub}</p>
    </div>
  );
}
