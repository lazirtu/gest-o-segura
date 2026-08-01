import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { appConfig, routes } from "@/config/app";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border/70 bg-card/60 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link to={routes.splash} className="flex items-center gap-2.5">
            <span className="bg-gradient-brand flex size-8 items-center justify-center rounded-lg text-sm font-bold text-primary-foreground">
              GF
            </span>
            <span className="text-base font-semibold tracking-tight">{appConfig.name}</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/70">
        <div className="mx-auto w-full max-w-6xl px-6 py-6 text-sm text-muted-foreground">
          {appConfig.name} — estrutura inicial do projeto.
        </div>
      </footer>
    </div>
  );
}
