"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Account,
  Transaction,
  CreditCard,
  StockHolding,
  MutualFund,
} from "@/types";
import {
  mockAccounts,
  mockTransactions,
  mockCreditCards,
  mockStocks,
  mockMutualFunds,
} from "@/lib/mockData";
import { generateId } from "@/lib/utils";

interface FinanceState {
  accounts: Account[];
  transactions: Transaction[];
  creditCards: CreditCard[];
  stocks: StockHolding[];
  mutualFunds: MutualFund[];
  isAuthenticated: boolean;
  userName: string;
  userEmail: string;

  login: (email: string, name: string) => void;
  logout: () => void;

  addAccount: (account: Omit<Account, "id">) => void;
  updateAccount: (id: string, data: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  addTransaction: (tx: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  addCreditCard: (card: Omit<CreditCard, "id">) => void;
  updateCreditCard: (id: string, data: Partial<CreditCard>) => void;
  deleteCreditCard: (id: string) => void;

  addStock: (stock: Omit<StockHolding, "id">) => void;
  updateStock: (id: string, data: Partial<StockHolding>) => void;
  deleteStock: (id: string) => void;

  addMutualFund: (mf: Omit<MutualFund, "id">) => void;
  updateMutualFund: (id: string, data: Partial<MutualFund>) => void;
  deleteMutualFund: (id: string) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      accounts: mockAccounts,
      transactions: mockTransactions,
      creditCards: mockCreditCards,
      stocks: mockStocks,
      mutualFunds: mockMutualFunds,
      isAuthenticated: false,
      userName: "",
      userEmail: "",

      login: (email, name) =>
        set({ isAuthenticated: true, userEmail: email, userName: name }),
      logout: () => set({ isAuthenticated: false, userName: "", userEmail: "" }),

      addAccount: (account) =>
        set((s) => ({
          accounts: [...s.accounts, { ...account, id: generateId() }],
        })),
      updateAccount: (id, data) =>
        set((s) => ({
          accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...data } : a)),
        })),
      deleteAccount: (id) =>
        set((s) => ({ accounts: s.accounts.filter((a) => a.id !== id) })),

      addTransaction: (tx) =>
        set((s) => {
          const newTx = { ...tx, id: generateId() };
          const accounts = s.accounts.map((a) => {
            if (a.id === tx.accountId) {
              const delta =
                tx.type === "income"
                  ? tx.amount
                  : tx.type === "expense"
                  ? -tx.amount
                  : -tx.amount;
              return { ...a, balance: a.balance + delta };
            }
            if (tx.type === "transfer" && a.id === tx.toAccountId) {
              return { ...a, balance: a.balance + tx.amount };
            }
            return a;
          });
          return { transactions: [newTx, ...s.transactions], accounts };
        }),
      updateTransaction: (id, data) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      addCreditCard: (card) =>
        set((s) => ({
          creditCards: [...s.creditCards, { ...card, id: generateId() }],
        })),
      updateCreditCard: (id, data) =>
        set((s) => ({
          creditCards: s.creditCards.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),
      deleteCreditCard: (id) =>
        set((s) => ({
          creditCards: s.creditCards.filter((c) => c.id !== id),
        })),

      addStock: (stock) =>
        set((s) => ({
          stocks: [...s.stocks, { ...stock, id: generateId() }],
        })),
      updateStock: (id, data) =>
        set((s) => ({
          stocks: s.stocks.map((s2) =>
            s2.id === id ? { ...s2, ...data } : s2
          ),
        })),
      deleteStock: (id) =>
        set((s) => ({ stocks: s.stocks.filter((s2) => s2.id !== id) })),

      addMutualFund: (mf) =>
        set((s) => ({
          mutualFunds: [...s.mutualFunds, { ...mf, id: generateId() }],
        })),
      updateMutualFund: (id, data) =>
        set((s) => ({
          mutualFunds: s.mutualFunds.map((m) =>
            m.id === id ? { ...m, ...data } : m
          ),
        })),
      deleteMutualFund: (id) =>
        set((s) => ({
          mutualFunds: s.mutualFunds.filter((m) => m.id !== id),
        })),
    }),
    { name: "wealthflow-store" }
  )
);
