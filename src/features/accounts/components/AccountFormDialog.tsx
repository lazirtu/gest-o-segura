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
import { accountIconMap } from "@/features/accounts/data";
import {
  accountColors,
  accountCurrencies,
  accountIcons,
  accountTypes,
  type Account,
  type AccountCurrency,
  type AccountFormValues,
  type AccountIconKey,
  type AccountType,
} from "@/features/accounts/types";
import { cn } from "@/lib/utils";

const emptyForm: AccountFormValues = {
  name: "",
  institution: "",
  type: "checking",
  currentBalance: 0,
  initialBalance: 0,
  currency: "BRL",
  color: accountColors[0].value,
  icon: "wallet",
};

export function AccountFormDialog({
  open,
  onOpenChange,
  account,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: Account | undefined;
  onSubmit: (values: AccountFormValues) => void;
}) {
  const [values, setValues] = useState<AccountFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setSaving(false);
    setValues(
      account
        ? {
            name: account.name,
            institution: account.institution,
            type: account.type,
            currentBalance: account.currentBalance,
            initialBalance: account.initialBalance,
            currency: account.currency,
            color: account.color,
            icon: account.icon,
          }
        : emptyForm,
    );
  }, [open, account]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!values.name.trim()) nextErrors["name"] = "Informe o nome da conta.";
    if (!values.institution.trim())
      nextErrors["institution"] = "Informe a instituição.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    setTimeout(() => {
      onSubmit({ ...values, name: values.name.trim(), institution: values.institution.trim() });
      setSaving(false);
      onOpenChange(false);
    }, 450);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{account ? "Editar conta" : "Nova conta"}</DialogTitle>
          <DialogDescription>
            {account
              ? "Atualize as informações desta conta."
              : "Cadastre uma conta para organizar seus saldos."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="account-name">Nome</Label>
              <Input
                id="account-name"
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                placeholder="Conta principal"
              />
              {errors["name"] ? (
                <p className="text-xs text-destructive">{errors["name"]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-institution">Instituição</Label>
              <Input
                id="account-institution"
                value={values.institution}
                onChange={(e) =>
                  setValues((v) => ({ ...v, institution: e.target.value }))
                }
                placeholder="Banco, corretora ou carteira"
              />
              {errors["institution"] ? (
                <p className="text-xs text-destructive">{errors["institution"]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={values.type}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, type: value as AccountType }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Moeda</Label>
              <Select
                value={values.currency}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, currency: value as AccountCurrency }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accountCurrencies.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-initial">Saldo inicial</Label>
              <Input
                id="account-initial"
                type="number"
                step="0.01"
                value={values.initialBalance}
                onChange={(e) =>
                  setValues((v) => ({ ...v, initialBalance: Number(e.target.value) }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-current">Saldo atual</Label>
              <Input
                id="account-current"
                type="number"
                step="0.01"
                value={values.currentBalance}
                readOnly
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Calculado a partir do saldo inicial e das transações.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor personalizada</Label>
            <div className="flex flex-wrap gap-2">
              {accountColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  aria-label={color.label}
                  onClick={() => setValues((v) => ({ ...v, color: color.value }))}
                  className={cn(
                    "focus-ring size-9 rounded-2xl transition-transform duration-200 hover:scale-110",
                    values.color === color.value &&
                      "ring-2 ring-ring ring-offset-2 ring-offset-background",
                  )}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="flex flex-wrap gap-2">
              {accountIcons.map((key: AccountIconKey) => {
                const Icon = accountIconMap[key];
                const active = values.icon === key;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-label={`Ícone ${key}`}
                    onClick={() => setValues((v) => ({ ...v, icon: key }))}
                    className={cn(
                      "focus-ring grid size-10 place-items-center rounded-2xl border transition-all duration-200 hover:scale-105",
                      active
                        ? "border-transparent bg-accent text-accent-foreground"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                  </button>
                );
              })}
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
              {account ? "Salvar alterações" : "Criar conta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
