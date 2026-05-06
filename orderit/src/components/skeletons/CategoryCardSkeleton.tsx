export function CategoryCardSkeleton() {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 animate-pulse rounded-full bg-slate-100"></div>
        <div className="space-y-2">
          <div className="h-5 w-24 animate-pulse rounded bg-slate-100"></div>
          <div className="h-4 w-20 animate-pulse rounded bg-slate-100"></div>
        </div>
      </div>
    </article>
  );
}