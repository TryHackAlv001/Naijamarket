export function ProductCardSkeleton() {
  return (
    <article className="w-72 shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="aspect-square animate-pulse rounded-2xl bg-slate-100"></div>

      <div className="mt-4 space-y-2">
        <div className="h-5 animate-pulse rounded bg-slate-100"></div>
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100"></div>

        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-4 animate-pulse rounded bg-slate-100"></div>
            ))}
          </div>
          <div className="h-4 w-8 animate-pulse rounded bg-slate-100"></div>
        </div>

        <div className="h-6 w-20 animate-pulse rounded bg-slate-100"></div>

        <div className="h-10 w-full animate-pulse rounded bg-slate-100"></div>
      </div>
    </article>
  );
}