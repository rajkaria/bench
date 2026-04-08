import { CertFeed } from '@/components/cert-feed';
import { StatsBar } from '@/components/stats-bar';

export default function HomePage() {
  return (
    <div className="space-y-8">
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
