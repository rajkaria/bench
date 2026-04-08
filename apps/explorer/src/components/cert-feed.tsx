const DEMO_CERTS = [
  { hash: '0xa7c4d5e6...e3f1', agent: '0x742d...bD18', level: 'CERTIFIED' as const, agreement: 92, delta: 5, sources: 9, chain: 'X Layer', pair: 'USDC/WETH', time: '2m ago' },
  { hash: '0xb8d5e6f7...f402', agent: '0x1234...5678', level: 'CERTIFIED' as const, agreement: 88, delta: 8, sources: 10, chain: 'Ethereum', pair: 'ETH/USDC', time: '5m ago' },
  { hash: '0xc9e6f789...0513', agent: '0xabcd...ef01', level: 'WARNING' as const, agreement: 62, delta: 23, sources: 8, chain: 'Arbitrum', pair: 'ARB/USDC', time: '8m ago' },
  { hash: '0xdaf70890...1624', agent: '0x742d...bD18', level: 'CERTIFIED' as const, agreement: 95, delta: 2, sources: 10, chain: 'X Layer', pair: 'WOKB/USDC', time: '12m ago' },
  { hash: '0xeb081901...2735', agent: '0x5678...9abc', level: 'FAILED' as const, agreement: 38, delta: 67, sources: 7, chain: 'Polygon', pair: 'MATIC/USDC', time: '15m ago' },
];

const LEVEL_STYLES = {
  CERTIFIED: 'bg-bench-green/10 text-bench-green border-bench-green/20',
  WARNING: 'bg-bench-yellow/10 text-bench-yellow border-bench-yellow/20',
  FAILED: 'bg-bench-red/10 text-bench-red border-bench-red/20',
} as const;

export function CertFeed() {
  return (
    <div className="space-y-3">
      {DEMO_CERTS.map((cert) => (
        <a
          key={cert.hash}
          href={`/cert/${cert.hash.replace('...', '')}`}
          className="block bg-bench-surface border border-bench-border rounded-lg p-4 hover:border-bench-accent/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`px-2 py-1 rounded text-xs font-bold border ${LEVEL_STYLES[cert.level]}`}>
                {cert.level}
              </span>
              <span className="text-sm text-bench-muted font-mono">{cert.hash}</span>
            </div>
            <span className="text-xs text-bench-muted">{cert.time}</span>
          </div>
          <div className="mt-3 flex items-center gap-6 text-sm text-bench-muted">
            <span>{cert.pair}</span>
            <span>{cert.chain}</span>
            <span>Agreement: {cert.agreement}/100</span>
            <span>Delta: {cert.delta} bps</span>
            <span>{cert.sources} sources</span>
            <span className="font-mono text-xs">{cert.agent}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
