const SECTIONS = [
  {
    href: '/docs/what-is-bench',
    title: 'What is Bench',
    desc: 'The problem Bench solves, the NBBO analogy, and why it matters for autonomous agents.',
  },
  {
    href: '/docs/how-it-works',
    title: 'How It Works',
    desc: 'Deep-dive into the query fan-out, consensus algorithm, certification, and on-chain anchoring.',
  },
  {
    href: '/docs/who-should-use',
    title: 'Who Should Use Bench',
    desc: 'Use cases for agent developers, DeFi protocols, DAOs, and researchers.',
  },
  {
    href: '/docs/integration',
    title: 'Integration Guide',
    desc: 'API endpoints, SDK usage, code examples, authentication, and error handling.',
  },
  {
    href: '/docs/architecture',
    title: 'Architecture',
    desc: 'System components, data flow, trust model, and verification pipeline.',
  },
  {
    href: '/docs/onchain',
    title: 'On-Chain',
    desc: 'The story of how every certificate becomes an immutable proof on X Layer — what\'s live, what\'s next.',
  },
  {
    href: '/docs/faq',
    title: 'FAQ',
    desc: 'Common questions about Bench from developers, protocols, and researchers.',
  },
];

export default function DocsHome() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Documentation</h1>
      <p className="text-lg text-zinc-400 leading-relaxed mb-12">
        Everything you need to understand, integrate, and build on Bench — the multi-source
        best-execution oracle for autonomous agent trading.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SECTIONS.map((s) => (
          <a
            key={s.href}
            href={s.href}
            className="p-6 rounded-xl bg-bench-surface border border-bench-border-subtle hover:border-bench-border hover:-translate-y-0.5 transition-all group"
          >
            <h3 className="text-base font-bold mb-2 group-hover:text-white transition-colors">{s.title}</h3>
            <p className="text-sm text-bench-muted leading-relaxed">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
