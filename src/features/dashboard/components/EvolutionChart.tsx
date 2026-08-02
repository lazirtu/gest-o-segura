import { useState } from "react";
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
import { evolutionSeries, rangeOptions, type RangeKey } from "@/features/dashboard/data";

export function EvolutionChart() {
  const [range, setRange] = useState<RangeKey>("30d");
  const data = evolutionSeries[range];

  return (
    <div className="surface-card p-5 sm:p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">Evolução financeira</h2>
          <p className="truncate text-xs text-muted-foreground">
            Receitas e despesas no período
          </p>
        </div>

        <div className="flex shrink-0 rounded-xl bg-muted p-1">
          {rangeOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setRange(option.key)}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200",
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

      <div className="mt-6 h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="gfIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gfExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--chart-5)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={70}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              tickFormatter={(value: number) => `R$ ${Math.round(value / 1000)}k`}
            />
            <Tooltip
              cursor={{ stroke: "var(--border)" }}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                color: "var(--popover-foreground)",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [formatCurrency(value), name]}
            />
            <Area
              type="monotone"
              dataKey="receitas"
              name="Receitas"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="url(#gfIncome)"
            />
            <Area
              type="monotone"
              dataKey="despesas"
              name="Despesas"
              stroke="var(--chart-5)"
              strokeWidth={2.5}
              fill="url(#gfExpense)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
