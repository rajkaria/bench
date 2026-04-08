import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bench Explorer — The NBBO of Agent Trading',
  description: 'Multi-source best-execution verification for autonomous agent trading. Every certificate. Every source. Fully verifiable.',
  openGraph: {
    title: 'Bench Explorer',
    description: 'The NBBO of agent trading. Multi-source consensus. Cryptographically verified.',
    siteName: 'Bench',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bench-primary text-white font-mono antialiased">
        <nav className="border-b border-bench-border px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bench-gradient">BENCH</span>
              <span className="text-bench-muted text-sm">v2</span>
            </a>
            <div className="flex items-center gap-6 text-sm text-bench-muted">
              <a href="/" className="hover:text-white transition-colors">Live Feed</a>
              <a href="/aggregators" className="hover:text-white transition-colors">Aggregators</a>
              <a href="/leaderboard" className="hover:text-white transition-colors">Agents</a>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-bench-border px-6 py-6 mt-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-bench-muted">
            <span>Bench — The NBBO of agent trading</span>
            <span>usebench.xyz</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
