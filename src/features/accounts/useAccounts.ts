import { useCallback, useEffect, useState } from "react";

import type { Account, AccountFormValues } from "@/features/accounts/types";

/**
 * Estado local do módulo de Contas — apenas interface.
 * Substitua por server functions quando a persistência for implementada.
 */
export type AccountsStatus = "loading" | "error" | "ready";

const seed: Account[] = [];

export function useAccounts() {
  const [status, setStatus] = useState<AccountsStatus>("loading");
  const [accounts, setAccounts] = useState<Account[]>(seed);

  const load = useCallback(() => {
    setStatus("loading");
    const timer = setTimeout(() => setStatus("ready"), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => load(), [load]);

  const create = useCallback((values: AccountFormValues) => {
    setAccounts((prev) => [
      ...prev,
      { ...values, id: crypto.randomUUID(), archived: false },
    ]);
  }, []);

  const update = useCallback((id: string, values: AccountFormValues) => {
    setAccounts((prev) =>
      prev.map((account) => (account.id === id ? { ...account, ...values } : account)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setAccounts((prev) => prev.filter((account) => account.id !== id));
  }, []);

  const toggleArchive = useCallback((id: string) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === id ? { ...account, archived: !account.archived } : account,
      ),
    );
  }, []);

  return { status, setStatus, accounts, load, create, update, remove, toggleArchive };
}
