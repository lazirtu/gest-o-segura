import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { errorMessage } from "@/lib/supabase-user";
import type { EvolutionInput } from "@/features/dashboard/data";

export type DashboardStatus = "loading" | "error" | "ready";

export interface DashboardGoal {
  id: string;
  name: string;
  current: number;
  target: number;
}

export interface DashboardBill {
  id: string;
  title: string;
  due: string;
  amount: number;
}

export interface DashboardTransaction {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
}

export interface DashboardData {
  balance: number;
  income: number;
  expenses: number;
  mainGoal: DashboardGoal | null;
  goals: DashboardGoal[];
  bills: DashboardBill[];
  recent: DashboardTransaction[];
  series: EvolutionInput[];
}

const emptyData: DashboardData = {
  balance: 0,
  income: 0,
  expenses: 0,
  mainGoal: null,
  goals: [],
  bills: [],
  recent: [],
  series: [],
};

/** Percentual de progresso de uma meta, limitado a 100%. */
export function goalPercent(goal: { current: number; target: number }): number {
  if (!goal.target) return 0;
  return Math.min(100, Math.round((goal.current / goal.target) * 100));
}

export function useDashboard() {
  const [status, setStatus] = useState<DashboardStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>(emptyData);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const [accountsResult, transactionsResult, billsResult, goalsResult] =
        await Promise.all([
          supabase.from("accounts").select("initial_balance, archived"),
          supabase
            .from("transactions")
            .select(
              "id, description, amount, type, transaction_date, categories(name)",
            )
            .order("transaction_date", { ascending: false }),
          supabase
            .from("bills")
            .select("id, name, amount, due_date, status")
            .order("due_date", { ascending: true }),
          supabase
            .from("goals")
            .select("id, name, target_amount, current_amount")
            .order("created_at", { ascending: true }),
        ]);

      if (accountsResult.error) throw accountsResult.error;
      if (transactionsResult.error) throw transactionsResult.error;
      if (billsResult.error) throw billsResult.error;
      if (goalsResult.error) throw goalsResult.error;

      const initial = (accountsResult.data ?? []).reduce(
        (sum, row) => sum + (Number(row.initial_balance) || 0),
        0,
      );

      const transactions = transactionsResult.data ?? [];
      let income = 0;
      let expenses = 0;
      for (const item of transactions) {
        const value = Math.abs(Number(item.amount) || 0);
        if (item.type === "income") income += value;
        if (item.type === "expense") expenses += value;
      }

      const goals: DashboardGoal[] = (goalsResult.data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        current: Number(row.current_amount) || 0,
        target: Number(row.target_amount) || 0,
      }));

      const mainGoal =
        goals.length > 0
          ? [...goals].sort((a, b) => goalPercent(b) - goalPercent(a))[0]!
          : null;

      setData({
        balance: initial + income - expenses,
        income,
        expenses,
        goals,
        mainGoal,
        bills: (billsResult.data ?? [])
          .filter((row) => row.status !== "paid")
          .slice(0, 6)
          .map((row) => ({
            id: row.id,
            title: row.name,
            due: row.due_date,
            amount: Number(row.amount) || 0,
          })),
        recent: transactions.slice(0, 5).map((row) => {
          const category = row.categories as { name: string } | null;
          const value = Math.abs(Number(row.amount) || 0);
          return {
            id: row.id,
            title: row.description,
            category: category?.name ?? "Sem categoria",
            date: row.transaction_date,
            amount: row.type === "expense" ? -value : value,
          };
        }),
        series: transactions.map((row) => ({
          date: row.transaction_date,
          amount: Number(row.amount) || 0,
          type: row.type,
        })),
      });
      setError(null);
      setStatus("ready");
    } catch (caught) {
      setError(errorMessage(caught, "Não foi possível carregar o painel."));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { status, error, data, load };
}
