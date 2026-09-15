/** Tipos do módulo de Transações. */

export const transactionTypes = [
  { value: "income", label: "Receita" },
  { value: "expense", label: "Despesa" },
  { value: "transfer", label: "Transferência" },
] as const;

export type TransactionType = (typeof transactionTypes)[number]["value"];

export const transactionStatuses = [
  { value: "paid", label: "Concluída" },
  { value: "pending", label: "Pendente" },
  { value: "scheduled", label: "Agendada" },
] as const;

export type TransactionStatus = (typeof transactionStatuses)[number]["value"];

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  /** Id da categoria vinculada (pode ser nulo). */
  categoryId: string | null;
  /** Nome da categoria já resolvido para exibição. */
  category: string;
  /** Id da conta vinculada (pode ser nulo). */
  accountId: string | null;
  /** Nome da conta já resolvido para exibição. */
  account: string;
  date: string;
  status: TransactionStatus;
  notes: string;
}

export interface TransactionFormValues {
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string | null;
  accountId: string | null;
  date: string;
  status: TransactionStatus;
  notes: string;
}
