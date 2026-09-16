import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Goal, GoalFormValues } from "@/features/goals/types";

const emptyForm: GoalFormValues = {
  name: "",
  targetAmount: 0,
  currentAmount: 0,
  deadline: null,
};

export function GoalFormDialog({
  open,
  onOpenChange,
  goal,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | undefined;
  onSubmit: (values: GoalFormValues) => Promise<boolean> | void;
}) {
  const [values, setValues] = useState<GoalFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setSaving(false);
    setValues(
      goal
        ? {
            name: goal.name,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            deadline: goal.deadline,
          }
        : emptyForm,
    );
  }, [open, goal]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!values.name.trim()) nextErrors["name"] = "Informe o nome da meta.";
    if (!Number.isFinite(values.targetAmount) || values.targetAmount <= 0)
      nextErrors["target"] = "Informe um valor alvo maior que zero.";
    if (values.currentAmount < 0)
      nextErrors["current"] = "O valor acumulado não pode ser negativo.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    const ok = await onSubmit({ ...values, name: values.name.trim() });
    setSaving(false);
    if (ok !== false) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{goal ? "Editar meta" : "Nova meta"}</DialogTitle>
          <DialogDescription>
            {goal
              ? "Atualize os valores desta meta."
              : "Defina um objetivo e acompanhe o progresso."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Nome</Label>
            <Input
              id="goal-name"
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              placeholder="Reserva de emergência"
            />
            {errors["name"] ? (
              <p className="text-xs text-destructive">{errors["name"]}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="goal-target">Valor alvo</Label>
              <Input
                id="goal-target"
                type="number"
                step="0.01"
                value={values.targetAmount}
                onChange={(e) =>
                  setValues((v) => ({ ...v, targetAmount: Number(e.target.value) }))
                }
              />
              {errors["target"] ? (
                <p className="text-xs text-destructive">{errors["target"]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-current">Valor acumulado</Label>
              <Input
                id="goal-current"
                type="number"
                step="0.01"
                value={values.currentAmount}
                onChange={(e) =>
                  setValues((v) => ({ ...v, currentAmount: Number(e.target.value) }))
                }
              />
              {errors["current"] ? (
                <p className="text-xs text-destructive">{errors["current"]}</p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="goal-deadline">Prazo (opcional)</Label>
              <Input
                id="goal-deadline"
                type="date"
                value={values.deadline ?? ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, deadline: e.target.value || null }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {goal ? "Salvar alterações" : "Criar meta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
