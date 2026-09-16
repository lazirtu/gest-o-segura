import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { errorMessage, requireUserId } from "@/lib/supabase-user";
import type { Bill, BillFormValues, BillStatus } from "@/features/bills/types";

export type BillsStatus = "loading" | "error" | "ready";

export function useBills() {
  const [status, setStatus] = useState<BillsStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const { data, error: queryError } = await supabase
        .from("bills")
        .select("id, name, amount, due_date, status")
        .order("due_date", { ascending: true });
      if (queryError) throw queryError;
      setBills(
        (data ?? []).map((row) => ({
          id: row.id,
          name: row.name,
          amount: Number(row.amount) || 0,
          dueDate: row.due_date,
          status: row.status as BillStatus,
        })),
      );
      setError(null);
      setStatus("ready");
    } catch (caught) {
      setError(errorMessage(caught, "Não foi possível carregar as contas a pagar."));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(
    async (values: BillFormValues): Promise<boolean> => {
      try {
        const userId = await requireUserId();
        const { error: mutationError } = await supabase.from("bills").insert({
          user_id: userId,
          name: values.name,
          amount: values.amount,
          due_date: values.dueDate,
          status: values.status,
        });
        if (mutationError) throw mutationError;
        await load();
        return true;
      } catch (caught) {
        setError(errorMessage(caught, "Não foi possível criar a conta a pagar."));
        return false;
      }
    },
    [load],
  );

  const update = useCallback(
    async (id: string, values: BillFormValues): Promise<boolean> => {
      try {
        const { error: mutationError } = await supabase
          .from("bills")
          .update({
            name: values.name,
            amount: values.amount,
            due_date: values.dueDate,
            status: values.status,
          })
          .eq("id", id);
        if (mutationError) throw mutationError;
        await load();
        return true;
      } catch (caught) {
        setError(errorMessage(caught, "Não foi possível atualizar a conta a pagar."));
        return false;
      }
    },
    [load],
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const { error: mutationError } = await supabase
          .from("bills")
          .delete()
          .eq("id", id);
        if (mutationError) throw mutationError;
        await load();
        return true;
      } catch (caught) {
        setError(errorMessage(caught, "Não foi possível excluir a conta a pagar."));
        return false;
      }
    },
    [load],
  );

  return { status, error, bills, load, create, update, remove };
}
