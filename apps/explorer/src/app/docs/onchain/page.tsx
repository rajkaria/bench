export default function OnchainPage() {
  return (
    <div className="prose-bench">
      {/* Hero */}
      <p className="text-xs font-semibold uppercase tracking-[2px] text-bench-dim mb-3">The On-Chain Story</p>
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">
        From Quote to Proof:<br />
        <span className="text-bench-green">Bench on X Layer</span>
      </h1>
      <p className="text-zinc-400 text-sm leading-relaxed mb-12 max-w-[560px]">
        Every certificate Bench issues becomes an immutable, verifiable record on X Layer Mainnet.
        This is the story of what happens on-chain — what&apos;s live today, and where it&apos;s going.
      </p>

      {/* Chapter 1: The Problem */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-8 rounded-lg bg-bench-surface border border-bench-border flex items-center justify-center text-xs font-bold">1</span>
          <h2 className="text-2xl font-bold">The Trust Gap</h2>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">
          An autonomous agent says it got the best price on a swap. But who verified that? The agent
          itself? That&apos;s like asking a student to grade their own exam.
        </p>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">
          Before Bench, there was no way to independently prove that an agent&apos;s trade was
          optimal — or even fair. Execution quality was a black box. DAOs allocated millions to
          trading agents with zero accountability for the routes they chose.
        </p>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Bench changes this by creating a <strong className="text-white">cryptographic paper trail</strong> that
          starts with 13 DEX aggregators and ends with an immutable record on X Layer.
        </p>
      </section>

      {/* Chapter 2: The Journey */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-8 rounded-lg bg-bench-surface border border-bench-border flex items-center justify-center text-xs font-bold">2</span>
          <h2 className="text-2xl font-bold">The Journey of a Certificate</h2>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
          Every on-chain anchor starts the same way — an agent asks a question:
          <em className="text-zinc-300"> &quot;Is this a good trade?&quot;</em>
        </p>

        <div className="space-y-4 mb-6">
          {[
            {
              step: 'A',
              title: 'The Query',
              desc: 'An agent calls POST /v1/certify with its swap details — tokens, amount, chain, slippage tolerance.',
            },
            {
              step: 'B',
              title: 'The Fan-Out',
              desc: '13 DEX aggregators are queried in parallel: 1inch, Paraswap, KyberSwap, OKX, OpenOcean, 0x, CoW Swap, Odos, LI.FI, Socket, Jupiter, Uniswap, and Dexalot. Each returns its best quote.',
            },
            {
              step: 'C',
              title: 'The Consensus',
              desc: 'Outliers are removed using median absolute deviation. The remaining quotes produce a consensus best price and an agreement score (0-100%) measuring how closely sources aligned.',
            },
            {
              step: 'D',
              title: 'The Signature',
              desc: 'A BEC v2 certificate is built — containing every quote, the consensus result, and a certification level (CERTIFIED / WARNING / FAILED). The attestor signs it using EIP-712 typed data.',
            },
            {
              step: 'E',
              title: 'The Anchor',
              desc: 'The certificate hash, certification level, agreement score, and source counts are written to BenchRegistry.sol on X Layer. This happens asynchronously — the API returns immediately while the transaction confirms in the background.',
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start">
              <span className="text-xs font-bold text-bench-dim bg-bench-surface px-2 py-0.5 rounded shrink-0 mt-1">
                {item.step}
              </span>
              <div>
                <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-zinc-400 leading-relaxed">
          By the time the agent receives its certificate, the proof is already being committed to X Layer.
          No extra step. No opt-in. Every cert is anchored.
        </p>
      </section>

      {/* Chapter 3: What's On-Chain Today */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-8 rounded-lg bg-bench-surface border border-bench-border flex items-center justify-center text-xs font-bold">3</span>
          <h2 className="text-2xl font-bold">What&apos;s On-Chain Today</h2>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
          BenchRegistry.sol is live on X Layer Mainnet. Here&apos;s what&apos;s already provable on-chain:
        </p>

        <div className="bg-bench-surface border border-bench-border-subtle rounded-xl p-5 mb-6">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-bench-dim mb-4">Live Contract</p>
          <div className="font-mono text-sm text-zinc-400 leading-[1.8] break-all">
            <span className="text-bench-dim">Address:</span>{' '}
            <span className="text-white">0x6a400d858daA46C9f955601B672cc1a8899DcE3f</span>
            <br />
            <span className="text-bench-dim">Chain:</span> X Layer Mainnet (196)
            <br />
            <span className="text-bench-dim">Status:</span>{' '}
            <span className="text-bench-green">Actively anchoring certificates</span>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              fn: 'anchorCertificate()',
              status: 'Live',
              desc: 'Every certificate issued by the attestor is anchored automatically. The cert hash, certification level, agreement score, and source counts become permanent on-chain records. Duplicates are rejected — each cert can only be anchored once.',
            },
            {
              fn: 'batchAnchor()',
              status: 'Live',
              desc: 'Gas-efficient batching for high-throughput scenarios. Multiple certs can be anchored in a single transaction, reducing per-cert gas cost for bulk operations.',
            },
            {
              fn: 'getAgentStats()',
              status: 'Live',
              desc: 'Trustless on-chain reputation. Anyone can query how many CERTIFIED, WARNING, and FAILED certs an agent has received — no API needed, no trust required. This is the foundation of agent accountability.',
            },
            {
              fn: 'getAnchor()',
              status: 'Live',
              desc: 'Full cert lookup by hash. Returns the anchor record including block number, timestamp, certification level, agreement score, sources queried, sources successful, and the attestor signature hash.',
            },
            {
              fn: 'getAgentCerts()',
              status: 'Live',
              desc: 'Paginated certificate history per agent. Protocols can enumerate every cert an agent has ever received, building a complete execution quality timeline.',
            },
          ].map((item) => (
            <div key={item.fn} className="p-4 rounded-xl bg-bench-surface/50 border border-bench-border-subtle">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-sm font-mono text-white">{item.fn}</code>
                <span className="text-xs px-2 py-0.5 rounded-full bg-bench-green/10 text-bench-green border border-bench-green/20">
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chapter 4: Post-Trade Accountability */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-8 rounded-lg bg-bench-surface border border-bench-border flex items-center justify-center text-xs font-bold">4</span>
          <h2 className="text-2xl font-bold">Post-Trade Accountability</h2>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">
          Certification is only half the story. The other half: <em className="text-zinc-300">did the agent actually follow through?</em>
        </p>
        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
          BenchRegistry has a built-in mechanism for closing the accountability loop:
        </p>

        <div className="p-5 rounded-xl bg-bench-surface border border-bench-border-subtle mb-6">
          <div className="flex items-center gap-2 mb-3">
            <code className="text-sm font-mono text-white">markExecutionVerified()</code>
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              Ready
            </span>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed mb-3">
            After an agent executes a trade, the attestor can record whether the execution
            honored the certified route. This writes three pieces of data on-chain:
          </p>
          <ul className="space-y-2">
            {[
              'The original cert hash — linking back to the pre-trade certification',
              'Whether the execution was honored — did the agent use the certified route?',
              'The transaction hash — pointing to the actual swap on-chain',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                <span className="text-bench-green mt-1 shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-zinc-400 leading-relaxed">
          This creates a complete audit trail: pre-trade certification <strong className="text-white">&rarr;</strong> on-chain
          anchor <strong className="text-white">&rarr;</strong> execution verification. Every step is independently verifiable.
          No API needed. No trust required.
        </p>
      </section>

      {/* Chapter 5: The Design Choices */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-8 rounded-lg bg-bench-surface border border-bench-border flex items-center justify-center text-xs font-bold">5</span>
          <h2 className="text-2xl font-bold">Why It Works This Way</h2>
        </div>

        <div className="space-y-6">
          {[
            {
              q: 'Why anchor asynchronously?',
              a: 'The API returns the certificate immediately. The on-chain anchor happens in the background. Agents get sub-second responses while still getting permanent proof. If X Layer has a hiccup, the cert is still valid — the anchor catches up.',
            },
            {
              q: 'Why store so little on-chain?',
              a: 'Gas efficiency. The cert hash is a commitment to all the data — 13 source quotes, routing details, timestamps, the full consensus calculation. Storing all of that on-chain would cost orders of magnitude more gas for zero additional security. The hash is the proof; the data lives off-chain.',
            },
            {
              q: 'Why X Layer?',
              a: 'Low gas costs make it economical to anchor every single certificate — not just the valuable ones. X Layer\'s EVM compatibility means standard tooling (viem, ethers, Hardhat) works out of the box. And the OKX ecosystem provides native liquidity and infrastructure.',
            },
            {
              q: 'Why per-agent stats on-chain?',
              a: 'Trust shouldn\'t require an API call. Any smart contract, DAO, or protocol can query an agent\'s track record directly from BenchRegistry — no HTTP requests, no API keys, no intermediary. This makes agent reputation composable with DeFi.',
            },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-sm font-semibold text-white mb-2">{item.q}</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chapter 6: What's Next */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-8 rounded-lg bg-bench-surface border border-bench-border flex items-center justify-center text-xs font-bold">6</span>
          <h2 className="text-2xl font-bold">What&apos;s Coming Next</h2>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
          The on-chain layer is live and anchoring. But the roadmap goes deeper:
        </p>

        <div className="space-y-4">
          {[
            {
              title: 'Aggregator Reputation Scores',
              desc: 'Each DEX adapter accumulates a reputation on-chain — best-rate frequency, uptime, latency percentiles. Agents can use these scores to weight their routing decisions. Adapters compete for trust.',
              tag: 'Contracts',
            },
            {
              title: 'x402 Paywall Integration',
              desc: 'Machine-to-machine payments for certification. Agents pay per-cert using HTTP 402 micropayments — no API keys, no accounts. The payment and the proof happen in the same flow.',
              tag: 'Protocol',
            },
            {
              title: 'Cross-Chain Anchoring',
              desc: 'Certificates for swaps on Ethereum, Solana, or Arbitrum can be anchored on X Layer as the canonical trust layer. One registry, every chain.',
              tag: 'Expansion',
            },
            {
              title: 'DAO Governance Gates',
              desc: 'Smart contracts that require a valid Bench certificate before executing agent-initiated swaps. The DAO votes on minimum agreement thresholds — say, 85% source consensus — and the contract enforces it trustlessly.',
              tag: 'DeFi',
            },
            {
              title: 'Agent Economy Loop',
              desc: 'Agents that consistently earn CERTIFIED verdicts build on-chain reputation. Protocols use that reputation to allocate more capital. Better performance earns more trust, which earns more volume. A virtuous cycle, enforced by math.',
              tag: 'Vision',
            },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-xl bg-bench-surface/50 border border-bench-border-subtle">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {item.tag}
                </span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="mb-8">
        <div className="p-6 rounded-xl bg-bench-surface border border-bench-border">
          <p className="text-sm text-zinc-400 leading-relaxed">
            The on-chain layer isn&apos;t a feature bolted onto Bench — it <em className="text-white">is</em> Bench.
            Without the anchor, a certificate is just a signed JSON blob. With it, it&apos;s a permanent,
            trustless, composable proof that anyone can verify without asking permission.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed mt-3">
            That&apos;s the difference between a promise and a proof.
          </p>
        </div>
      </section>

      {/* Navigation */}
      <div className="pt-8 border-t border-bench-border-subtle flex justify-between">
        <a href="/docs/architecture" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          &larr; Architecture
        </a>
        <a href="/docs/faq" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          FAQ &rarr;
        </a>
      </div>
    </div>
  );
}
