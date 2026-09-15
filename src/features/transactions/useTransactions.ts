import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { errorMessage, requireUserId } from "@/lib/supabase-user";
import type {
  Transaction,
  TransactionFormValues,
  TransactionStatus,
  TransactionType,
} from "@/features/transactions/types";

export type TransactionsStatus = "loading" | "error" | "ready";

export function useTransactions() {
  const [status, setStatus] = useState<TransactionsStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const { data, error: queryError } = await supabase
        .from("transactions")
        .select(
          "id, description, amount, type, status, notes, transaction_date, account_id, category_id, accounts(name), categories(name)",
        )
        .order("transaction_date", { ascending: false });
      if (queryError) throw queryError;

      setTransactions(
        (data ?? []).map((row) => {
          const account = row.accounts as { name: string } | null;
          const category = row.categories as { name: string } | null;
          return {
            id: row.id,
            description: row.description,
            amount: Number(row.amount) || 0,
            type: row.type as TransactionType,
            status: row.status as TransactionStatus,
            notes: row.notes ?? "",
            date: row.transaction_date,
            accountId: row.account_id,
            account: account?.name ?? "Sem conta",
            categoryId: row.category_id,
            category: category?.name ?? "",
          };
        }),
      );
      setError(null);
      setStatus("ready");
    } catch (caught) {
      setError(errorMessage(caught, "Não foi possível carregar suas transações."));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(
    async (values: TransactionFormValues): Promise<boolean> => {
      try {
        const userId = await requireUserId();
        const { error: mutationError } = await supabase.from("transactions").insert({
          user_id: userId,
          description: values.description,
          amount: Math.abs(values.amount),
          type: values.type,
          status: values.status,
          notes: values.notes,
          transaction_date: values.date,
          account_id: values.accountId,
          category_id: values.categoryId,
        });
        if (mutationError) throw mutationError;
        await load();
        return true;
      } catch (caught) {
        setError(errorMessage(caught, "Não foi possível criar a transação."));
        return false;
      }
    },
    [load],
  );

  const update = useCallback(
    async (id: string, values: TransactionFormValues): Promise<boolean> => {
      try {
        const { error: mutationError } = await supabase
          .from("transactions")
          .update({
            description: values.description,
            amount: Math.abs(values.amount),
            type: values.type,
            status: values.status,
            notes: values.notes,
            transaction_date: values.date,
            account_id: values.accountId,
            category_id: values.categoryId,
          })
          .eq("id", id);
        if (mutationError) throw mutationError;
        await load();
        return true;
      } catch (caught) {
        setError(errorMessage(caught, "Não foi possível atualizar a transação."));
        return false;
      }
    },
    [load],
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const { error: mutationError } = await supabase
          .from("transactions")
          .delete()
          .eq("id", id);
        if (mutationError) throw mutationError;
        await load();
        return true;
      } catch (caught) {
        setError(errorMessage(caught, "Não foi possível excluir a transação."));
        return false;
      }
    },
    [load],
  );

  return { status, setStatus, error, transactions, load, create, update, remove };
}
