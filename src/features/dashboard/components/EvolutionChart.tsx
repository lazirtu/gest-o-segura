import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import {
  buildEvolutionSeries,
  rangeOptions,
  type EvolutionInput,
  type RangeKey,
} from "@/features/dashboard/data";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="surface-card min-w-[10rem] px-3 py-2.5 text-xs shadow-[var(--shadow-lift)]">
      <p className="mb-1.5 font-semibold">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}
          </span>
          <span className="num-display font-semibold">
            {formatCurrency(entry.value ?? 0)}
          </span>
        </p>
      ))}
    </div>
  );
}

export function EvolutionChart({
  transactions,
}: {
  transactions: EvolutionInput[];
}) {
  const [range, setRange] = useState<RangeKey>("30d");
  const data = useMemo(
    () => buildEvolutionSeries(transactions, range),
    [transactions, range],
  );

  return (
    <div className="surface-card animate-rise p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold tracking-tight sm:text-lg">
            Evolução financeira
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            Receitas e despesas no período
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2.5 rounded-full bg-[var(--chart-1)]" />
              Receitas
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2.5 rounded-full bg-[var(--chart-5)]" />
              Despesas
            </span>
          </div>
        </div>

        <div className="-mx-1 overflow-x-auto px-1 sm:mx-0 sm:px-0">
          <div className="flex w-max shrink-0 rounded-2xl bg-muted p-1">
            {rangeOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setRange(option.key)}
                className={cn(
                  "focus-ring rounded-xl px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200",
                  range === option.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 h-[240px] w-full sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="gfIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.38} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gfExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--chart-5)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={8}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={60}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickFormatter={(value: number) =>
                value >= 1000 ? `R$ ${Math.round(value / 1000)}k` : `R$ ${value}`
              }
            />
            <Tooltip
              cursor={{ stroke: "var(--border)", strokeWidth: 1.5 }}
              content={<ChartTooltip />}
            />
            <Area
              type="monotone"
              dataKey="receitas"
              name="Receitas"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="url(#gfIncome)"
              activeDot={{ r: 4, strokeWidth: 2 }}
              animationDuration={700}
            />
            <Area
              type="monotone"
              dataKey="despesas"
              name="Despesas"
              stroke="var(--chart-5)"
              strokeWidth={2.5}
              fill="url(#gfExpense)"
              activeDot={{ r: 4, strokeWidth: 2 }}
              animationDuration={700}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
