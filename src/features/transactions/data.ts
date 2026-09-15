import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  type LucideIcon,
} from "lucide-react";

import {
  transactionStatuses,
  transactionTypes,
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

export function transactionCategoryLabel(category: string | null): string {
  return category && category.trim() ? category : "Sem categoria";
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
