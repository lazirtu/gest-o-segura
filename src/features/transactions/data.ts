import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  type LucideIcon,
} from "lucide-react";

import {
  transactionCategories,
  transactionStatuses,
  transactionTypes,
  type TransactionCategory,
  type TransactionStatus,
  type TransactionType,
} from "@/features/transactions/types";

export const transactionIconMap: Record<TransactionType, LucideIcon> = {
  income: ArrowUpRight,
  expense: ArrowDownLeft,
  transfer: ArrowLeftRight,
};

export function transactionTypeLabel(type: TransactionType): string {
  return transactionTypes.find((item) => item.value === type)?.label ?? type;
}

export function transactionCategoryLabel(category: TransactionCategory): string {
  return transactionCategories.find((item) => item.value === category)?.label ?? category;
}

export function transactionStatusLabel(status: TransactionStatus): string {
  return transactionStatuses.find((item) => item.value === status)?.label ?? status;
}

/** Classe de cor semântica conforme o tipo da transação. */
export function transactionAmountClass(type: TransactionType): string {
  if (type === "income") return "text-success";
  if (type === "expense") return "text-destructive";
  return "text-foreground";
}

/** Prefixo de sinal exibido junto ao valor. */
export function transactionSignedAmount(type: TransactionType, amount: number): number {
  return type === "expense" ? -Math.abs(amount) : Math.abs(amount);
}
