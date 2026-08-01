import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { routes } from "@/config/app";

/** Encerra a sessão do usuário e limpa os dados em cache. */
export function useSignOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    setLoading(false);
    navigate({ to: routes.signIn, replace: true });
  }

  return { signOut, loading };
}
