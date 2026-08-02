import { Menu, Moon, Sun, Bell, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useSignOut } from "@/features/auth/useSignOut";

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

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Abrir menu"
            className="rounded-xl border border-border p-2 text-muted-foreground transition-colors hover:bg-accent lg:hidden"
          >
            <Menu className="size-4" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notificações"
            className="rounded-xl text-muted-foreground"
          >
            <Bell className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="rounded-xl text-muted-foreground"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            disabled={loading}
            className="rounded-xl"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">{loading ? "Saindo..." : "Sair"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
