import { supabase } from "@/integrations/supabase/client";

/** Retorna o id do usuário autenticado ou lança erro. Nunca use ids fixos. */
export async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error("Sessão expirada. Entre novamente para continuar.");
  }
  return data.user.id;
}

/** Extrai uma mensagem legível de qualquer erro vindo do backend. */
export function errorMessage(error: unknown, fallback = "Algo deu errado."): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}
