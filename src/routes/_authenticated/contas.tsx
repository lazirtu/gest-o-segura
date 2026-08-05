import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/components/layout/AppLayout";
import { AccountsPage } from "@/features/accounts/components/AccountsPage";

export const Route = createFileRoute("/_authenticated/contas")({
  head: () => ({
    meta: [
      { title: "Contas — Gestão Segura" },
      {
        name: "description",
        content:
          "Gerencie contas bancárias, carteiras e investimentos com saldos, moedas e status.",
      },
      { property: "og:title", content: "Contas — Gestão Segura" },
      {
        property: "og:description",
        content:
          "Gerencie contas bancárias, carteiras e investimentos com saldos, moedas e status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContasRoute,
});

function ContasRoute() {
  return (
    <AppLayout title="Contas" subtitle="Bancos, carteiras e investimentos">
      <AccountsPage />
    </AppLayout>
  );
}
