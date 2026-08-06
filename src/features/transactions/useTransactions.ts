import { useCallback, useEffect, useState } from "react";

import type {
  Transaction,
  TransactionFormValues,
} from "@/features/transactions/types";

/**
 * Estado local do módulo de Transações — apenas interface.
 * Substitua por server functions quando a persistência for implementada.
 */
export type TransactionsStatus = "loading" | "error" | "ready";

const seed: Transaction[] = [];

export function useTransactions() {
  const [status, setStatus] = useState<TransactionsStatus>("loading");
  const [transactions, setTransactions] = useState<Transaction[]>(seed);

  const load = useCallback(() => {
    setStatus("loading");
    const timer = setTimeout(() => setStatus("ready"), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => load(), [load]);

  const create = useCallback((values: TransactionFormValues) => {
    setTransactions((prev) => [{ ...values, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const update = useCallback((id: string, values: TransactionFormValues) => {
    setTransactions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...values } : item)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { status, setStatus, transactions, load, create, update, remove };
}
