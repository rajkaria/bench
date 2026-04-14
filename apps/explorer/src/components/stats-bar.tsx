import { fetchApi } from '@/lib/api';

interface Stats {
  totalCerts: number;
  certifiedRate: number;
  avgAgreement: number;
  sourcesQueried: number;
  avgQueryTime: string;
}

const DEMO_STATS: Stats = {
  totalCerts: 1247,
  certifiedRate: 94.2,
  avgAgreement: 91,
  sourcesQueried: 14892,
  avgQueryTime: '2.3s',
};

export async function StatsBar() {
  const stats = await fetchApi<Stats>('/v1/stats', DEMO_STATS);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-bench-border-subtle rounded-xl overflow-hidden border border-bench-border-subtle">
      <StatCard label="Certificates Issued" value={stats.totalCerts.toLocaleString()} />
      <StatCard label="Certified Rate" value={`${stats.certifiedRate}%`} green />
      <StatCard
        label="Avg Agreement"
        value={`${stats.avgAgreement}`}
        suffix="/100"
      />
      <StatCard label="Sources Queried" value={stats.sourcesQueried.toLocaleString()} />
      <StatCard
        label="Avg Response"
        value={stats.avgQueryTime.replace('s', '')}
        suffix="s"
      />
    </div>
  );
}

function StatCard({ label, value, green, suffix }: { label: string; value: string; green?: boolean; suffix?: string }) {
  return (
    <div className="bg-bench-primary p-6">
      <p className="text-bench-dim text-xs font-medium mb-2">{label}</p>
      <p className={`text-[28px] font-bold tracking-tight tabular-nums ${green ? 'text-bench-green' : 'text-white'}`}>
        {value}
        {suffix && <span className="text-base text-bench-muted">{suffix}</span>}
      </p>
    </div>
  );
}
