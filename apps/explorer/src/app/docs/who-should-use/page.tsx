export default function WhoShouldUsePage() {
  return (
    <div className="prose-bench">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Who Should Use Bench</h1>
      <p className="text-lg text-zinc-400 leading-relaxed mb-10">
        Bench serves anyone who cares about verifiable best-execution in autonomous agent trading.
      </p>

      {/* Agent Developers */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Agent Developers</h2>
        <p className="text-zinc-400 leading-relaxed mb-6">
          If you&apos;re building autonomous trading agents — DCA bots, arbitrage agents, portfolio
          rebalancers, or any agent that executes swaps — Bench gives your users verifiable proof
          that your agent found the best price.
        </p>

        <h3 className="text-lg font-bold mb-3">Use Cases</h3>
        <div className="space-y-3 mb-6">
          {[
            {
              title: 'DCA Agents',
              desc: 'Every recurring buy certified with multi-source consensus. Users see proof that each purchase got the best available price.',
            },
            {
              title: 'Arbitrage Bots',
              desc: 'Verify that your arbitrage bot is actually finding cross-DEX spreads, not just using suboptimal routes.',
            },
            {
              title: 'Portfolio Rebalancers',
              desc: 'When rebalancing across multiple tokens, each swap carries a certificate. Full audit trail of execution quality.',
            },
            {
              title: 'Copy-Trading Agents',
              desc: 'Prove to followers that your agent matches or beats the leader\'s execution price, not just copying at worse rates.',
            },
          ].map((uc) => (
            <div key={uc.title} className="p-4 rounded-xl bg-bench-surface border border-bench-border-subtle">
              <p className="text-sm font-bold text-white mb-1">{uc.title}</p>
              <p className="text-sm text-bench-muted leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold mb-3">What You Get</h3>
        <ul className="space-y-2">
          {[
            'One API call → certified best-execution quote',
            'EIP-712 signed certificate for every swap',
            'Agent reputation score that builds over time',
            'Badge API for displaying certification status',
            'Open-source verifier for your users to check certificates',
          ].map((item) => (
            <li key={item} className="text-sm text-zinc-400 flex items-center gap-2">
              <span className="text-bench-green shrink-0">
                <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
                  <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* DeFi Protocols */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold tracking-tight mb-4">DeFi Protocols & DAOs</h2>
        <p className="text-zinc-400 leading-relaxed mb-6">
          If your protocol manages agent ecosystems, treasury operations, or user-facing swap
          infrastructure, Bench provides the verification layer you need.
        </p>

        <h3 className="text-lg font-bold mb-3">Use Cases</h3>
        <div className="space-y-3 mb-6">
          {[
            {
              title: 'Agent Marketplaces',
              desc: 'Rank and surface agents based on their Bench certification rate and agreement scores. Users can compare agents objectively.',
            },
            {
              title: 'DAO Treasury Management',
              desc: 'When the DAO treasury executes large swaps, Bench certificates provide governance-level proof of best execution.',
            },
            {
              title: 'Protocol-Embedded Agents',
              desc: 'If your protocol runs agents on behalf of users (auto-compounding, yield strategies), Bench proves each action was optimal.',
            },
          ].map((uc) => (
            <div key={uc.title} className="p-4 rounded-xl bg-bench-surface border border-bench-border-subtle">
              <p className="text-sm font-bold text-white mb-1">{uc.title}</p>
              <p className="text-sm text-bench-muted leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Researchers */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Researchers & Auditors</h2>
        <p className="text-zinc-400 leading-relaxed mb-6">
          Bench produces structured, verifiable data about DEX aggregator behavior — useful for
          academic research, audits, and market analysis.
        </p>

        <h3 className="text-lg font-bold mb-3">What You Can Study</h3>
        <ul className="space-y-2 mb-6">
          {[
            'Aggregator price accuracy across chains and pairs',
            'Price spread distribution and consensus behavior',
            'Agent behavior patterns and execution quality over time',
            'Latency characteristics of different DEX aggregators',
            'Market microstructure of cross-aggregator pricing',
          ].map((item) => (
            <li key={item} className="text-sm text-zinc-400 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-bench-muted shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-bench-muted">
          All certificate data is publicly queryable via the Explorer API. No login required.
          On-chain data is permanently available on X Layer.
        </p>
      </section>

      {/* Nav */}
      <div className="pt-8 border-t border-bench-border-subtle flex justify-between">
        <a href="/docs/how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          ← How It Works
        </a>
        <a href="/docs/integration" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          Integration Guide →
        </a>
      </div>
    </div>
  );
}
