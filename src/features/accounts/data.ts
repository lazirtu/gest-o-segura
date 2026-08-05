import {
  Banknote,
  CreditCard,
  Landmark,
  LineChart,
  PiggyBank,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import {
  accountTypes,
  type AccountCurrency,
  type AccountIconKey,
  type AccountType,
} from "@/features/accounts/types";

export const accountIconMap: Record<AccountIconKey, LucideIcon> = {
  wallet: Wallet,
  bank: Landmark,
  card: CreditCard,
  piggy: PiggyBank,
  chart: LineChart,
  coins: Banknote,
};

export function accountTypeLabel(type: AccountType): string {
  return accountTypes.find((item) => item.value === type)?.label ?? type;
}

const currencyLocale: Record<AccountCurrency, string> = {
  BRL: "pt-BR",
  USD: "en-US",
  EUR: "de-DE",
};

/** Formata um valor conforme a moeda escolhida na conta. */
export function formatAccountAmount(value: number, currency: AccountCurrency): string {
  return new Intl.NumberFormat(currencyLocale[currency], {
    style: "currency",
    currency,
  }).format(value);
}
