import { SourceBar } from '@/components/source-bar';
import { fetchApi } from '@/lib/api';

interface CertDetail {
  certHash: string;
  certId?: string;
  level: 'CERTIFIED' | 'WARNING' | 'FAILED';
  delta: number;
  agreement: number;
  confidenceTier: string;
  agent: { address: string; agentId?: string };
  trade: { chain: string; block: number; pair: string };
  chosen: { source: string; output: string };
  sources: {
    source: string;
    output: string;
    outputRaw: number;
    best?: boolean;
    chosen?: boolean;
    latency?: number;
  }[];
  failedSources: { source: string; error: string }[];
  median: string;
  stddev: string;
  execution: { txHash: string; actual: string; status: 'HONORED' | 'VIOLATED' | 'PENDING' } | null;
  attestor: { address: string; signature: string };
  anchor: { chain: string; block: number } | null;
  queryDuration: number;
}

const DEMO_CERT: CertDetail = {
  certHash: '0xa7c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef0123',
  certId: '550e8400-e29b-41d4-a716-446655440000',
  level: 'CERTIFIED',
  delta: 5,
  agreement: 92,
  confidenceTier: 'STRONG',
  agent: { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18', agentId: 'bench-demo-agent' },
  trade: { chain: 'X Layer (196)', block: 8472193, pair: '1000.0 USDC -> WETH' },
  chosen: { source: 'Uniswap V3', output: '0.4203 WETH' },
  sources: [
    { source: '1inch', output: '0.42051', outputRaw: 420510, best: true, latency: 198 },
    { source: 'OKX Aggregator', output: '0.42050', outputRaw: 420500, best: false, latency: 142 },
    { source: 'Velora', output: '0.42040', outputRaw: 420400, best: false, latency: 187 },
    { source: 'Odos', output: '0.42040', outputRaw: 420400, best: false, latency: 312 },
    { source: 'Uniswap AI', output: '0.42030', outputRaw: 420300, best: false, latency: 178, chosen: true },
    { source: 'Kyber', output: '0.42020', outputRaw: 420200, best: false, latency: 256 },
    { source: '0x', output: '0.42010', outputRaw: 420100, best: false, latency: 234 },
    { source: 'Bebop', output: '0.41980', outputRaw: 419800, best: false, latency: 423 },
    { source: 'OpenOcean', output: '0.41960', outputRaw: 419600, best: false, latency: 367 },
  ],
  failedSources: [{ source: 'CoW Swap', error: 'timeout' }],
  median: '0.4203 WETH',
  stddev: '0.0003 WETH (0.07%)',
  execution: { txHash: '0x...abc', actual: '0.4203 WETH', status: 'HONORED' },
  attestor: { address: '0xBenchAttestor...', signature: 'Valid' },
  anchor: { chain: 'X Layer', block: 8472194 },
  queryDuration: 2843,
};

const LEVEL_COLORS = {
  CERTIFIED: 'text-bench-green',
  WARNING: 'text-bench-yellow',
  FAILED: 'text-bench-red',
};

const LEVEL_ICONS = { CERTIFIED: '✅', WARNING: '⚠️', FAILED: '❌' };

export default async function CertDetailPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const cert = await fetchApi<CertDetail>(`/v1/certs/${hash}`, {
    ...DEMO_CERT,
    certHash: hash,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-bench-muted text-sm">Certificate</p>
          <p className="font-mono text-sm break-all">{cert.certHash}</p>
        </div>
        <span className={`text-3xl font-bold ${LEVEL_COLORS[cert.level]}`}>
          {cert.level} {LEVEL_ICONS[cert.level]}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-bench-surface border border-bench-border rounded-lg p-4">
          <p className="text-bench-muted text-xs">Slippage Delta</p>
          <p className="text-2xl font-bold">{cert.delta} bps</p>
        </div>
        <div className="bg-bench-surface border border-bench-border rounded-lg p-4">
          <p className="text-bench-muted text-xs">Agreement Score</p>
          <p className="text-2xl font-bold">{cert.agreement}/100</p>
        </div>
        <div className="bg-bench-surface border border-bench-border rounded-lg p-4">
          <p className="text-bench-muted text-xs">Confidence</p>
          <p className="text-2xl font-bold text-bench-green">{cert.confidenceTier}</p>
        </div>
      </div>

      {/* Swap Info */}
      <Section title="SWAP">
        <InfoRow label="Agent" value={`${cert.agent.address.slice(0, 10)}...${cert.agent.address.slice(-4)}${cert.agent.agentId ? ` (${cert.agent.agentId})` : ''}`} />
        <InfoRow label="Chain" value={cert.trade.chain} />
        <InfoRow label="Block" value={cert.trade.block.toString()} />
        <InfoRow label="Trade" value={cert.trade.pair} />
        <InfoRow label="Chosen" value={`${cert.chosen.output} (${cert.chosen.source})`} />
      </Section>

      {/* Multi-Source Query */}
      <Section title={`MULTI-SOURCE QUERY (${cert.sources.length + cert.failedSources.length} sources)`}>
        <div className="space-y-2">
          {cert.sources.map((s) => (
            <SourceBar
              key={s.source}
              source={s.source}
              output={s.output}
              value={s.outputRaw}
              maxValue={cert.sources[0]!.outputRaw}
              isBest={s.best ?? false}
              isChosen={s.chosen ?? false}
              latency={s.latency ?? 0}
            />
          ))}
          {cert.failedSources.map((s) => (
            <div key={s.source} className="flex items-center gap-3 text-sm">
              <span className="w-32 text-right text-bench-muted">{s.source}</span>
              <div className="flex-1 bg-bench-red/10 rounded h-6 flex items-center px-2">
                <span className="text-bench-red text-xs">{s.error.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-bench-muted">
          <div>Median: {cert.median}</div>
          <div>Std Dev: {cert.stddev}</div>
          <div>Query Time: {cert.queryDuration}ms</div>
        </div>
      </Section>

      {/* Execution */}
      {cert.execution && (
        <Section title="EXECUTION">
          <InfoRow label="TX Hash" value={cert.execution.txHash} />
          <InfoRow label="Actual" value={cert.execution.actual} />
          <InfoRow
            label="Status"
            value={`${cert.execution.status} ${cert.execution.status === 'HONORED' ? '✅' : cert.execution.status === 'VIOLATED' ? '❌' : '⏳'}`}
            className={cert.execution.status === 'HONORED' ? 'text-bench-green' : cert.execution.status === 'VIOLATED' ? 'text-bench-red' : ''}
          />
        </Section>
      )}

      {/* Attestor */}
      <Section title="ATTESTOR">
        <InfoRow label="Address" value={cert.attestor.address} />
        <InfoRow label="Signature" value={cert.attestor.signature} />
        {cert.anchor && (
          <InfoRow label="Anchor" value={`${cert.anchor.chain} block ${cert.anchor.block}`} />
        )}
      </Section>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-bench-accent text-white rounded-lg font-bold hover:bg-bench-accent/90 transition-colors">
          Verify Independently
        </button>
        <button className="px-4 py-2 border border-bench-border rounded-lg text-bench-muted hover:text-white transition-colors">
          Download JSON
        </button>
        <button className="px-4 py-2 border border-bench-border rounded-lg text-bench-muted hover:text-white transition-colors">
          Embed Badge
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-bench-surface border border-bench-border rounded-lg p-5">
      <h3 className="text-sm font-bold text-bench-muted mb-3">{title}</h3>
      {children}
    </section>
  );
}

function InfoRow({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-center py-1 text-sm">
      <span className="w-24 text-bench-muted">{label}:</span>
      <span className={`font-mono ${className ?? ''}`}>{value}</span>
    </div>
  );
}
