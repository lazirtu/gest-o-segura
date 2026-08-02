import { useState, type ReactNode } from "react";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";

export function AppLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string | undefined;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader title={title} subtitle={subtitle} onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        <footer className="px-4 pb-8 text-xs text-muted-foreground sm:px-6 lg:px-8">
          Gestão Financeira — seus dados, organizados com clareza.
        </footer>
      </div>
    </div>
  );
}
