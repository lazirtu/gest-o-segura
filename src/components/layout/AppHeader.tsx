import { Menu, Moon, Sun, Bell, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useSignOut } from "@/features/auth/useSignOut";
import { appConfig } from "@/config/app";

function greeting(hour: number) {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function AppHeader({
  title,
  subtitle,
  onOpenMenu,
}: {
  title: string;
  subtitle?: string | undefined;
  onOpenMenu: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const { signOut, loading } = useSignOut();

  const now = new Date();
  const hello = greeting(now.getHours());
  const today = new Intl.DateTimeFormat(appConfig.locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(now);

  return (
    <header className="glass-panel sticky top-0 z-30 border-x-0 border-t-0">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Abrir menu"
            className="focus-ring rounded-2xl border border-border p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
          >
            <Menu className="size-4" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-[0.7rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {hello} · <span className="capitalize">{today}</span>
            </p>
            <h1 className="truncate text-lg font-bold tracking-tight sm:text-[1.4rem]">
              {title}
            </h1>
            {subtitle ? (
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notificações"
            className="focus-ring relative size-10 rounded-2xl border border-border/70 bg-card/60 text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-foreground"
          >
            <Bell className="size-[1.05rem]" />
            <span className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-success" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="focus-ring size-10 rounded-2xl border border-border/70 bg-card/60 text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="size-[1.05rem]" />
            ) : (
              <Moon className="size-[1.05rem]" />
            )}
          </Button>
          <Button
            variant="outline"
            onClick={signOut}
            disabled={loading}
            className="focus-ring h-10 rounded-2xl border-border/70 bg-card/60 font-semibold transition-all hover:-translate-y-0.5"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">{loading ? "Saindo..." : "Sair"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
