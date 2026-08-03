import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  PieChart,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";

import { appConfig, routes } from "@/config/app";
import { cn } from "@/lib/utils";

const items = [
  { title: "Visão geral", url: routes.dashboard, icon: LayoutDashboard },
  { title: "Transações", url: routes.dashboard, icon: ArrowLeftRight },
  { title: "Metas", url: routes.dashboard, icon: Target },
  { title: "Relatórios", url: routes.dashboard, icon: PieChart },
  { title: "Configurações", url: routes.dashboard, icon: Settings },
];

export function AppSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[17rem] flex-col bg-sidebar text-sidebar-foreground shadow-2xl transition-transform duration-300 ease-out lg:static lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-[4.5rem] shrink-0 items-center justify-between px-5">
          <Link
            to={routes.dashboard}
            className="focus-ring flex min-w-0 items-center gap-3 rounded-2xl"
          >
            <span className="bg-gradient-success grid size-10 shrink-0 place-items-center rounded-2xl text-sidebar-primary-foreground shadow-lg">
              <ShieldCheck className="size-5" strokeWidth={2.4} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[0.95rem] leading-tight font-bold tracking-tight">
                {appConfig.name}
              </span>
              <span className="block truncate text-[0.68rem] font-medium tracking-[0.18em] text-sidebar-foreground/50 uppercase">
                Finanças
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="focus-ring rounded-xl p-2 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[0.65rem] font-semibold tracking-[0.16em] text-sidebar-foreground/40 uppercase">
            Menu
          </p>
          {items.map((item, index) => {
            const active = index === 0 && pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                onClick={onClose}
                className={cn(
                  "focus-ring group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/65 hover:translate-x-0.5 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
              >
                <span
                  className={cn(
                    "bg-gradient-success absolute top-1/2 left-0 h-7 w-1 -translate-y-1/2 rounded-r-full transition-all duration-300",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <item.icon
                  className={cn(
                    "size-[1.15rem] shrink-0 transition-colors",
                    active ? "text-sidebar-primary" : "",
                  )}
                  strokeWidth={active ? 2.4 : 2}
                />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-3xl bg-sidebar-accent/60 p-4 ring-1 ring-sidebar-border">
          <p className="text-sm font-semibold">Planeje com clareza</p>
          <p className="mt-1 text-xs leading-relaxed text-sidebar-foreground/65">
            Acompanhe metas e vencimentos em um só lugar.
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-sidebar-border px-5 py-4 text-[0.7rem] text-sidebar-foreground/45">
          <span className="truncate">© {new Date().getFullYear()} {appConfig.name}</span>
          <span className="shrink-0 font-medium">v1.0</span>
        </div>
      </aside>
    </>
  );
}
