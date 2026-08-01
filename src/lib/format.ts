import { appConfig } from "@/config/app";

/** Formata valores monetários usando a moeda e o locale da aplicação. */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(appConfig.locale, {
    style: "currency",
    currency: appConfig.currency,
  }).format(value);
}

/** Formata datas no padrão do locale da aplicação. */
export function formatDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(appConfig.locale, { dateStyle: "medium" }).format(date);
}
