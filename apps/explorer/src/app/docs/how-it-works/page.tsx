export default function HowItWorksPage() {
  return (
    <div className="prose-bench">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">How It Works</h1>
      <p className="text-lg text-zinc-400 leading-relaxed mb-10">
        From quote request to on-chain anchored certificate — the full Bench pipeline in detail.
      </p>

      {/* Step 1: Query */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-lg bg-bench-surface border border-bench-border flex items-center justify-center text-xs font-bold text-bench-muted">1</span>
          <h2 className="text-2xl font-bold tracking-tight">Query Fan-Out</h2>
        </div>
        <p className="text-zinc-400 leading-relaxed mb-4">
          When an agent requests a quote, Bench dispatches parallel requests to all 13 supported
          DEX aggregators. Each adapter normalizes the response into a standard format:
        </p>
        <div className="bg-bench-surface border border-bench-border-subtle rounded-xl p-5 font-mono text-sm text-zinc-400 leading-[1.8] mb-4">
          <span className="text-bench-dim">{'// Each source returns:'}</span><br />
          {'{'}<br />
          {'  '}source: <span className="text-zinc-500">&quot;1inch&quot;</span>,<br />
          {'  '}outputAmount: <span className="text-zinc-500">&quot;2847320000&quot;</span>,<br />
          {'  '}gasEstimate: <span className="text-zinc-500">&quot;145000&quot;</span>,<br />
          {'  '}latencyMs: <span className="text-purple-400">98</span>,<br />
          {'  '}route: <span className="text-zinc-500">&quot;ETH → WETH → USDC&quot;</span>,<br />
          {'  '}success: <span className="text-blue-400">true</span><br />
          {'}'}
        </div>

        <h3 className="text-lg font-bold mb-3 mt-8">Supported Sources (13)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { name: '1inch', tier: 'Tier 1' },
            { name: 'Paraswap', tier: 'Tier 1' },
            { name: 'KyberSwap', tier: 'Tier 1' },
            { name: 'OKX DEX', tier: 'Tier 1' },
            { name: 'OpenOcean', tier: 'Tier 1' },
            { name: '0x/Matcha', tier: 'Tier 1' },
            { name: 'CoW Swap', tier: 'Tier 2' },
            { name: 'Odos', tier: 'Tier 2' },
            { name: 'LI.FI', tier: 'Tier 2' },
            { name: 'Socket', tier: 'Tier 2' },
            { name: 'Jupiter', tier: 'Solana' },
            { name: 'Uniswap AI', tier: 'Tier 1' },
            { name: 'Dexalot', tier: 'Tier 3' },
          ].map((s) => (
            <div key={s.name} className="px-3 py-2 rounded-lg bg-bench-surface border border-bench-border-subtle text-sm">
              <span className="text-white font-medium">{s.name}</span>
              <span className="text-bench-dim text-xs ml-2">{s.tier}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-bench-muted mt-4">
          Sources are weighted by tier. Tier 1 sources have higher weight in consensus.
          Failed sources are excluded — Bench adapts to whatever responds successfully.
        </p>
      </section>

      {/* Step 2: Consensus */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-lg bg-bench-surface border border-bench-border flex items-center justify-center text-xs font-bold text-bench-muted">2</span>
          <h2 className="text-2xl font-bold tracking-tight">Consensus Engine</h2>
        </div>
        <p className="text-zinc-400 leading-relaxed mb-4">
          Once quotes arrive, the consensus engine processes them:
        </p>
        <ol className="space-y-4 mb-6">
          {[
            {
              title: 'Outlier Removal',
              desc: 'Quotes that deviate more than 2 standard deviations from the median are flagged as outliers and excluded from consensus.',
            },
            {
              title: 'Weighted Median',
              desc: 'Remaining quotes are weighted by source tier and used to compute the weighted median price — the consensus best price.',
            },
            {
              title: 'Agreement Scoring',
              desc: 'Each source is scored 0-100 based on how close its quote is to the consensus. The overall agreement score is the weighted average.',
            },
            {
              title: 'Best Price Identification',
              desc: 'The source offering the highest output amount (best execution) is identified. This may differ from the consensus median.',
            },
            {
              title: 'Certification Level',
              desc: 'Based on agreement score and source count: CERTIFIED (≥70, ≥3 sources), WARNING (below threshold), FAILED (critical disagreement).',
            },
          ].map((step, i) => (
            <li key={step.title} className="flex items-start gap-4">
              <span className="text-xs font-bold text-bench-dim bg-bench-surface px-2 py-1 rounded mt-0.5 shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <div>
                <p className="text-sm font-bold text-white mb-1">{step.title}</p>
                <p className="text-sm text-bench-muted leading-relaxed">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Step 3: Certificate */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-lg bg-bench-surface border border-bench-border flex items-center justify-center text-xs font-bold text-bench-muted">3</span>
          <h2 className="text-2xl font-bold tracking-tight">Certificate Issuance (BEC v2)</h2>
        </div>
        <p className="text-zinc-400 leading-relaxed mb-4">
          The Bench Execution Certificate (BEC v2) is a structured, signed attestation containing:
        </p>
        <div className="bg-bench-surface border border-bench-border-subtle rounded-xl p-5 font-mono text-sm text-zinc-400 leading-[1.8] mb-4">
          {'{'}<br />
          {'  '}certHash: <span className="text-zinc-500">&quot;0xabc...&quot;</span>,<br />
          {'  '}agentAddress: <span className="text-zinc-500">&quot;0x5a6A...&quot;</span>,<br />
          {'  '}chainId: <span className="text-purple-400">196</span>,<br />
          {'  '}inputToken: <span className="text-zinc-500">&quot;ETH&quot;</span>,<br />
          {'  '}outputToken: <span className="text-zinc-500">&quot;USDC&quot;</span>,<br />
          {'  '}inputAmount: <span className="text-zinc-500">&quot;1000000000000000000&quot;</span>,<br />
          {'  '}bestSource: <span className="text-zinc-500">&quot;1inch&quot;</span>,<br />
          {'  '}bestOutputAmount: <span className="text-zinc-500">&quot;2847320000&quot;</span>,<br />
          {'  '}sourceAgreementScore: <span className="text-purple-400">94</span>,<br />
          {'  '}certificationLevel: <span className="text-zinc-500">&quot;CERTIFIED&quot;</span>,<br />
          {'  '}sourcesSuccessful: <span className="text-purple-400">11</span>,<br />
          {'  '}sourcesTotal: <span className="text-purple-400">13</span>,<br />
          {'  '}signature: <span className="text-zinc-500">&quot;0x...&quot;</span> <span className="text-bench-dim">// EIP-712</span><br />
          {'}'}
        </div>

        <h3 className="text-lg font-bold mb-3 mt-8">EIP-712 Signing</h3>
        <p className="text-zinc-400 leading-relaxed mb-4">
          Certificates are signed using EIP-712 typed structured data. The signing domain is:
        </p>
        <div className="bg-bench-surface border border-bench-border-subtle rounded-xl p-5 font-mono text-sm text-zinc-400 leading-[1.8]">
          {'{ name: "Bench", version: "2", chainId: 196 }'}
        </div>
      </section>

      {/* Step 4: On-Chain */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-lg bg-bench-surface border border-bench-border flex items-center justify-center text-xs font-bold text-bench-muted">4</span>
          <h2 className="text-2xl font-bold tracking-tight">On-Chain Anchoring</h2>
        </div>
        <p className="text-zinc-400 leading-relaxed mb-4">
          Certificates are anchored to the BenchRegistry smart contract on X Layer (chain 196).
          The registry stores:
        </p>
        <ul className="space-y-2 mb-4">
          {[
            'Certificate hash (bytes32)',
            'Attestor address (who signed)',
            'Timestamp (block.timestamp)',
            'On-chain queryable by cert hash or attestor',
          ].map((item) => (
            <li key={item} className="text-sm text-zinc-400 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-bench-muted shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="bg-bench-surface border border-bench-border-subtle rounded-xl p-4 text-sm">
          <p className="text-bench-muted">
            <strong className="text-white">Contract:</strong>{' '}
            <code className="text-xs font-mono text-zinc-400">0x6a400d858daA46C9f955601B672cc1a8899DcE3f</code>
          </p>
          <p className="text-bench-muted mt-1">
            <strong className="text-white">Chain:</strong> X Layer Mainnet (196)
          </p>
        </div>
      </section>

      {/* Nav */}
      <div className="pt-8 border-t border-bench-border-subtle flex justify-between">
        <a href="/docs/what-is-bench" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          ← What is Bench
        </a>
        <a href="/docs/who-should-use" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          Who Should Use Bench →
        </a>
      </div>
    </div>
  );
}
