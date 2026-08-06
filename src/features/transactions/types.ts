/** Tipos do módulo de Transações (apenas interface, sem persistência). */

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

export const transactionCategories = [
  { value: "salary", label: "Salário" },
  { value: "investments", label: "Investimentos" },
  { value: "housing", label: "Moradia" },
  { value: "food", label: "Alimentação" },
  { value: "transport", label: "Transporte" },
  { value: "health", label: "Saúde" },
  { value: "education", label: "Educação" },
  { value: "leisure", label: "Lazer" },
  { value: "others", label: "Outros" },
] as const;

export type TransactionCategory = (typeof transactionCategories)[number]["value"];

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  account: string;
  date: string;
  status: TransactionStatus;
  notes: string;
}

export type TransactionFormValues = Omit<Transaction, "id">;
