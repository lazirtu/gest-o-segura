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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  transactionCategories,
  transactionStatuses,
  transactionTypes,
  type Transaction,
  type TransactionCategory,
  type TransactionFormValues,
  type TransactionStatus,
  type TransactionType,
} from "@/features/transactions/types";
import { cn } from "@/lib/utils";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const emptyForm: TransactionFormValues = {
  description: "",
  amount: 0,
  type: "expense",
  category: "others",
  account: "",
  date: today(),
  status: "paid",
  notes: "",
};

export function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | undefined;
  onSubmit: (values: TransactionFormValues) => void;
}) {
  const [values, setValues] = useState<TransactionFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setSaving(false);
    setValues(
      transaction
        ? {
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
            account: transaction.account,
            date: transaction.date,
            status: transaction.status,
            notes: transaction.notes,
          }
        : { ...emptyForm, date: today() },
    );
  }, [open, transaction]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!values.description.trim())
      nextErrors["description"] = "Informe a descrição.";
    if (!values.account.trim()) nextErrors["account"] = "Informe a conta.";
    if (!values.date) nextErrors["date"] = "Informe a data.";
    if (!Number.isFinite(values.amount) || Math.abs(values.amount) <= 0)
      nextErrors["amount"] = "Informe um valor maior que zero.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    setTimeout(() => {
      onSubmit({
        ...values,
        description: values.description.trim(),
        account: values.account.trim(),
        notes: values.notes.trim(),
        amount: Math.abs(values.amount),
      });
      setSaving(false);
      onOpenChange(false);
    }, 450);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription>
            {transaction
              ? "Atualize as informações desta movimentação."
              : "Registre uma movimentação para acompanhar suas finanças."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="grid grid-cols-3 gap-2">
              {transactionTypes.map((item) => {
                const active = values.type === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setValues((v) => ({ ...v, type: item.value as TransactionType }))
                    }
                    className={cn(
                      "focus-ring rounded-2xl border px-3 py-2.5 text-xs font-semibold transition-all duration-200",
                      active
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border text-muted-foreground hover:bg-muted/60",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tx-description">Descrição</Label>
              <Input
                id="tx-description"
                value={values.description}
                onChange={(e) =>
                  setValues((v) => ({ ...v, description: e.target.value }))
                }
                placeholder="Supermercado, salário, aluguel..."
              />
              {errors["description"] ? (
                <p className="text-xs text-destructive">{errors["description"]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tx-amount">Valor</Label>
              <Input
                id="tx-amount"
                type="number"
                step="0.01"
                value={values.amount}
                onChange={(e) =>
                  setValues((v) => ({ ...v, amount: Number(e.target.value) }))
                }
              />
              {errors["amount"] ? (
                <p className="text-xs text-destructive">{errors["amount"]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tx-date">Data</Label>
              <Input
                id="tx-date"
                type="date"
                value={values.date}
                onChange={(e) => setValues((v) => ({ ...v, date: e.target.value }))}
              />
              {errors["date"] ? (
                <p className="text-xs text-destructive">{errors["date"]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={values.category}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, category: value as TransactionCategory }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {transactionCategories.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={values.status}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, status: value as TransactionStatus }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {transactionStatuses.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tx-account">Conta</Label>
              <Input
                id="tx-account"
                value={values.account}
                onChange={(e) => setValues((v) => ({ ...v, account: e.target.value }))}
                placeholder="Conta principal"
              />
              {errors["account"] ? (
                <p className="text-xs text-destructive">{errors["account"]}</p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tx-notes">Observações</Label>
              <Textarea
                id="tx-notes"
                rows={3}
                value={values.notes}
                onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
                placeholder="Detalhes opcionais sobre a movimentação"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {transaction ? "Salvar alterações" : "Criar transação"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
