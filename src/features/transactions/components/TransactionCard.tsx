import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  transactionAmountClass,
  transactionCategoryLabel,
  transactionIconMap,
  transactionSignedAmount,
  transactionStatusLabel,
  transactionTypeLabel,
} from "@/features/transactions/data";
import type { Transaction } from "@/features/transactions/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusClass: Record<Transaction["status"], string> = {
  paid: "bg-success/12 text-success",
  pending: "bg-amber-500/12 text-amber-600 dark:text-amber-400",
  scheduled: "bg-primary/10 text-primary",
};

export function TransactionCard({
  transaction,
  index,
  onEdit,
  onDelete,
}: {
  transaction: Transaction;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const Icon = transactionIconMap[transaction.type];

  return (
    <article
      className="surface-card hover-lift animate-rise group p-5"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
              transaction.type === "income"
                ? "bg-success/12 text-success"
                : transaction.type === "expense"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-accent text-accent-foreground",
            )}
          >
            <Icon className="size-[1.1rem]" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{transaction.description}</p>
            <p className="truncate text-xs text-muted-foreground">
              {transaction.account} · {transactionCategoryLabel(transaction.category)}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              aria-label={`Ações de ${transaction.description}`}
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="size-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="size-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p
        className={cn(
          "num-display mt-5 text-2xl font-bold",
          transactionAmountClass(transaction.type),
        )}
      >
        {formatCurrency(transactionSignedAmount(transaction.type, transaction.amount))}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {formatDate(transaction.date)}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-muted px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide text-muted-foreground uppercase">
          {transactionTypeLabel(transaction.type)}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide uppercase",
            statusClass[transaction.status],
          )}
        >
          {transactionStatusLabel(transaction.status)}
        </span>
      </div>

      {transaction.notes ? (
        <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
          {transaction.notes}
        </p>
      ) : null}
    </article>
  );
}
