import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { errorMessage, requireUserId } from "@/lib/supabase-user";
import type { Goal, GoalFormValues } from "@/features/goals/types";

export type GoalsStatus = "loading" | "error" | "ready";

export function useGoals() {
  const [status, setStatus] = useState<GoalsStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const { data, error: queryError } = await supabase
        .from("goals")
        .select("id, name, target_amount, current_amount, deadline")
        .order("created_at", { ascending: true });
      if (queryError) throw queryError;
      setGoals(
        (data ?? []).map((row) => ({
          id: row.id,
          name: row.name,
          targetAmount: Number(row.target_amount) || 0,
          currentAmount: Number(row.current_amount) || 0,
          deadline: row.deadline,
        })),
      );
      setError(null);
      setStatus("ready");
    } catch (caught) {
      setError(errorMessage(caught, "Não foi possível carregar suas metas."));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(
    async (values: GoalFormValues): Promise<boolean> => {
      try {
        const userId = await requireUserId();
        const { error: mutationError } = await supabase.from("goals").insert({
          user_id: userId,
          name: values.name,
          target_amount: values.targetAmount,
          current_amount: values.currentAmount,
          deadline: values.deadline,
        });
        if (mutationError) throw mutationError;
        await load();
        return true;
      } catch (caught) {
        setError(errorMessage(caught, "Não foi possível criar a meta."));
        return false;
      }
    },
    [load],
  );

  const update = useCallback(
    async (id: string, values: GoalFormValues): Promise<boolean> => {
      try {
        const { error: mutationError } = await supabase
          .from("goals")
          .update({
            name: values.name,
            target_amount: values.targetAmount,
            current_amount: values.currentAmount,
            deadline: values.deadline,
          })
          .eq("id", id);
        if (mutationError) throw mutationError;
        await load();
        return true;
      } catch (caught) {
        setError(errorMessage(caught, "Não foi possível atualizar a meta."));
        return false;
      }
    },
    [load],
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const { error: mutationError } = await supabase
          .from("goals")
          .delete()
          .eq("id", id);
        if (mutationError) throw mutationError;
        await load();
        return true;
      } catch (caught) {
        setError(errorMessage(caught, "Não foi possível excluir a meta."));
        return false;
      }
    },
    [load],
  );

  return { status, error, goals, load, create, update, remove };
}
