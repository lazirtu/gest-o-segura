/** Tipos do módulo de Contas (apenas interface, sem persistência). */

export const accountTypes = [
  { value: "checking", label: "Conta corrente" },
  { value: "savings", label: "Poupança" },
  { value: "wallet", label: "Carteira" },
  { value: "investment", label: "Investimento" },
  { value: "credit", label: "Cartão de crédito" },
] as const;

export type AccountType = (typeof accountTypes)[number]["value"];

export const accountCurrencies = [
  { value: "BRL", label: "Real (BRL)" },
  { value: "USD", label: "Dólar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
] as const;

export type AccountCurrency = (typeof accountCurrencies)[number]["value"];

export const accountColors = [
  { id: "petrol", label: "Petróleo", value: "oklch(0.42 0.06 215)" },
  { id: "emerald", label: "Esmeralda", value: "oklch(0.62 0.14 158)" },
  { id: "royal", label: "Azul royal", value: "oklch(0.55 0.15 258)" },
  { id: "violet", label: "Violeta", value: "oklch(0.55 0.17 300)" },
  { id: "amber", label: "Âmbar", value: "oklch(0.75 0.14 75)" },
  { id: "coral", label: "Coral", value: "oklch(0.63 0.18 25)" },
] as const;

export const accountIcons = [
  "wallet",
  "bank",
  "card",
  "piggy",
  "chart",
  "coins",
] as const;

export type AccountIconKey = (typeof accountIcons)[number];

export interface Account {
  id: string;
  name: string;
  institution: string;
  type: AccountType;
  currentBalance: number;
  initialBalance: number;
  currency: AccountCurrency;
  color: string;
  icon: AccountIconKey;
  archived: boolean;
}

export type AccountFormValues = Omit<Account, "id" | "archived">;
