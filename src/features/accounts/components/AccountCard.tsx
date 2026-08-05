import {
  Archive,
  ArchiveRestore,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { accountIconMap, accountTypeLabel, formatAccountAmount } from "@/features/accounts/data";
import type { Account } from "@/features/accounts/types";
import { cn } from "@/lib/utils";

export function AccountCard({
  account,
  index,
  onEdit,
  onToggleArchive,
  onDelete,
}: {
  account: Account;
  index: number;
  onEdit: () => void;
  onToggleArchive: () => void;
  onDelete: () => void;
}) {
  const Icon = accountIconMap[account.icon];
  const variation = account.currentBalance - account.initialBalance;

  return (
    <article
      className={cn(
        "surface-card hover-lift animate-rise group relative overflow-hidden p-5",
        account.archived && "opacity-70",
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: account.color }}
      />
      <span
        aria-hidden
        className="absolute -top-10 -right-8 size-28 rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
        style={{ backgroundColor: account.color }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="grid size-11 shrink-0 place-items-center rounded-2xl text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: account.color }}
          >
            <Icon className="size-[1.15rem]" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold tracking-tight">{account.name}</h3>
            <p className="truncate text-xs text-muted-foreground">
              {account.institution} · {accountTypeLabel(account.type)}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Ações da conta ${account.name}`}
            className="focus-ring rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={onEdit}>
              <Pencil className="size-4" /> Editar conta
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onToggleArchive}>
              {account.archived ? (
                <>
                  <ArchiveRestore className="size-4" /> Desarquivar
                </>
              ) : (
                <>
                  <Archive className="size-4" /> Arquivar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="num-display relative mt-5 text-2xl font-bold">
        {formatAccountAmount(account.currentBalance, account.currency)}
      </p>
      <p className="relative mt-1 text-xs text-muted-foreground">
        Saldo inicial {formatAccountAmount(account.initialBalance, account.currency)}
      </p>

      <div className="relative mt-5 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4 text-[0.68rem] font-semibold">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 tracking-wide uppercase",
            account.archived
              ? "bg-muted text-muted-foreground"
              : "bg-success/12 text-success",
          )}
        >
          {account.archived ? "Arquivada" : "Ativa"}
        </span>
        <span className="rounded-full bg-accent px-2.5 py-1 tracking-wide text-accent-foreground uppercase">
          {account.currency}
        </span>
        <span
          className={cn(
            "num-display ml-auto text-xs",
            variation >= 0 ? "text-success" : "text-destructive",
          )}
        >
          {variation >= 0 ? "+" : "−"}
          {formatAccountAmount(Math.abs(variation), account.currency)}
        </span>
      </div>
    </article>
  );
}
