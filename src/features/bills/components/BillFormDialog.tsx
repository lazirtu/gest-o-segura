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
import {
  billStatuses,
  type Bill,
  type BillFormValues,
  type BillStatus,
} from "@/features/bills/types";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const emptyForm: BillFormValues = {
  name: "",
  amount: 0,
  dueDate: today(),
  status: "pending",
};

export function BillFormDialog({
  open,
  onOpenChange,
  bill,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bill?: Bill | undefined;
  onSubmit: (values: BillFormValues) => Promise<boolean> | void;
}) {
  const [values, setValues] = useState<BillFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setSaving(false);
    setValues(
      bill
        ? {
            name: bill.name,
            amount: bill.amount,
            dueDate: bill.dueDate,
            status: bill.status,
          }
        : { ...emptyForm, dueDate: today() },
    );
  }, [open, bill]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!values.name.trim()) nextErrors["name"] = "Informe o nome da conta.";
    if (!Number.isFinite(values.amount) || values.amount <= 0)
      nextErrors["amount"] = "Informe um valor maior que zero.";
    if (!values.dueDate) nextErrors["dueDate"] = "Informe o vencimento.";
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
          <DialogTitle>{bill ? "Editar conta" : "Nova conta a pagar"}</DialogTitle>
          <DialogDescription>
            {bill
              ? "Atualize as informações deste vencimento."
              : "Cadastre um vencimento para acompanhar seus pagamentos."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bill-name">Nome</Label>
            <Input
              id="bill-name"
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              placeholder="Energia elétrica"
            />
            {errors["name"] ? (
              <p className="text-xs text-destructive">{errors["name"]}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bill-amount">Valor</Label>
              <Input
                id="bill-amount"
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
              <Label htmlFor="bill-due">Vencimento</Label>
              <Input
                id="bill-due"
                type="date"
                value={values.dueDate}
                onChange={(e) => setValues((v) => ({ ...v, dueDate: e.target.value }))}
              />
              {errors["dueDate"] ? (
                <p className="text-xs text-destructive">{errors["dueDate"]}</p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Status</Label>
              <Select
                value={values.status}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, status: value as BillStatus }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {billStatuses.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {bill ? "Salvar alterações" : "Criar conta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
