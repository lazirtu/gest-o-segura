import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Archive,
  ArchiveRestore,
  Landmark,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Wallet,
} from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountCard } from "@/features/accounts/components/AccountCard";
import { AccountFormDialog } from "@/features/accounts/components/AccountFormDialog";
import { accountIconMap, accountTypeLabel, formatAccountAmount } from "@/features/accounts/data";
import { useAccounts } from "@/features/accounts/useAccounts";
import type { Account, AccountFormValues } from "@/features/accounts/types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type Filter = "all" | "active" | "archived";

function AccountsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="surface-card space-y-4 p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="size-11 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AccountsPage() {
  const { status, setStatus, accounts, load, create, update, remove, toggleArchive } =
    useAccounts();
  const [filter, setFilter] = useState<Filter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Account | undefined>(undefined);
  const [deleting, setDeleting] = useState<Account | undefined>(undefined);

  const visible = useMemo(() => {
    if (filter === "active") return accounts.filter((a) => !a.archived);
    if (filter === "archived") return accounts.filter((a) => a.archived);
    return accounts;
  }, [accounts, filter]);

  const totals = useMemo(() => {
    const active = accounts.filter((a) => !a.archived);
    return {
      total: active
        .filter((a) => a.currency === "BRL")
        .reduce((sum, a) => sum + a.currentBalance, 0),
      active: active.length,
      archived: accounts.length - active.length,
    };
  }, [accounts]);

  function handleSubmit(values: AccountFormValues) {
    if (editing) {
      update(editing.id, values);
      toast.success("Conta atualizada com sucesso.");
    } else {
      create(values);
      toast.success("Conta criada com sucesso.");
    }
    setEditing(undefined);
  }

  function handleToggleArchive(account: Account) {
    toggleArchive(account.id);
    toast.success(
      account.archived
        ? `${account.name} foi reativada.`
        : `${account.name} foi arquivada.`,
    );
  }

  function handleDelete() {
    if (!deleting) return;
    remove(deleting.id);
    toast.success(`${deleting.name} foi excluída.`);
    setDeleting(undefined);
  }

  return (
    <div className="animate-fade-in mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.15fr_2fr]">
        <article className="bg-gradient-brand hover-lift animate-rise relative overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-[var(--shadow-lift)]">
          <span
            aria-hidden
            className="absolute -top-16 -right-12 size-48 rounded-full bg-primary-foreground/10 blur-2xl"
          />
          <div className="relative flex items-start justify-between gap-3">
            <span className="text-xs font-semibold tracking-[0.16em] text-primary-foreground/70 uppercase">
              Saldo consolidado
            </span>
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary-foreground/15 backdrop-blur">
              <Wallet className="size-[1.1rem]" />
            </span>
          </div>
          <p className="num-display relative mt-6 text-3xl font-bold sm:text-[2.35rem]">
            {formatCurrency(totals.total)}
          </p>
          <p className="relative mt-2 text-xs text-primary-foreground/70">
            Somatório das contas ativas em BRL
          </p>
        </article>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "Contas ativas", value: totals.active, icon: Landmark },
            { label: "Contas arquivadas", value: totals.archived, icon: Archive },
          ].map((card, index) => (
            <article
              key={card.label}
              className="surface-card hover-lift animate-rise group p-5"
              style={{ animationDelay: `${(index + 1) * 70}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {card.label}
                </span>
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground transition-transform duration-300 group-hover:scale-110">
                  <card.icon className="size-[1.05rem]" />
                </span>
              </div>
              <p className="num-display mt-5 text-2xl font-bold sm:text-[1.7rem]">
                {card.value}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card animate-rise p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-bold tracking-tight">Suas contas</h2>
            <p className="text-xs text-muted-foreground">
              Gerencie saldos, instituições e status de cada conta.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="active">Ativas</TabsTrigger>
                <TabsTrigger value="archived">Arquivadas</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              onClick={() => {
                setEditing(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="size-4" /> Nova conta
            </Button>
          </div>
        </div>

        <div className="mt-5">
          {status === "loading" ? <AccountsSkeleton /> : null}

          {status === "error" ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertTriangle className="size-5" />
              </span>
              <h3 className="text-sm font-bold">Não foi possível carregar suas contas</h3>
              <p className="max-w-sm text-xs text-muted-foreground">
                Verifique sua conexão e tente novamente.
              </p>
              <Button variant="outline" onClick={load}>
                <RefreshCw className="size-4" /> Tentar novamente
              </Button>
            </div>
          ) : null}

          {status === "ready" && visible.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border px-6 py-14 text-center">
              <span className="grid size-14 place-items-center rounded-3xl bg-accent text-accent-foreground">
                <Wallet className="size-6" />
              </span>
              <h3 className="text-sm font-bold">
                {filter === "archived"
                  ? "Nenhuma conta arquivada"
                  : "Nenhuma conta cadastrada"}
              </h3>
              <p className="max-w-sm text-xs text-muted-foreground">
                Crie sua primeira conta para acompanhar saldos e organizar suas
                movimentações.
              </p>
              <Button
                onClick={() => {
                  setEditing(undefined);
                  setFormOpen(true);
                }}
              >
                <Plus className="size-4" /> Nova conta
              </Button>
            </div>
          ) : null}

          {status === "ready" && visible.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((account, index) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    index={index}
                    onEdit={() => {
                      setEditing(account);
                      setFormOpen(true);
                    }}
                    onToggleArchive={() => handleToggleArchive(account)}
                    onDelete={() => setDeleting(account)}
                  />
                ))}
              </div>

              <ul className="mt-6 hidden divide-y divide-border/70 lg:block">
                {visible.map((account) => {
                  const Icon = accountIconMap[account.icon];
                  return (
                    <li
                      key={account.id}
                      className="group -mx-2 flex items-center gap-3 rounded-2xl px-2 py-3 transition-colors hover:bg-muted/60"
                    >
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-2xl text-primary-foreground transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: account.color }}
                      >
                        <Icon className="size-[1.05rem]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{account.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {account.institution} · {accountTypeLabel(account.type)} ·{" "}
                          {account.currency}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "hidden rounded-full px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide uppercase sm:inline",
                          account.archived
                            ? "bg-muted text-muted-foreground"
                            : "bg-success/12 text-success",
                        )}
                      >
                        {account.archived ? "Arquivada" : "Ativa"}
                      </span>
                      <span className="num-display shrink-0 text-sm font-bold">
                        {formatAccountAmount(account.currentBalance, account.currency)}
                      </span>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Editar ${account.name}`}
                          onClick={() => {
                            setEditing(account);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={
                            account.archived
                              ? `Desarquivar ${account.name}`
                              : `Arquivar ${account.name}`
                          }
                          onClick={() => handleToggleArchive(account)}
                        >
                          {account.archived ? (
                            <ArchiveRestore className="size-4" />
                          ) : (
                            <Archive className="size-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Excluir ${account.name}`}
                          onClick={() => setDeleting(account)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </div>

        {status !== "loading" ? (
          <button
            type="button"
            onClick={() => setStatus(status === "error" ? "ready" : "error")}
            className="focus-ring mt-5 text-[0.7rem] text-muted-foreground underline-offset-4 hover:underline"
          >
            {status === "error"
              ? "Voltar para a listagem"
              : "Pré-visualizar estado de erro"}
          </button>
        ) : null}
      </section>

      <AccountFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(undefined);
        }}
        account={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conta</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A conta {deleting?.name} será removida
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
