import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bench — The NBBO of Agent Trading',
  description: 'Multi-source best-execution verification for autonomous agent trading. 13 DEX aggregators. Cryptographic certificates. Fully verifiable.',
  openGraph: {
    title: 'Bench — The NBBO of Agent Trading',
    description: '13 DEX aggregators. Cryptographic consensus. Verifiable best-execution for every swap.',
    siteName: 'Bench',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bench-primary text-white font-sans antialiased">
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bench-primary/70 border-b border-bench-border-subtle">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between px-8 py-4">
            <a href="/" className="text-lg font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
              Bench <span className="text-bench-muted font-normal text-sm ml-1">v2</span>
            </a>
            <div className="flex items-center gap-8 text-sm font-medium text-bench-muted">
              <a href="/#how" className="hover:text-white transition-colors">How it works</a>
              <a href="/docs" className="hover:text-white transition-colors">Docs</a>
              <a href="/aggregators" className="hover:text-white transition-colors">Aggregators</a>
              <a href="/leaderboard" className="hover:text-white transition-colors">Agents</a>
            </div>
          </div>
        </nav>
        <main>
          {children}
        </main>
        <footer className="border-t border-bench-border-subtle px-8 py-8">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between text-sm text-bench-dim">
            <span>Bench — The NBBO of autonomous agent trading</span>
            <div className="flex items-center gap-6">
              <a href="/docs" className="text-bench-muted hover:text-white transition-colors">Docs</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-bench-muted hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
