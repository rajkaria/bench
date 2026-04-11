import { fetchApi } from '@/lib/api';

interface CertSummary {
  cert_hash: string;
  agent_address: string;
  certification_level: 'CERTIFIED' | 'WARNING' | 'FAILED';
  source_agreement_score: number;
  slippage_delta_bps: number;
  sources_successful: number;
  chain_id: number;
  input_token_symbol: string;
  output_token_symbol: string;
  created_at: string;
}

const CHAIN_NAMES: Record<number, string> = {
  196: 'X Layer',
  1: 'Ethereum',
  42161: 'Arbitrum',
  137: 'Polygon',
  8453: 'Base',
};

const DEMO_CERTS: CertSummary[] = [
  { cert_hash: '0xa7c4d5e6f789012345e3f1', agent_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18', certification_level: 'CERTIFIED', source_agreement_score: 92, slippage_delta_bps: 5, sources_successful: 9, chain_id: 196, input_token_symbol: 'USDC', output_token_symbol: 'WETH', created_at: new Date(Date.now() - 2 * 60000).toISOString() },
  { cert_hash: '0xb8d5e6f7890123456f402', agent_address: '0x1234abcd56789012345678', certification_level: 'CERTIFIED', source_agreement_score: 88, slippage_delta_bps: 8, sources_successful: 10, chain_id: 1, input_token_symbol: 'ETH', output_token_symbol: 'USDC', created_at: new Date(Date.now() - 5 * 60000).toISOString() },
  { cert_hash: '0xc9e6f78901234567890513', agent_address: '0xabcdef0123456789abcd', certification_level: 'WARNING', source_agreement_score: 62, slippage_delta_bps: 23, sources_successful: 8, chain_id: 42161, input_token_symbol: 'ARB', output_token_symbol: 'USDC', created_at: new Date(Date.now() - 8 * 60000).toISOString() },
  { cert_hash: '0xdaf7089012345678901624', agent_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18', certification_level: 'CERTIFIED', source_agreement_score: 95, slippage_delta_bps: 2, sources_successful: 10, chain_id: 196, input_token_symbol: 'WOKB', output_token_symbol: 'USDC', created_at: new Date(Date.now() - 12 * 60000).toISOString() },
  { cert_hash: '0xeb0819012345678902735', agent_address: '0x5678901234567890abcd', certification_level: 'FAILED', source_agreement_score: 38, slippage_delta_bps: 67, sources_successful: 7, chain_id: 137, input_token_symbol: 'MATIC', output_token_symbol: 'USDC', created_at: new Date(Date.now() - 15 * 60000).toISOString() },
];

const LEVEL_STYLES = {
  CERTIFIED: 'bg-bench-green/10 text-bench-green border-bench-green/20',
  WARNING: 'bg-bench-yellow/10 text-bench-yellow border-bench-yellow/20',
  FAILED: 'bg-bench-red/10 text-bench-red border-bench-red/20',
} as const;

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

export async function CertFeed() {
  const certs = await fetchApi<CertSummary[]>('/v1/certs', DEMO_CERTS);

  return (
    <div className="space-y-3">
      {certs.map((cert) => (
        <a
          key={cert.cert_hash}
          href={`/cert/${cert.cert_hash}`}
          className="block bg-bench-surface border border-bench-border rounded-lg p-4 hover:border-bench-accent/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`px-2 py-1 rounded text-xs font-bold border ${LEVEL_STYLES[cert.certification_level]}`}>
                {cert.certification_level}
              </span>
              <span className="text-sm text-bench-muted font-mono">
                {cert.cert_hash.slice(0, 18)}...
              </span>
            </div>
            <span className="text-xs text-bench-muted">{timeAgo(cert.created_at)}</span>
          </div>
          <div className="mt-3 flex items-center gap-6 text-sm text-bench-muted">
            <span>{cert.input_token_symbol}/{cert.output_token_symbol}</span>
            <span>{CHAIN_NAMES[cert.chain_id] ?? `Chain ${cert.chain_id}`}</span>
            <span>Agreement: {cert.source_agreement_score}/100</span>
            <span>Delta: {cert.slippage_delta_bps} bps</span>
            <span>{cert.sources_successful} sources</span>
            <span className="font-mono text-xs">
              {cert.agent_address.slice(0, 6)}...{cert.agent_address.slice(-4)}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
