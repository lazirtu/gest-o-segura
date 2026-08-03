import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarClock,
  Receipt,
  Target,
  Zap,
} from "lucide-react";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { recentTransactions, upcomingBills, goals } from "@/features/dashboard/data";

function PanelHeader({
  title,
  caption,
  icon: Icon,
}: {
  title: string;
  caption: string;
  icon: typeof Receipt;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <Icon className="size-[1.05rem]" />
      </span>
      <div className="min-w-0">
        <h2 className="truncate text-base font-bold tracking-tight">{title}</h2>
        <p className="truncate text-xs text-muted-foreground">{caption}</p>
      </div>
    </div>
  );
}

export function RecentTransactions() {
  return (
    <div className="surface-card animate-rise p-5 sm:p-6">
      <PanelHeader
        title="Últimas transações"
        caption="Movimentações mais recentes"
        icon={Receipt}
      />

      <ul className="mt-4 divide-y divide-border/70">
        {recentTransactions.map((item) => {
          const positive = item.amount > 0;
          return (
            <li
              key={item.id}
              className="group -mx-2 flex items-center gap-3 rounded-2xl px-2 py-3 transition-colors hover:bg-muted/60"
            >
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
                  positive
                    ? "bg-success/12 text-success"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                {positive ? (
                  <ArrowUpRight className="size-[1.05rem]" />
                ) : (
                  <ArrowDownLeft className="size-[1.05rem]" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.category} · {item.date}
                </p>
              </div>
              <span
                className={cn(
                  "num-display shrink-0 text-sm font-bold",
                  positive ? "text-success" : "text-foreground",
                )}
              >
                {positive ? "+" : "−"}
                {formatCurrency(Math.abs(item.amount))}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function UpcomingBills() {
  return (
    <div className="surface-card animate-rise p-5 sm:p-6">
      <PanelHeader
        title="Próximos vencimentos"
        caption="Contas a pagar deste ciclo"
        icon={CalendarClock}
      />

      <ul className="mt-4 space-y-2.5">
        {upcomingBills.map((item) => (
          <li
            key={item.id}
            className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-muted/70"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-warning/15 text-warning transition-transform duration-300 group-hover:scale-110">
              <Zap className="size-[1.05rem]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{item.title}</p>
              <p className="truncate text-xs text-muted-foreground">{item.due}</p>
            </div>
            <span className="num-display shrink-0 text-sm font-bold">
              {formatCurrency(item.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GoalsProgress() {
  return (
    <div className="surface-card animate-rise p-5 sm:p-6">
      <PanelHeader
        title="Progresso das metas"
        caption="Objetivos em andamento"
        icon={Target}
      />

      <div className="mt-5 space-y-5">
        {goals.map((goal) => {
          const percent = Math.min(
            100,
            Math.round((goal.current / goal.target) * 100),
          );
          return (
            <div key={goal.id} className="group">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-sm font-semibold">{goal.name}</p>
                <span className="num-display shrink-0 text-xs text-muted-foreground">
                  {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                </span>
              </div>
              <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="bg-gradient-success h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs font-medium text-success">
                {percent}% concluído
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
