import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  PieChart,
  Settings,
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
  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-out lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-5">
          <Link to={routes.dashboard} className="flex min-w-0 items-center gap-2.5">
            <span className="bg-gradient-success grid size-9 shrink-0 place-items-center rounded-xl text-sm font-bold text-sidebar-primary-foreground">
              GF
            </span>
            <span className="truncate text-sm font-semibold tracking-tight">
              {appConfig.name}
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="rounded-lg p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((item, index) => (
            <Link
              key={item.title}
              to={item.url}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                index === 0
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          ))}
        </nav>

        <div className="m-3 rounded-2xl bg-sidebar-accent/60 p-4">
          <p className="text-sm font-semibold">Planeje com clareza</p>
          <p className="mt-1 text-xs text-sidebar-foreground/70">
            Acompanhe metas e vencimentos em um só lugar.
          </p>
        </div>
      </aside>
    </>
  );
}
