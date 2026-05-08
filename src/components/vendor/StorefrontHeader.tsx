interface StorefrontHeaderProps {
  shopName: string;
  location?: string;
}

export function StorefrontHeader({ shopName, location }: StorefrontHeaderProps) {
  return (
    <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{shopName}</h1>
        {location ? <p className="text-sm text-slate-500">Location: {location}</p> : null}
      </div>
    </header>
  );
}
