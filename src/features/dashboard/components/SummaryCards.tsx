import { Wallet, ArrowUpRight, ArrowDownRight, Target, Eye } from "lucide-react";
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

const [balanceCard, ...secondaryCards] = cards;

export function SummaryCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_2fr]">
      {balanceCard ? (
        <article className="bg-gradient-brand hover-lift animate-rise relative overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-[var(--shadow-lift)] sm:p-7">
          <div
            aria-hidden
            className="absolute -top-16 -right-12 size-48 rounded-full bg-primary-foreground/10 blur-2xl"
          />
          <div className="relative flex items-start justify-between gap-3">
            <span className="text-xs font-semibold tracking-[0.16em] text-primary-foreground/70 uppercase">
              {balanceCard.label}
            </span>
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary-foreground/15 backdrop-blur">
              <balanceCard.icon className="size-[1.1rem]" />
            </span>
          </div>

          <p className="num-display relative mt-6 text-3xl font-bold sm:text-[2.35rem]">
            {balanceCard.value}
          </p>
          <p className="relative mt-2 flex items-center gap-1.5 text-xs text-primary-foreground/70">
            <Eye className="size-3.5" />
            {balanceCard.hint}
          </p>

          <div className="relative mt-6 flex items-center gap-4 border-t border-primary-foreground/15 pt-4 text-xs">
            <span className="flex items-center gap-1.5 text-primary-foreground/80">
              <ArrowUpRight className="size-3.5" />
              {formatCurrency(summary.income)}
            </span>
            <span className="flex items-center gap-1.5 text-primary-foreground/80">
              <ArrowDownRight className="size-3.5" />
              {formatCurrency(summary.expenses)}
            </span>
          </div>
        </article>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        {secondaryCards.map((card, index) => (
          <article
            key={card.label}
            className="surface-card hover-lift animate-rise group p-5"
            style={{ animationDelay: `${(index + 1) * 70}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {card.label}
              </span>
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
                  card.tone === "success" && "bg-success/12 text-success",
                  card.tone === "destructive" && "bg-destructive/12 text-destructive",
                  card.tone === "brand" && "bg-accent text-accent-foreground",
                )}
              >
                <card.icon className="size-[1.05rem]" />
              </span>
            </div>

            <p className="num-display mt-5 text-2xl font-bold sm:text-[1.7rem]">
              {card.value}
            </p>
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                card.tone === "success" && "text-success",
                card.tone === "destructive" && "text-destructive",
                card.tone === "brand" && "text-muted-foreground",
              )}
            >
              {card.hint}
            </p>

            {card.label === "Meta principal" ? (
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="bg-gradient-success h-full rounded-full transition-all duration-700"
                  style={{ width: `${goalPercent}%` }}
                />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
