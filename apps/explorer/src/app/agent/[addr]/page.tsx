import { fetchApi } from '@/lib/api';

interface AgentProfile {
  address: string;
  agentId: string | null;
  framework: string | null;
  benchScore: number;
  certificationRate: number;
  avgSlippage: number;
  honorRate: number;
  stats: { total: number; certified: number; warning: number; failed: number; honored: number; violated: number };
  recentCerts: {
    cert_hash: string;
    certification_level: 'CERTIFIED' | 'WARNING' | 'FAILED';
    source_agreement_score: number;
    slippage_delta_bps: number;
    input_token_symbol: string;
    output_token_symbol: string;
    created_at: string;
  }[];
}

const DEMO_AGENT: AgentProfile = {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
  agentId: 'bench-demo-agent',
  framework: 'custom-ts',
  benchScore: 94,
  certificationRate: 96.2,
  avgSlippage: 4.7,
  honorRate: 99.1,
  stats: { total: 312, certified: 300, warning: 10, failed: 2, honored: 295, violated: 5 },
  recentCerts: [
    { cert_hash: '0xa7c4d5e6f789012345e3f1', certification_level: 'CERTIFIED', source_agreement_score: 92, slippage_delta_bps: 5, input_token_symbol: 'USDC', output_token_symbol: 'WETH', created_at: new Date(Date.now() - 2 * 60000).toISOString() },
    { cert_hash: '0xb8d5e6f7890123456f402', certification_level: 'CERTIFIED', source_agreement_score: 88, slippage_delta_bps: 8, input_token_symbol: 'USDC', output_token_symbol: 'WOKB', created_at: new Date(Date.now() - 7 * 60000).toISOString() },
    { cert_hash: '0xc9e6f78901234567890513', certification_level: 'WARNING', source_agreement_score: 62, slippage_delta_bps: 23, input_token_symbol: 'WETH', output_token_symbol: 'USDC', created_at: new Date(Date.now() - 12 * 60000).toISOString() },
    { cert_hash: '0xdaf7089012345678901624', certification_level: 'CERTIFIED', source_agreement_score: 95, slippage_delta_bps: 2, input_token_symbol: 'WOKB', output_token_symbol: 'USDC', created_at: new Date(Date.now() - 17 * 60000).toISOString() },
  ],
};

const LEVEL_COLORS = {
  CERTIFIED: 'text-bench-green',
  WARNING: 'text-bench-yellow',
  FAILED: 'text-bench-red',
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

export default async function AgentProfilePage({ params }: { params: Promise<{ addr: string }> }) {
  const { addr } = await params;
  const agent = await fetchApi<AgentProfile>(`/v1/agents/${addr}`, {
    ...DEMO_AGENT,
    address: addr,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-bench-muted text-sm">Agent Profile</p>
          <p className="font-mono text-lg">{agent.address}</p>
          {agent.agentId && (
            <p className="text-bench-muted text-sm">
              {agent.agentId} {agent.framework ? `(${agent.framework})` : ''}
            </p>
          )}
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
              key={cert.cert_hash}
              href={`/cert/${cert.cert_hash}`}
              className="flex items-center justify-between bg-bench-surface border border-bench-border rounded-lg p-3 hover:border-bench-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`font-bold text-xs ${LEVEL_COLORS[cert.certification_level]}`}>
                  {cert.certification_level}
                </span>
                <span className="font-mono text-sm text-bench-muted">
                  {cert.cert_hash.slice(0, 14)}...
                </span>
                <span className="text-sm">
                  {cert.input_token_symbol}/{cert.output_token_symbol}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-bench-muted">
                <span>Agreement: {cert.source_agreement_score}/100</span>
                <span>{cert.slippage_delta_bps} bps</span>
                <span>{timeAgo(cert.created_at)}</span>
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
