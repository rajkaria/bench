const NAV_ITEMS = [
  { href: '/docs', label: 'Overview' },
  { href: '/docs/what-is-bench', label: 'What is Bench' },
  { href: '/docs/how-it-works', label: 'How It Works' },
  { href: '/docs/who-should-use', label: 'Who Should Use Bench' },
  { href: '/docs/integration', label: 'Integration Guide' },
  { href: '/docs/architecture', label: 'Architecture' },
  { href: '/docs/faq', label: 'FAQ' },
];

export default async function DocsLayout(props: { children: React.ReactNode }) {
  const children = await props.children;
  return (
    <div className="max-w-[1200px] mx-auto px-8 pt-28 pb-20 flex gap-12">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 hidden md:block">
        <div className="sticky top-28">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-bench-dim mb-4">Documentation</p>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-bench-muted hover:text-white px-3 py-2 rounded-lg hover:bg-bench-surface transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <article className="flex-1 min-w-0 max-w-[720px]">
        {children}
      </article>
    </div>
  );
}
