import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { GoogleButton } from "@/features/auth/components/GoogleButton";
import { signInSchema, type SignInValues } from "@/features/auth/schemas";
import { supabase } from "@/integrations/supabase/client";
import { routes } from "@/config/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth/")({
  head: () => ({
    meta: [
      { title: "Entrar — Gestão Segura" },
      { name: "description", content: "Acesse sua conta do Gestão Segura." },
      { property: "og:title", content: "Entrar — Gestão Segura" },
      { property: "og:description", content: "Acesse sua conta do Gestão Segura." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(values: SignInValues) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setLoading(false);

    if (error) {
      toast.error("Não foi possível entrar", {
        description: "Verifique seu e-mail e senha e tente novamente.",
      });
      return;
    }

    navigate({ to: routes.dashboard, replace: true });
  }

  return (
    <AuthShell
      title="Entrar"
      subtitle="Acesse sua conta para continuar."
      footer={
        <>
          Não tem uma conta?{" "}
          <Link to={routes.signUp} className="font-medium text-primary hover:underline">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email ? (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              to={routes.forgotPassword}
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground uppercase">ou</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton />
    </AuthShell>
  );
}
