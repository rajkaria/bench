'use client';

import { useEffect, useRef, useState } from 'react';

const SOURCES = [
  { name: '1inch', value: '2,847.32', width: 96, latency: '98ms', best: true },
  { name: 'Paraswap', value: '2,841.18', width: 94, latency: '142ms' },
  { name: 'KyberSwap', value: '2,838.91', width: 93, latency: '87ms' },
  { name: 'OKX DEX', value: '2,837.05', width: 92.5, latency: '203ms' },
  { name: 'OpenOcean', value: '2,835.44', width: 91.8, latency: '156ms' },
  { name: 'CoW Swap', value: '2,832.76', width: 91, latency: '312ms' },
  { name: 'LI.FI', value: '2,830.19', width: 90.5, latency: '248ms' },
];

export function PriceDiscovery() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="max-w-[720px] mx-auto">
      <p className="text-center text-bench-dim text-xs uppercase tracking-[3px] font-semibold mb-10">
        Live price discovery across 13 sources
      </p>

      <div className="space-y-2.5">
        {SOURCES.map((s, i) => (
          <div
            key={s.name}
            className="flex items-center gap-4"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-20px)',
              transition: `opacity 0.5s ease-out ${i * 80}ms, transform 0.5s ease-out ${i * 80}ms`,
            }}
          >
            <span className="w-24 text-right text-sm text-bench-muted font-medium shrink-0">
              {s.name}
            </span>
            <div className="flex-1 bg-bench-surface rounded-md h-8 overflow-hidden">
              <div
                className={`h-full rounded-md flex items-center justify-end pr-3 ${
                  s.best
                    ? 'bg-white/[0.06] border border-white/10'
                    : 'bg-white/[0.02] border border-bench-border-subtle'
                }`}
                style={{
                  width: visible ? `${s.width}%` : '0%',
                  transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80 + 200}ms`,
                }}
              >
                <span className={`text-xs font-semibold tabular-nums whitespace-nowrap ${
                  s.best ? 'text-white' : 'text-zinc-400'
                }`}>
                  {s.value}
                </span>
              </div>
            </div>
            <span className={`w-12 text-xs text-left shrink-0 ${
              s.best ? 'text-white font-bold' : 'text-bench-dim'
            }`}>
              {s.best ? 'BEST' : s.latency}
            </span>
          </div>
        ))}

        {/* +6 more */}
        <div
          className="flex items-center gap-4"
          style={{
            opacity: visible ? 1 : 0,
            transition: `opacity 0.5s ease-out ${SOURCES.length * 80}ms`,
          }}
        >
          <span className="w-24 text-right text-sm text-bench-dim shrink-0">+6 more</span>
          <div className="flex-1 border border-dashed border-bench-border rounded-md h-8 flex items-center justify-center">
            <span className="text-xs text-bench-dim">queried in parallel</span>
          </div>
          <span className="w-12 shrink-0" />
        </div>
      </div>

      {/* Consensus result */}
      <div
        className="max-w-md mx-auto mt-8 py-4 px-6 bg-bench-surface border border-bench-border rounded-xl text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          transition: `opacity 0.6s ease-out ${SOURCES.length * 80 + 300}ms, transform 0.6s ease-out ${SOURCES.length * 80 + 300}ms`,
        }}
      >
        <div className="inline-flex items-center gap-1.5 text-bench-green text-sm font-semibold">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          CERTIFIED
        </div>
        <p className="text-bench-muted text-xs mt-1">Agreement: 94/100 · Spread: 0.42% · 2.1s</p>
      </div>
    </div>
  );
}
