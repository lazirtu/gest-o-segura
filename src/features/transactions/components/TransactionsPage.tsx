import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Pencil,
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionCard } from "@/features/transactions/components/TransactionCard";
import { TransactionFormDialog } from "@/features/transactions/components/TransactionFormDialog";
import {
  transactionAmountClass,
  transactionCategoryLabel,
  transactionIconMap,
  transactionSignedAmount,
  transactionStatusLabel,
} from "@/features/transactions/data";
import { useTransactions } from "@/features/transactions/useTransactions";
import type {
  Transaction,
  TransactionFormValues,
} from "@/features/transactions/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type Filter = "all" | "income" | "expense" | "transfer";

function TransactionsSkeleton() {
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

export function TransactionsPage() {
  const { status, setStatus, transactions, load, create, update, remove } =
    useTransactions();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | undefined>(undefined);
  const [deleting, setDeleting] = useState<Transaction | undefined>(undefined);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return transactions
      .filter((item) => (filter === "all" ? true : item.type === filter))
      .filter((item) =>
        term
          ? item.description.toLowerCase().includes(term) ||
            item.account.toLowerCase().includes(term)
          : true,
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filter, query]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  async function handleSubmit(values: TransactionFormValues) {
    const ok = editing ? await update(editing.id, values) : await create(values);
    if (ok) {
      toast.success(
        editing ? "Transação atualizada com sucesso." : "Transação criada com sucesso.",
      );
      setEditing(undefined);
    } else {
      toast.error("Não foi possível salvar a transação. Tente novamente.");
    }
    return ok;
  }

  async function handleDelete() {
    if (!deleting) return;
    const ok = await remove(deleting.id);
    toast[ok ? "success" : "error"](
      ok
        ? `${deleting.description} foi excluída.`
        : "Não foi possível excluir a transação.",
    );
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
              Resultado do período
            </span>
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary-foreground/15 backdrop-blur">
              <ArrowLeftRight className="size-[1.1rem]" />
            </span>
          </div>
          <p className="num-display relative mt-6 text-3xl font-bold sm:text-[2.35rem]">
            {formatCurrency(totals.balance)}
          </p>
          <p className="relative mt-2 text-xs text-primary-foreground/70">
            Receitas menos despesas registradas
          </p>
        </article>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              label: "Receitas",
              value: formatCurrency(totals.income),
              icon: ArrowUpRight,
              tone: "text-success",
            },
            {
              label: "Despesas",
              value: formatCurrency(totals.expense),
              icon: ArrowDownLeft,
              tone: "text-destructive",
            },
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
              <p
                className={cn(
                  "num-display mt-5 text-2xl font-bold sm:text-[1.7rem]",
                  card.tone,
                )}
              >
                {card.value}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card animate-rise p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-bold tracking-tight">Suas transações</h2>
            <p className="text-xs text-muted-foreground">
              Acompanhe receitas, despesas e transferências.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar"
                aria-label="Buscar transações"
                className="w-44 pl-9"
              />
            </div>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="income">Receitas</TabsTrigger>
                <TabsTrigger value="expense">Despesas</TabsTrigger>
                <TabsTrigger value="transfer">Transferências</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              onClick={() => {
                setEditing(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="size-4" /> Nova transação
            </Button>
          </div>
        </div>

        <div className="mt-5">
          {status === "loading" ? <TransactionsSkeleton /> : null}

          {status === "error" ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertTriangle className="size-5" />
              </span>
              <h3 className="text-sm font-bold">
                Não foi possível carregar suas transações
              </h3>
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
                {transactions.length === 0
                  ? "Nenhuma transação registrada"
                  : "Nenhum resultado encontrado"}
              </h3>
              <p className="max-w-sm text-xs text-muted-foreground">
                Registre sua primeira movimentação para acompanhar entradas e saídas.
              </p>
              <Button
                onClick={() => {
                  setEditing(undefined);
                  setFormOpen(true);
                }}
              >
                <Plus className="size-4" /> Nova transação
              </Button>
            </div>
          ) : null}

          {status === "ready" && visible.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((transaction, index) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    index={index}
                    onEdit={() => {
                      setEditing(transaction);
                      setFormOpen(true);
                    }}
                    onDelete={() => setDeleting(transaction)}
                  />
                ))}
              </div>

              <ul className="mt-6 hidden divide-y divide-border/70 lg:block">
                {visible.map((transaction) => {
                  const Icon = transactionIconMap[transaction.type];
                  return (
                    <li
                      key={transaction.id}
                      className="group -mx-2 flex items-center gap-3 rounded-2xl px-2 py-3 transition-colors hover:bg-muted/60"
                    >
                      <span
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
                          transaction.type === "income"
                            ? "bg-success/12 text-success"
                            : transaction.type === "expense"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-accent text-accent-foreground",
                        )}
                      >
                        <Icon className="size-[1.05rem]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {transaction.description}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {transaction.account} ·{" "}
                          {transactionCategoryLabel(transaction.category)} ·{" "}
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                      <span className="hidden rounded-full bg-muted px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide text-muted-foreground uppercase sm:inline">
                        {transactionStatusLabel(transaction.status)}
                      </span>
                      <span
                        className={cn(
                          "num-display shrink-0 text-sm font-bold",
                          transactionAmountClass(transaction.type),
                        )}
                      >
                        {formatCurrency(
                          transactionSignedAmount(transaction.type, transaction.amount),
                        )}
                      </span>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Editar ${transaction.description}`}
                          onClick={() => {
                            setEditing(transaction);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Excluir ${transaction.description}`}
                          onClick={() => setDeleting(transaction)}
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

      <TransactionFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(undefined);
        }}
        transaction={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A transação {deleting?.description} será
              removida permanentemente.
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
