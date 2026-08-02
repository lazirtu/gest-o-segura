import { Wallet, ArrowUpRight, ArrowDownRight, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { summary } from "@/features/dashboard/data";

type Card = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone: "brand" | "success" | "destructive";
};

const goalPercent = Math.round((summary.goal.current / summary.goal.target) * 100);

const cards: Card[] = [
  {
    label: "Saldo total",
    value: formatCurrency(summary.balance),
    hint: "Todas as contas",
    icon: Wallet,
    tone: "brand",
  },
  {
    label: "Receitas",
    value: formatCurrency(summary.income),
    hint: "+12,4% vs. mês anterior",
    icon: ArrowUpRight,
    tone: "success",
  },
  {
    label: "Despesas",
    value: formatCurrency(summary.expenses),
    hint: "-5,8% vs. mês anterior",
    icon: ArrowDownRight,
    tone: "destructive",
  },
  {
    label: "Meta principal",
    value: `${goalPercent}%`,
    hint: summary.goal.name,
    icon: Target,
    tone: "brand",
  },
];

export function SummaryCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="surface-card surface-card-hover p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {card.label}
            </span>
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-xl",
                card.tone === "success" && "bg-success/12 text-success",
                card.tone === "destructive" && "bg-destructive/12 text-destructive",
                card.tone === "brand" && "bg-accent text-accent-foreground",
              )}
            >
              <card.icon className="size-4" />
            </span>
          </div>

          <p className="mt-4 text-2xl font-semibold tracking-tight tabular-nums">
            {card.value}
          </p>
          <p
            className={cn(
              "mt-1 text-xs",
              card.tone === "success" ? "text-success" : "text-muted-foreground",
            )}
          >
            {card.hint}
          </p>

          {card.label === "Meta principal" ? (
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="bg-gradient-success h-full rounded-full transition-all duration-700"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
