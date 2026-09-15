/** Configuração e agregações do dashboard a partir de dados reais. */

export type RangeKey = "7d" | "30d" | "3m" | "6m" | "1a";

export const rangeOptions: { key: RangeKey; label: string }[] = [
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "3m", label: "3 meses" },
  { key: "6m", label: "6 meses" },
  { key: "1a", label: "1 ano" },
];

export interface EvolutionPoint {
  label: string;
  receitas: number;
  despesas: number;
}

export interface EvolutionInput {
  date: string;
  amount: number;
  type: string;
}

const dayFormatter = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "short" });

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Agrupa transações por dia ou mês conforme o período selecionado. */
export function buildEvolutionSeries(
  transactions: EvolutionInput[],
  range: RangeKey,
): EvolutionPoint[] {
  const today = new Date();
  const buckets = new Map<string, EvolutionPoint>();
  const order: string[] = [];

  if (range === "7d" || range === "30d") {
    const days = range === "7d" ? 7 : 30;
    for (let index = days - 1; index >= 0; index -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - index);
      const key = isoDay(date);
      const label =
        range === "7d"
          ? dayFormatter.format(date).replace(".", "")
          : String(date.getDate()).padStart(2, "0");
      buckets.set(key, { label, receitas: 0, despesas: 0 });
      order.push(key);
    }
  } else {
    const months = range === "3m" ? 3 : range === "6m" ? 6 : 12;
    for (let index = months - 1; index >= 0; index -= 1) {
      const date = new Date(today.getFullYear(), today.getMonth() - index, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      buckets.set(key, {
        label: monthFormatter.format(date).replace(".", ""),
        receitas: 0,
        despesas: 0,
      });
      order.push(key);
    }
  }

  for (const transaction of transactions) {
    if (!transaction.date) continue;
    const key =
      range === "7d" || range === "30d"
        ? transaction.date.slice(0, 10)
        : transaction.date.slice(0, 7);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    const value = Math.abs(Number(transaction.amount) || 0);
    if (transaction.type === "income") bucket.receitas += value;
    if (transaction.type === "expense") bucket.despesas += value;
  }

  return order.map((key) => buckets.get(key)!);
}
