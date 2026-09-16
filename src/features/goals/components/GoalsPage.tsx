import { useState } from "react";
import { AlertTriangle, Pencil, Plus, RefreshCw, Target, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GoalFormDialog } from "@/features/goals/components/GoalFormDialog";
import { goalProgress, type Goal, type GoalFormValues } from "@/features/goals/types";
import { useGoals } from "@/features/goals/useGoals";
import { formatCurrency, formatDate } from "@/lib/format";

export function GoalsPage() {
  const { status, goals, load, create, update, remove } = useGoals();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | undefined>(undefined);
  const [deleting, setDeleting] = useState<Goal | undefined>(undefined);

  async function handleSubmit(values: GoalFormValues) {
    const ok = editing ? await update(editing.id, values) : await create(values);
    if (ok) {
      toast.success(editing ? "Meta atualizada." : "Meta criada com sucesso.");
      setEditing(undefined);
    } else {
      toast.error("Não foi possível salvar a meta.");
    }
    return ok;
  }

  async function handleDelete() {
    if (!deleting) return;
    const ok = await remove(deleting.id);
    toast[ok ? "success" : "error"](
      ok ? `${deleting.name} foi excluída.` : "Não foi possível excluir a meta.",
    );
    setDeleting(undefined);
  }

  return (
    <div className="animate-fade-in mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
      <section className="surface-card animate-rise p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-bold tracking-tight">Suas metas</h2>
            <p className="text-xs text-muted-foreground">
              Acompanhe o progresso dos seus objetivos financeiros.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditing(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" /> Nova meta
          </Button>
        </div>

        <div className="mt-5">
          {status === "loading" ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="surface-card space-y-4 p-5">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-2.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          ) : null}

          {status === "error" ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertTriangle className="size-5" />
              </span>
              <h3 className="text-sm font-bold">Não foi possível carregar suas metas</h3>
              <Button variant="outline" onClick={() => void load()}>
                <RefreshCw className="size-4" /> Tentar novamente
              </Button>
            </div>
          ) : null}

          {status === "ready" && goals.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border px-6 py-14 text-center">
              <span className="grid size-14 place-items-center rounded-3xl bg-accent text-accent-foreground">
                <Target className="size-6" />
              </span>
              <h3 className="text-sm font-bold">Nenhuma meta cadastrada</h3>
              <p className="max-w-sm text-xs text-muted-foreground">
                Crie uma meta para acompanhar quanto falta para alcançar seu objetivo.
              </p>
              <Button
                onClick={() => {
                  setEditing(undefined);
                  setFormOpen(true);
                }}
              >
                <Plus className="size-4" /> Nova meta
              </Button>
            </div>
          ) : null}

          {status === "ready" && goals.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {goals.map((goal, index) => {
                const percent = goalProgress(goal);
                return (
                  <article
                    key={goal.id}
                    className="surface-card hover-lift animate-rise p-5"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold tracking-tight">
                          {goal.name}
                        </h3>
                        <p className="truncate text-xs text-muted-foreground">
                          {goal.deadline
                            ? `Prazo: ${formatDate(goal.deadline)}`
                            : "Sem prazo definido"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Editar ${goal.name}`}
                          onClick={() => {
                            setEditing(goal);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Excluir ${goal.name}`}
                          className="text-destructive"
                          onClick={() => setDeleting(goal)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="num-display mt-5 text-2xl font-bold">
                      {formatCurrency(goal.currentAmount)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      de {formatCurrency(goal.targetAmount)}
                    </p>

                    <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="bg-gradient-success h-full rounded-full transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-success">
                      {percent}% concluído
                    </p>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      <GoalFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(undefined);
        }}
        goal={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir meta</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A meta será removida definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleDelete()}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
