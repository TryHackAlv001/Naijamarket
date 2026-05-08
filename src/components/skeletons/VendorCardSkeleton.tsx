export function VendorCardSkeleton() {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="aspect-square w-16 shrink-0 animate-pulse rounded-xl bg-slate-100"></div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100"></div>
            <div className="h-5 w-16 animate-pulse rounded bg-slate-100"></div>
          </div>

          <div className="h-4 animate-pulse rounded bg-slate-100"></div>
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100"></div>

          <div className="flex items-center gap-4">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-100"></div>
            <div className="h-4 w-24 animate-pulse rounded bg-slate-100"></div>
          </div>

          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 w-4 animate-pulse rounded bg-slate-100"></div>
              ))}
            </div>
            <div className="h-4 w-8 animate-pulse rounded bg-slate-100"></div>
          </div>

          <div className="h-10 w-full animate-pulse rounded bg-slate-100"></div>
        </div>
      </div>
    </article>
  );
}