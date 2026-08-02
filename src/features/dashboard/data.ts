/**
 * Dados de apresentação do dashboard.
 * Placeholder visual até a integração com os módulos financeiros.
 */

export type RangeKey = "30d" | "3m" | "6m";

export const rangeOptions: { key: RangeKey; label: string }[] = [
  { key: "30d", label: "30 dias" },
  { key: "3m", label: "3 meses" },
  { key: "6m", label: "6 meses" },
];

export const evolutionSeries: Record<
  RangeKey,
  { label: string; receitas: number; despesas: number }[]
> = {
  "30d": [
    { label: "01", receitas: 1800, despesas: 1200 },
    { label: "07", receitas: 2400, despesas: 1500 },
    { label: "14", receitas: 2100, despesas: 1750 },
    { label: "21", receitas: 3200, despesas: 1900 },
    { label: "28", receitas: 2900, despesas: 1600 },
  ],
  "3m": [
    { label: "Mai", receitas: 8200, despesas: 6100 },
    { label: "Jun", receitas: 9100, despesas: 6800 },
    { label: "Jul", receitas: 9800, despesas: 6400 },
  ],
  "6m": [
    { label: "Fev", receitas: 7400, despesas: 5900 },
    { label: "Mar", receitas: 7900, despesas: 6300 },
    { label: "Abr", receitas: 8600, despesas: 5800 },
    { label: "Mai", receitas: 8200, despesas: 6100 },
    { label: "Jun", receitas: 9100, despesas: 6800 },
    { label: "Jul", receitas: 9800, despesas: 6400 },
  ],
};

export const summary = {
  balance: 24580.4,
  income: 9800,
  expenses: 6400,
  goal: { name: "Reserva de emergência", current: 12400, target: 20000 },
};

export const recentTransactions = [
  { id: "1", title: "Salário", category: "Renda", date: "05 jul", amount: 7800 },
  { id: "2", title: "Aluguel", category: "Moradia", date: "04 jul", amount: -2200 },
  { id: "3", title: "Supermercado", category: "Alimentação", date: "03 jul", amount: -486.9 },
  { id: "4", title: "Freelance", category: "Renda extra", date: "02 jul", amount: 2000 },
  { id: "5", title: "Streaming", category: "Assinaturas", date: "01 jul", amount: -59.9 },
];

export const upcomingBills = [
  { id: "1", title: "Cartão de crédito", due: "Vence em 3 dias", amount: 1840.5 },
  { id: "2", title: "Energia elétrica", due: "Vence em 6 dias", amount: 268.3 },
  { id: "3", title: "Internet", due: "Vence em 9 dias", amount: 129.9 },
  { id: "4", title: "Plano de saúde", due: "Vence em 12 dias", amount: 612 },
];

export const goals = [
  { id: "1", name: "Reserva de emergência", current: 12400, target: 20000 },
  { id: "2", name: "Viagem de fim de ano", current: 3400, target: 8000 },
  { id: "3", name: "Troca de notebook", current: 2100, target: 6500 },
];
