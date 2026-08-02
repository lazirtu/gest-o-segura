import { ArrowDownLeft, ArrowUpRight, CalendarClock } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { recentTransactions, upcomingBills, goals } from "@/features/dashboard/data";

export function RecentTransactions() {
  return (
    <div className="surface-card p-5 sm:p-6">
      <h2 className="text-base font-semibold">Últimas transações</h2>
      <ul className="mt-4 divide-y divide-border">
        {recentTransactions.map((item) => {
          const positive = item.amount > 0;
          return (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-xl",
                  positive
                    ? "bg-success/12 text-success"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {positive ? (
                  <ArrowUpRight className="size-4" />
                ) : (
                  <ArrowDownLeft className="size-4" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.category} · {item.date}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 text-sm font-semibold tabular-nums",
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
    <div className="surface-card p-5 sm:p-6">
      <h2 className="text-base font-semibold">Próximos vencimentos</h2>
      <ul className="mt-4 space-y-2.5">
        {upcomingBills.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2.5"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-warning/15 text-warning">
              <CalendarClock className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="truncate text-xs text-muted-foreground">{item.due}</p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums">
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
    <div className="surface-card p-5 sm:p-6">
      <h2 className="text-base font-semibold">Progresso das metas</h2>
      <div className="mt-5 space-y-5">
        {goals.map((goal) => {
          const percent = Math.min(
            100,
            Math.round((goal.current / goal.target) * 100),
          );
          return (
            <div key={goal.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-sm font-medium">{goal.name}</p>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="bg-gradient-success h-full rounded-full transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-success">{percent}% concluído</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
