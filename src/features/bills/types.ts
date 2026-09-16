/** Tipos do módulo de Contas a pagar. */

export const billStatuses = [
  { value: "pending", label: "Pendente" },
  { value: "paid", label: "Paga" },
  { value: "overdue", label: "Atrasada" },
] as const;

export type BillStatus = (typeof billStatuses)[number]["value"];

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: BillStatus;
}

export interface BillFormValues {
  name: string;
  amount: number;
  dueDate: string;
  status: BillStatus;
}

export function billStatusLabel(status: BillStatus): string {
  return billStatuses.find((item) => item.value === status)?.label ?? status;
}
