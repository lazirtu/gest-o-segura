/** Tipos do módulo de Metas. */

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
}

export interface GoalFormValues {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
}

/** Progresso da meta em porcentagem, limitado a 100%. */
export function goalProgress(goal: {
  currentAmount: number;
  targetAmount: number;
}): number {
  if (!goal.targetAmount) return 0;
  return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
}
