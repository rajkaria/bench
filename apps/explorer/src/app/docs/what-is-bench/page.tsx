export default function WhatIsBenchPage() {
  return (
    <div className="prose-bench">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">What is Bench</h1>
      <p className="text-lg text-zinc-400 leading-relaxed mb-10">
        Bench is the NBBO (National Best Bid and Offer) for autonomous agent trading — a
        multi-source best-execution oracle that proves your agent got the best price.
      </p>

      {/* The Problem */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-4">The Problem</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          Autonomous trading agents are making millions of swap decisions daily across DeFi.
          But there&apos;s a fundamental trust problem: <strong className="text-white">how do you know your agent
          got the best price?</strong>
        </p>
        <p className="text-zinc-400 leading-relaxed mb-4">
          Today, most agents query a single DEX aggregator — 1inch, Paraswap, or whatever
          the developer chose. The user has no way to verify whether that was the best available
          price or whether the agent could have done better elsewhere.
        </p>
        <div className="bg-bench-surface border border-bench-border-subtle rounded-xl p-6 my-6">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <strong className="text-white">The single-source problem:</strong> If your agent only
            checks one aggregator, you&apos;re trusting that one source to give the best price.
            Aggregator prices can vary by 0.1% to 3%+ depending on the pair, chain, and liquidity.
            On a $100k swap, that&apos;s $100 to $3,000 in potential slippage — invisible and unverifiable.
          </p>
        </div>
      </section>

      {/* The NBBO Analogy */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-4">The NBBO Analogy</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          In traditional finance, the NBBO (National Best Bid and Offer) is a regulation
          that requires brokers to execute trades at the best available price across all
          exchanges. It exists because no single exchange has the best price all the time.
        </p>
        <p className="text-zinc-400 leading-relaxed mb-4">
          DeFi has no such protection. Bench fills that gap for autonomous agents by:
        </p>
        <ul className="space-y-3 mb-4">
          {[
            'Querying 13 DEX aggregators simultaneously to discover the true best price',
            'Computing a consensus score that measures how much sources agree',
            'Issuing a cryptographic certificate (BEC v2) that anyone can verify',
            'Anchoring certificates on-chain for permanent, tamper-proof records',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-zinc-400">
              <span className="text-bench-green mt-1 shrink-0">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Key Benefits */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Key Benefits</h2>
        <div className="grid gap-4">
          {[
            {
              title: 'Best-Execution Proof',
              desc: 'Every swap comes with a cryptographic certificate proving the agent found the best price across 13 sources. Not a promise — a proof.',
            },
            {
              title: 'Source-Agnostic',
              desc: 'Bench is not an aggregator. It queries all the aggregators and tells you which one has the best price. No vendor lock-in, no conflicts of interest.',
            },
            {
              title: 'Independent Verification',
              desc: 'Anyone can verify a Bench certificate using the open-source @usebench/verifier package. No trust required — just math.',
            },
            {
              title: 'On-Chain Anchoring',
              desc: 'Certificates are anchored to BenchRegistry on X Layer. Permanent, tamper-proof, queryable on-chain.',
            },
            {
              title: 'Agent Reputation',
              desc: 'Bench tracks agent performance over time — certified rate, average agreement, sources used. Build reputation through verifiable behavior.',
            },
            {
              title: 'Sub-3-Second Latency',
              desc: 'All 13 sources are queried in parallel. Consensus computed, certificate signed, and returned — typically in under 3 seconds.',
            },
          ].map((benefit) => (
            <div key={benefit.title} className="p-5 rounded-xl bg-bench-surface border border-bench-border-subtle">
              <h3 className="text-sm font-bold mb-2">{benefit.title}</h3>
              <p className="text-sm text-bench-muted leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What Bench Is Not */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-4">What Bench Is Not</h2>
        <ul className="space-y-3">
          {[
            { bold: 'Not a DEX aggregator', desc: '— Bench does not execute trades. It certifies prices.' },
            { bold: 'Not a price oracle', desc: '— Unlike Chainlink or Pyth, Bench provides swap-specific quotes, not general price feeds.' },
            { bold: 'Not a trading bot', desc: '— Bench is infrastructure that trading bots use to prove best execution.' },
          ].map((item) => (
            <li key={item.bold} className="text-sm text-zinc-400 leading-relaxed">
              <strong className="text-white">{item.bold}</strong>{item.desc}
            </li>
          ))}
        </ul>
      </section>

      {/* Next */}
      <div className="pt-8 border-t border-bench-border-subtle">
        <a href="/docs/how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          Next: How It Works →
        </a>
      </div>
    </div>
  );
}
