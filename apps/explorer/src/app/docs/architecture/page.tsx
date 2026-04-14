export default function ArchitecturePage() {
  return (
    <div className="prose-bench">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Architecture</h1>
      <p className="text-lg text-zinc-400 leading-relaxed mb-10">
        How Bench is built — from source adapters to on-chain anchoring.
      </p>

      {/* System Diagram */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold tracking-tight mb-6">System Overview</h2>
        <div className="bg-bench-surface border border-bench-border-subtle rounded-xl p-6 font-mono text-xs text-zinc-400 leading-[2] overflow-x-auto">
          <pre className="whitespace-pre">{`
┌─────────────────────────────────────────────────────────────────┐
│                        Agent / Client                           │
│                    POST /v1/certify                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Attestor API (Hono)                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Source Adapters (13)                      │   │
│  │  1inch │ Paraswap │ KyberSwap │ OKX │ OpenOcean │ ...    │   │
│  │        Parallel fan-out, normalized responses             │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                              │                                   │
│  ┌──────────────────────────▼───────────────────────────────┐   │
│  │              Consensus Engine                              │   │
│  │  Outlier removal → Weighted median → Agreement score      │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                              │                                   │
│  ┌──────────────────────────▼───────────────────────────────┐   │
│  │            Certificate Builder                             │   │
│  │  Canonical hash (sorted-key JSON) → EIP-712 signing       │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                              │                                   │
└──────────────────────────────┼──────────────────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
┌──────────────────┐ ┌──────────────┐ ┌────────────────┐
│   PostgreSQL     │ │    Redis     │ │  BenchRegistry │
│  7 tables        │ │  quote cache │ │  X Layer (196) │
│  cert history    │ │  TTL = 12s   │ │  on-chain      │
└──────────────────┘ └──────────────┘ └────────────────┘
          `}</pre>
        </div>
      </section>

      {/* Components */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Component Breakdown</h2>
        <div className="space-y-4">
          {[
            {
              name: '@bench/shared',
              desc: 'Core types, canonical hashing (sorted-key JSON, RFC 8785 subset), EIP-712 signing utilities, and BEC v2 constants. Zero external dependencies.',
            },
            {
              name: '@bench/attestor',
              desc: '13 source adapters, consensus engine, certificate builder, and Hono API server. Each adapter normalizes quotes to a standard format. The consensus engine computes weighted median, agreement scores, and certification levels.',
            },
            {
              name: '@bench/contracts',
              desc: 'BenchRegistry.sol (Solidity 0.8.24) — on-chain certificate anchoring. Stores cert hashes with attestor address and timestamp. Supports single and batch anchoring.',
            },
            {
              name: '@bench/db',
              desc: 'PostgreSQL schema (7 tables) for certificate history, agent profiles, and aggregator performance. Redis layer for quote caching (12s TTL).',
            },
            {
              name: '@bench/skill',
              desc: 'OKX Onchain OS plugin (BenchSkill SDK) — allows agents in the Onchain OS ecosystem to access Bench natively.',
            },
            {
              name: '@usebench/verifier',
              desc: 'Independent verification package. Zero internal dependencies — only uses ethers.js. Anyone can verify a certificate without trusting Bench infrastructure.',
            },
            {
              name: '@bench/explorer',
              desc: 'Next.js 15 dashboard with 7+ routes. Displays live certificates, aggregator rankings, agent leaderboards, and comprehensive documentation.',
            },
          ].map((comp) => (
            <div key={comp.name} className="p-5 rounded-xl bg-bench-surface border border-bench-border-subtle">
              <code className="text-sm font-mono text-white font-bold">{comp.name}</code>
              <p className="text-sm text-bench-muted leading-relaxed mt-2">{comp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Model */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Trust Model</h2>
        <p className="text-zinc-400 leading-relaxed mb-6">
          Bench minimizes trust assumptions at every layer:
        </p>
        <div className="space-y-4">
          {[
            {
              layer: 'Price Data',
              trust: 'Multi-source consensus',
              desc: 'No single source is trusted. The weighted median of 13 independent sources provides the consensus price. Outliers are automatically removed.',
            },
            {
              layer: 'Certificate Integrity',
              trust: 'Cryptographic signing',
              desc: 'Certificates are signed with EIP-712 typed data. The signature is verifiable by anyone with the attestor\'s public key. Tampering is detectable.',
            },
            {
              layer: 'Canonical Hashing',
              trust: 'Deterministic serialization',
              desc: 'Certificate hashes use sorted-key JSON (RFC 8785 subset). Same input always produces the same hash — no ambiguity, no manipulation.',
            },
            {
              layer: 'On-Chain Record',
              trust: 'Blockchain immutability',
              desc: 'Once anchored to BenchRegistry, certificate records cannot be modified or deleted. X Layer provides the immutability guarantee.',
            },
            {
              layer: 'Independent Verification',
              trust: 'Open-source verifier',
              desc: '@usebench/verifier has zero internal dependencies. It reconstructs the expected hash and recovers the signer — no Bench API calls needed.',
            },
          ].map((layer) => (
            <div key={layer.layer} className="p-5 rounded-xl bg-bench-surface border border-bench-border-subtle">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-bold text-white">{layer.layer}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-bench-green/10 text-bench-green border border-bench-green/20">
                  {layer.trust}
                </span>
              </div>
              <p className="text-sm text-bench-muted leading-relaxed">{layer.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Flow */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Data Flow</h2>
        <ol className="space-y-3">
          {[
            'Agent sends POST /v1/certify with token pair, amount, and chain',
            'Attestor checks Redis cache for recent quotes (TTL 12s)',
            'If cache miss: fan out to all 13 adapters in parallel',
            'Each adapter normalizes its response to the standard SourceQuote format',
            'Consensus engine: outlier removal → weighted median → agreement scoring',
            'Certificate builder: canonical hash → EIP-712 sign → BEC v2 certificate',
            'Certificate stored in PostgreSQL, cache updated in Redis',
            'Certificate anchored to BenchRegistry on X Layer (async)',
            'Signed certificate returned to agent',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
              <span className="text-xs font-bold text-bench-dim bg-bench-surface px-2 py-0.5 rounded mt-0.5 shrink-0 tabular-nums">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Nav */}
      <div className="pt-8 border-t border-bench-border-subtle flex justify-between">
        <a href="/docs/integration" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          ← Integration Guide
        </a>
        <a href="/docs/faq" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          FAQ →
        </a>
      </div>
    </div>
  );
}
