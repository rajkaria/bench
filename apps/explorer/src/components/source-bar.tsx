interface SourceBarProps {
  source: string;
  output: string;
  value: number;
  maxValue: number;
  isBest?: boolean;
  isChosen?: boolean;
  latency: number;
}

export function SourceBar({ source, output, value, maxValue, isBest, isChosen, latency }: SourceBarProps) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-32 text-right text-bench-muted truncate">{source}</span>
      <div className="flex-1 relative">
        <div className="bg-bench-border rounded h-6 overflow-hidden">
          <div
            className={`h-full rounded transition-all ${
              isBest ? 'bg-bench-accent' : isChosen ? 'bg-blue-500/60' : 'bg-bench-muted/30'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className="w-20 text-right font-mono">
        {output}
      </span>
      <span className="w-16 text-right text-bench-muted text-xs">
        {latency}ms
      </span>
      <span className="w-20 text-xs">
        {isBest && <span className="text-bench-accent font-bold">BEST</span>}
        {isChosen && <span className="text-blue-400">chosen</span>}
      </span>
    </div>
  );
}
