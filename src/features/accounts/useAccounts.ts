import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { errorMessage, requireUserId } from "@/lib/supabase-user";
import type {
  Account,
  AccountCurrency,
  AccountFormValues,
  AccountIconKey,
  AccountType,
} from "@/features/accounts/types";

/** Estados de carregamento do módulo de Contas. */
export type AccountsStatus = "loading" | "error" | "ready";

export function useAccounts() {
  const [status, setStatus] = useState<AccountsStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const [accountsResult, transactionsResult] = await Promise.all([
        supabase
          .from("accounts")
          .select(
            "id, name, institution, type, initial_balance, currency, color, icon, archived, created_at",
          )
          .order("created_at", { ascending: true }),
        supabase.from("transactions").select("account_id, amount, type"),
      ]);

      if (accountsResult.error) throw accountsResult.error;
      if (transactionsResult.error) throw transactionsResult.error;

      const movement = new Map<string, number>();
      for (const item of transactionsResult.data ?? []) {
        if (!item.account_id) continue;
        const value = Number(item.amount) || 0;
        const delta = item.type === "income" ? value : item.type === "expense" ? -value : 0;
        movement.set(item.account_id, (movement.get(item.account_id) ?? 0) + delta);
      }

      setAccounts(
        (accountsResult.data ?? []).map((row) => {
          const initialBalance = Number(row.initial_balance) || 0;
          return {
            id: row.id,
            name: row.name,
            institution: row.institution ?? "",
            type: row.type as AccountType,
            initialBalance,
            currentBalance: initialBalance + (movement.get(row.id) ?? 0),
            currency: row.currency as AccountCurrency,
            color: row.color,
            icon: row.icon as AccountIconKey,
            archived: Boolean(row.archived),
          };
        }),
      );
      setError(null);
      setStatus("ready");
    } catch (caught) {
      setError(errorMessage(caught, "Não foi possível carregar suas contas."));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(
    async (values: AccountFormValues): Promise<boolean> => {
      try {
        const userId = await requireUserId();
        const { error: mutationError } = await supabase.from("accounts").insert({
          user_id: userId,
          name: values.name,
          institution: values.institution,
          type: values.type,
          initial_balance: values.initialBalance,
          currency: values.currency,
          color: values.color,
          icon: values.icon,
        });
        if (mutationError) throw mutationError;
        await load();
        return true;
      } catch (caught) {
        setError(errorMessage(caught, "Não foi possível criar a conta."));
        return false;
      }
    },
    [load],
  );

  const update = useCallback(
    async (id: string, values: AccountFormValues): Promise<boolean> => {
      try {
        const { error: mutationError } = await supabase
          .from("accounts")
          .update({
            name: values.name,
            institution: values.institution,
            type: values.type,
            initial_balance: values.initialBalance,
            currency: values.currency,
            color: values.color,
            icon: values.icon,
          })
          .eq("id", id);
        if (mutationError) throw mutationError;
        await load();
        return true;
      } catch (caught) {
        setError(errorMessage(caught, "Não foi possível atualizar a conta."));
        return false;
      }
    },
    [load],
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const { error: mutationError } = await supabase
          .from("accounts")
          .delete()
          .eq("id", id);
        if (mutationError) throw mutationError;
        await load();
        return true;
      } catch (caught) {
        setError(errorMessage(caught, "Não foi possível excluir a conta."));
        return false;
      }
    },
    [load],
  );

  const toggleArchive = useCallback(
    async (id: string): Promise<boolean> => {
      const current = accounts.find((account) => account.id === id);
      if (!current) return false;
      try {
        const { error: mutationError } = await supabase
          .from("accounts")
          .update({ archived: !current.archived })
          .eq("id", id);
        if (mutationError) throw mutationError;
        await load();
        return true;
      } catch (caught) {
        setError(errorMessage(caught, "Não foi possível arquivar a conta."));
        return false;
      }
    },
    [accounts, load],
  );

  return {
    status,
    setStatus,
    error,
    accounts,
    load,
    create,
    update,
    remove,
    toggleArchive,
  };
}
