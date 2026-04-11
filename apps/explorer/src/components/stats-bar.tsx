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
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard label="Total Certificates" value={stats.totalCerts.toLocaleString()} />
      <StatCard label="Certified Rate" value={`${stats.certifiedRate}%`} color="text-bench-green" />
      <StatCard label="Avg Agreement" value={`${stats.avgAgreement}/100`} />
      <StatCard label="Source Queries" value={stats.sourcesQueried.toLocaleString()} />
      <StatCard label="Avg Query Time" value={stats.avgQueryTime} />
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-bench-surface border border-bench-border rounded-lg p-4">
      <p className="text-bench-muted text-xs mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color ?? 'text-white'}`}>{value}</p>
    </div>
  );
}
