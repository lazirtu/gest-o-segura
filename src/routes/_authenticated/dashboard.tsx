import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/components/layout/AppLayout";
import { SummaryCards } from "@/features/dashboard/components/SummaryCards";
import { EvolutionChart } from "@/features/dashboard/components/EvolutionChart";
import {
  RecentTransactions,
  UpcomingBills,
  GoalsProgress,
} from "@/features/dashboard/components/DashboardPanels";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Gestão Segura" },
      {
        name: "description",
        content: "Saldo, receitas, despesas, metas e vencimentos em um só painel.",
      },
      { property: "og:title", content: "Dashboard — Gestão Segura" },
      {
        property: "og:description",
        content: "Saldo, receitas, despesas, metas e vencimentos em um só painel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AppLayout title="Visão geral" subtitle="Bem-vindo ao Gestão Segura">
      <div className="animate-fade-in mx-auto w-full max-w-7xl space-y-5">
        <SummaryCards />

        <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
          <EvolutionChart />
          <UpcomingBills />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
          <RecentTransactions />
          <GoalsProgress />
        </div>
      </div>
    </AppLayout>
  );
}
