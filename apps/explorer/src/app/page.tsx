import { StatsBar } from '@/components/stats-bar';
import { CertFeed } from '@/components/cert-feed';
import { PriceDiscovery } from '@/components/price-discovery';
import { ScrollReveal } from '@/components/scroll-reveal';

export default function HomePage() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-8 pt-24 pb-20 relative overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 100%)',
          }}
        />
        {/* Subtle warm glow */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.04) 0%, transparent 70%)' }}
        />

        <div className="relative z-10">
          {/* Live badge */}
          <a
            href="https://www.okx.com/web3/explorer/xlayer/address/0x6a400d858daA46C9f955601B672cc1a8899DcE3f"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bench-green/[0.08] border border-bench-green/20 text-emerald-400 text-sm font-medium hover:bg-bench-green/[0.12] transition-colors mb-8 animate-fade-in-down"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            Live on X Layer Mainnet
          </a>

          <h1 className="text-6xl font-extrabold leading-[1.05] tracking-tight mb-6 animate-[fade-in-up_0.8s_ease-out_0.1s_both]">
            Your agent deserves<br />
            <span className="bench-gradient">the best price.</span><br />
            <span className="text-bench-muted">Prove it.</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-[580px] mx-auto leading-relaxed animate-[fade-in-up_0.8s_ease-out_0.2s_both]">
            Bench queries <strong className="text-white font-semibold">13 DEX aggregators</strong> in parallel,
            computes consensus best price, and issues an{' '}
            <strong className="text-white font-semibold">EIP-712 cryptographic certificate</strong> — in under 3 seconds.
          </p>

          <div className="flex gap-3 justify-center mt-10 animate-[fade-in-up_0.8s_ease-out_0.3s_both]">
            <a
              href="/docs"
              className="px-7 py-3 rounded-[10px] bg-white text-bench-primary font-semibold text-[15px] hover:opacity-90 hover:-translate-y-px transition-all"
            >
              Read the Docs
            </a>
            <a
              href="#stats"
              className="px-7 py-3 rounded-[10px] border border-bench-border text-zinc-400 text-[15px] hover:border-bench-muted hover:text-white transition-all"
            >
              View Live Certificates →
            </a>
          </div>
        </div>
      </section>

      {/* ===== PRICE DISCOVERY ===== */}
      <section className="py-20 px-8">
        <PriceDiscovery />
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="py-24 px-8" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.008) 50%, transparent 100%)' }}>
        <div className="max-w-[1000px] mx-auto">
          <p className="text-center text-bench-dim text-xs uppercase tracking-[3px] font-semibold mb-12">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-bench-border-subtle rounded-2xl overflow-hidden border border-bench-border-subtle">
            {[
              {
                step: 'Step 1',
                title: 'Query',
                desc: 'Agent requests a swap quote. Bench fans out to 13 DEX aggregators in parallel — 1inch, Paraswap, KyberSwap, OKX, Jupiter, CoW, and more.',
                icon: (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                step: 'Step 2',
                title: 'Consensus',
                desc: 'Weighted median removes outliers. Sources scored 0-100 on agreement. The best price is identified with statistical confidence — not just the cheapest quote.',
                icon: (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                ),
              },
              {
                step: 'Step 3',
                title: 'Certify',
                desc: 'EIP-712 signed certificate issued with full quote data. Anchored on-chain to BenchRegistry on X Layer. Independently verifiable by anyone, forever.',
                icon: (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                ),
              },
            ].map((card, i) => (
              <ScrollReveal key={card.title} delay={i * 100}>
                <div className="bg-bench-primary p-10">
                  <p className="text-xs font-semibold text-bench-dim uppercase tracking-[2px] mb-4">{card.step}</p>
                  <div className="w-10 h-10 rounded-[10px] bg-bench-surface border border-bench-border flex items-center justify-center text-zinc-400 mb-5">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight mb-3">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-bench-muted">{card.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section id="stats" className="py-20 px-8">
        <div className="max-w-[1000px] mx-auto">
          <ScrollReveal>
            <StatsBar />
          </ScrollReveal>
        </div>
      </section>

      {/* ===== AUDIENCE ===== */}
      <section className="py-24 px-8">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-center text-bench-dim text-xs uppercase tracking-[3px] font-semibold mb-12">
            Built for
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                tag: 'Agent Developers',
                title: 'Ship agents that earn trust',
                desc: 'One API call. Get the best price across 13 sources with a cryptographic proof your users can independently verify. No more "trust me" swaps.',
              },
              {
                tag: 'DeFi Protocols',
                title: 'Verifiable agent infrastructure',
                desc: 'Plug Bench into your agent ecosystem. On-chain anchoring, reputation scoring, and best-execution verification for every swap your agents make.',
              },
              {
                tag: 'Researchers',
                title: 'Transparent. Auditable. Open.',
                desc: 'Every certificate is independently verifiable. Explore aggregator accuracy, price spreads, and agent behavior on the public explorer — no login required.',
              },
            ].map((card, i) => (
              <ScrollReveal key={card.tag} delay={i * 100}>
                <div className="p-8 rounded-2xl bg-bench-surface border border-bench-border-subtle hover:border-bench-border hover:-translate-y-0.5 transition-all">
                  <p className="text-xs font-semibold uppercase tracking-[1.5px] text-zinc-400 mb-4">{card.tag}</p>
                  <h3 className="text-lg font-bold tracking-tight mb-3">{card.title}</h3>
                  <p className="text-sm leading-[1.7] text-bench-muted">{card.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CODE CTA ===== */}
      <section className="py-24 px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-3">Start building in 30 seconds</h2>
        <p className="text-bench-muted text-base mb-10">One API call to get a certified best-execution quote</p>

        <ScrollReveal>
          <div className="max-w-[560px] mx-auto bg-bench-surface border border-bench-border-subtle rounded-xl p-6 text-left font-mono text-sm leading-[1.8] text-zinc-400">
            <span className="text-bench-dim">{'// Request a certified quote'}</span><br />
            <span className="text-blue-500">const</span> cert = <span className="text-blue-500">await</span>{' '}
            <span className="text-white">bench</span>.<span className="text-white">certify</span>({'{'}<br />
            {'  '}inputToken: <span className="text-bench-muted">&quot;ETH&quot;</span>,<br />
            {'  '}outputToken: <span className="text-bench-muted">&quot;USDC&quot;</span>,<br />
            {'  '}amount: <span className="text-bench-muted">&quot;1.0&quot;</span>,<br />
            {'  '}chainId: <span className="text-purple-400">196</span><br />
            {'}'});<br /><br />
            <span className="text-bench-dim">{'// cert.bestPrice → 2,847.32'}</span><br />
            <span className="text-bench-dim">{'// cert.sources → 13 aggregators'}</span><br />
            <span className="text-bench-dim">{'// cert.signature → EIP-712 proof'}</span>
          </div>
        </ScrollReveal>

        <div className="flex gap-3 justify-center mt-10">
          <a
            href="/docs/integration"
            className="px-7 py-3 rounded-[10px] bg-white text-bench-primary font-semibold text-[15px] hover:opacity-90 hover:-translate-y-px transition-all"
          >
            Read Full Docs →
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 rounded-[10px] border border-bench-border text-zinc-400 text-[15px] hover:border-bench-muted hover:text-white transition-all"
          >
            GitHub ↗
          </a>
        </div>
      </section>

      {/* ===== CERT FEED ===== */}
      <section className="py-20 px-8">
        <div className="max-w-[1000px] mx-auto">
          <ScrollReveal>
            <h2 className="text-xl font-bold mb-6">Recent Certificates</h2>
            <CertFeed />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
