interface StatsCardProps {
  title: string;
  value: string;
}

export function StatsCard({ title, value }: StatsCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
    </article>
  );
}
