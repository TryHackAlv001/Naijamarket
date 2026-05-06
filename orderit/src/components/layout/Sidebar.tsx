import type { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="w-full max-w-sm shrink-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:w-80">
      {children}
    </aside>
  );
}
