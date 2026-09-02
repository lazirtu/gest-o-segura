import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { errorMessage, requireUserId } from "@/lib/supabase-user";
import type { Category, CategoryType } from "@/features/categories/types";

export type CategoriesStatus = "loading" | "error" | "ready";

/** Categorias do usuário autenticado (usadas nos seletores de transações). */
export function useCategories() {
  const [status, setStatus] = useState<CategoriesStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const { data, error: queryError } = await supabase
        .from("categories")
        .select("id, name, type")
        .order("name", { ascending: true });
      if (queryError) throw queryError;
      setCategories(
        (data ?? []).map((row) => ({
          id: row.id,
          name: row.name,
          type: (row.type === "income" ? "income" : "expense") as CategoryType,
        })),
      );
      setError(null);
      setStatus("ready");
    } catch (caught) {
      setError(errorMessage(caught, "Não foi possível carregar as categorias."));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(
    async (name: string, type: CategoryType): Promise<Category | null> => {
      try {
        const userId = await requireUserId();
        const { data, error: mutationError } = await supabase
          .from("categories")
          .insert({ user_id: userId, name, type })
          .select("id, name, type")
          .single();
        if (mutationError) throw mutationError;
        const category: Category = { id: data.id, name: data.name, type };
        setCategories((prev) => [...prev, category].sort((a, b) => a.name.localeCompare(b.name)));
        return category;
      } catch (caught) {
        setError(errorMessage(caught, "Não foi possível criar a categoria."));
        return null;
      }
    },
    [],
  );

  return { status, categories, error, load, create };
}
