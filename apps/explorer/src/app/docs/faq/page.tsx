const FAQS = [
  {
    q: 'What is Bench in one sentence?',
    a: 'Bench queries 13 DEX aggregators in parallel, computes consensus best price, and issues a cryptographic certificate proving your agent got the best execution.',
  },
  {
    q: 'Is Bench a DEX aggregator?',
    a: 'No. Bench does not execute trades or route swaps. It is an oracle that certifies best-execution by comparing quotes from 13 existing aggregators. Think of it as the auditor, not the executor.',
  },
  {
    q: 'How is Bench different from Chainlink or Pyth?',
    a: 'Chainlink and Pyth provide general price feeds (e.g., "ETH is $2,847"). Bench provides swap-specific quotes — "for this exact swap, across 13 aggregators, the best price is X, and here\'s the cryptographic proof." Different problem, different solution.',
  },
  {
    q: 'Which DEX aggregators does Bench query?',
    a: '13 sources: 1inch, Paraswap, KyberSwap, OKX DEX (via Onchain OS MCP), OpenOcean, 0x/Matcha, CoW Swap, Odos, LI.FI, Socket, Jupiter (Solana), Uniswap AI, and Dexalot. More sources can be added by contributing an adapter.',
  },
  {
    q: 'What chains does Bench support?',
    a: 'Bench is chain-aware — adapters support different chains. X Layer (chain 196) is the primary deployment. Ethereum, BSC, Polygon, Arbitrum, and other EVM chains are supported by most aggregator adapters. Jupiter handles Solana.',
  },
  {
    q: 'How fast is a certification request?',
    a: 'Typically under 3 seconds. All 13 sources are queried in parallel. The bottleneck is the slowest responding aggregator. Quotes are cached for 12 seconds to avoid redundant queries.',
  },
  {
    q: 'What does "CERTIFIED" vs "WARNING" mean?',
    a: 'CERTIFIED means the agreement score is ≥70 and at least 3 sources responded — strong consensus that the best price is accurate. WARNING means fewer sources responded or agreement is lower — the certificate is valid but the user should be cautious. Single-source certificates always get WARNING.',
  },
  {
    q: 'Can anyone verify a Bench certificate?',
    a: 'Yes. Install @usebench/verifier (npm) and call verify(cert). It reconstructs the canonical hash, recovers the signer from the EIP-712 signature, and checks the on-chain anchor. Zero trust in Bench infrastructure required.',
  },
  {
    q: 'What is on-chain anchoring?',
    a: 'After issuing a certificate, Bench writes the cert hash to the BenchRegistry smart contract on X Layer. This creates a permanent, tamper-proof record that the certificate existed at a specific time. Anyone can query the registry to verify.',
  },
  {
    q: 'Where is the BenchRegistry contract?',
    a: '0x6a400d858daA46C9f955601B672cc1a8899DcE3f on X Layer Mainnet (chain 196). It\'s a simple mapping from cert hash → (attestor, timestamp). You can view it on the OKX Explorer.',
  },
  {
    q: 'Do I need an API key?',
    a: 'Write endpoints (POST /v1/certify) require an API key for rate limiting. Read endpoints (GET /v1/stats, /v1/certs, etc.) are public — no authentication required.',
  },
  {
    q: 'Is Bench open source?',
    a: 'Yes. The entire codebase — attestor, contracts, verifier, explorer, and shared libraries — is open source. You can audit every line, run your own attestor, and independently verify any certificate.',
  },
  {
    q: 'What happens if an aggregator is down?',
    a: 'Bench adapts gracefully. If a source fails to respond within the timeout, it is excluded from consensus. The certificate reflects how many sources actually responded (e.g., 11/13). As long as ≥2 sources respond, a certificate can be issued.',
  },
  {
    q: 'Can I run my own Bench attestor?',
    a: 'Yes. Clone the repo, configure your .env with an attestor keypair, and run the attestor server. You\'ll be signing certificates with your own key. You can even deploy your own BenchRegistry.',
  },
  {
    q: 'How does the consensus algorithm work?',
    a: 'Quotes are first filtered for outliers (>2 standard deviations from median). Remaining quotes are weighted by source tier (Tier 1 = higher weight). The weighted median is computed as the consensus price. Each source gets an agreement score (0-100) based on distance from consensus. The overall agreement score is the weighted average.',
  },
  {
    q: 'What is a Bench Execution Certificate (BEC v2)?',
    a: 'The BEC v2 is the structured data format for a Bench certificate. It contains the cert hash, all quote data, consensus results, certification level, and an EIP-712 signature. It\'s the artifact that proves best-execution.',
  },
];

export default function FAQPage() {
  return (
    <div className="prose-bench">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">FAQ</h1>
      <p className="text-lg text-zinc-400 leading-relaxed mb-10">
        Common questions about Bench from developers, protocols, and researchers.
      </p>

      <div className="space-y-6">
        {FAQS.map((faq, i) => (
          <div key={i} className="pb-6 border-b border-bench-border-subtle last:border-0">
            <h3 className="text-base font-bold mb-3">{faq.q}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      {/* Nav */}
      <div className="pt-8 border-t border-bench-border-subtle">
        <a href="/docs/architecture" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          ← Architecture
        </a>
      </div>
    </div>
  );
}
