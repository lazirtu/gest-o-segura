/** Tipos do módulo de Categorias. */

export const categoryTypes = [
  { value: "income", label: "Receita" },
  { value: "expense", label: "Despesa" },
] as const;

export type CategoryType = (typeof categoryTypes)[number]["value"];

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
}
