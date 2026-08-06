import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/components/layout/AppLayout";
import { TransactionsPage } from "@/features/transactions/components/TransactionsPage";

export const Route = createFileRoute("/_authenticated/transactions")({
  head: () => ({
    meta: [
      { title: "Transações — Gestão Segura" },
      {
        name: "description",
        content:
          "Registre e acompanhe receitas, despesas e transferências com filtros, busca e status.",
      },
      { property: "og:title", content: "Transações — Gestão Segura" },
      {
        property: "og:description",
        content:
          "Registre e acompanhe receitas, despesas e transferências com filtros, busca e status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TransactionsRoute,
});

function TransactionsRoute() {
  return (
    <AppLayout title="Transações" subtitle="Receitas, despesas e transferências">
      <TransactionsPage />
    </AppLayout>
  );
}
