import { CertFeed } from '@/components/cert-feed';
import { StatsBar } from '@/components/stats-bar';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Mainnet Badge */}
      <div className="flex justify-center pt-4">
        <a
          href="https://www.okx.com/web3/explorer/xlayer/address/0x6a400d858daA46C9f955601B672cc1a8899DcE3f"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live on X Layer Mainnet
        </a>
      </div>

      {/* Hero */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">
          The <span className="bench-gradient">NBBO</span> of Agent Trading
        </h1>
        <p className="text-bench-muted max-w-2xl mx-auto text-lg">
          Every swap. Every aggregator. Fully verifiable. Bench queries 12+ DEX aggregators
          in parallel and proves the consensus best price cryptographically.
        </p>
      </section>

      {/* Live Stats */}
      <StatsBar />

      {/* Certificate Feed */}
      <section>
        <h2 className="text-xl font-bold mb-4">Recent Certificates</h2>
        <CertFeed />
      </section>
    </div>
  );
}
