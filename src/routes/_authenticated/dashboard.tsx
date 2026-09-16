import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SummaryCards } from "@/features/dashboard/components/SummaryCards";
import { EvolutionChart } from "@/features/dashboard/components/EvolutionChart";
import {
  RecentTransactions,
  UpcomingBills,
  GoalsProgress,
} from "@/features/dashboard/components/DashboardPanels";
import { useDashboard } from "@/features/dashboard/useDashboard";

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

function DashboardSkeleton() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.15fr_2fr]">
        <Skeleton className="h-56 rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-56 rounded-3xl" />
        </div>
      </div>
      <div className="grid gap-5 sm:gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Skeleton className="h-80 rounded-3xl" />
        <Skeleton className="h-80 rounded-3xl" />
      </div>
    </div>
  );
}

function DashboardPage() {
  const { status, data, load } = useDashboard();

  return (
    <AppLayout title="Visão geral" subtitle="Bem-vindo ao Gestão Segura">
      <div className="animate-fade-in mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
        {status === "loading" ? <DashboardSkeleton /> : null}

        {status === "error" ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-destructive/30 bg-destructive/5 px-6 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </span>
            <h2 className="text-sm font-bold">Não foi possível carregar o painel</h2>
            <p className="max-w-sm text-xs text-muted-foreground">
              Verifique sua conexão e tente novamente.
            </p>
            <Button variant="outline" onClick={() => void load()}>
              <RefreshCw className="size-4" /> Tentar novamente
            </Button>
          </div>
        ) : null}

        {status === "ready" ? (
          <>
            <SummaryCards
              balance={data.balance}
              income={data.income}
              expenses={data.expenses}
              mainGoal={data.mainGoal}
            />

            <div className="grid gap-5 sm:gap-6 xl:grid-cols-[1.6fr_1fr]">
              <EvolutionChart transactions={data.series} />
              <UpcomingBills items={data.bills} />
            </div>

            <div className="grid gap-5 sm:gap-6 xl:grid-cols-[1.6fr_1fr]">
              <RecentTransactions items={data.recent} />
              <GoalsProgress goals={data.goals} />
            </div>
          </>
        ) : null}
      </div>
    </AppLayout>
  );
}
