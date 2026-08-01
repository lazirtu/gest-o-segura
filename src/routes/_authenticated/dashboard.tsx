import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/features/auth/useSignOut";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Gestão Financeira" },
      { name: "description", content: "Painel do Gestão Financeira." },
      { property: "og:title", content: "Dashboard — Gestão Financeira" },
      { property: "og:description", content: "Painel do Gestão Financeira." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { signOut, loading } = useSignOut();

  return (
    <AppLayout>
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Bem-vindo ao <span className="text-gradient-brand">Gestão Financeira</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Sua sessão está ativa. Os módulos financeiros serão adicionados em breve.
        </p>

        <Button className="mt-8" variant="outline" onClick={signOut} disabled={loading}>
          {loading ? "Saindo..." : "Sair"}
        </Button>
      </section>
    </AppLayout>
  );
}
