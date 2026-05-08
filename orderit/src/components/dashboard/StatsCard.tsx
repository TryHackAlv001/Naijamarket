import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{title}</p>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
    </article>
  );
}
