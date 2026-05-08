import type { ReactNode } from "react";

interface ProductGridProps {
  children: ReactNode;
}

export function ProductGrid({ children }: ProductGridProps) {
  return <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}
