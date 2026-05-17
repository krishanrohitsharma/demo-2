"use client";

import { useState, useMemo } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Plus,
  Search,
  Trash2,
  Filter,
} from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import {
  formatFullCurrency,
  formatDate,
  getCategoryLabel,
  getCategoryColor,
} from "@/lib/utils";
import AddTransactionModal from "@/components/modals/AddTransactionModal";
import type { TransactionType } from "@/types";

const typeColors = {
  income: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
  expense: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
  transfer: { bg: "rgba(99,102,241,0.1)", color: "#a78bfa" },
};

export default function TransactionsPage() {
  const { transactions, accounts, deleteTransaction } = useFinanceStore();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");
  const [filterAccount, setFilterAccount] = useState("all");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        !search ||
        (t.notes?.toLowerCase().includes(search.toLowerCase()) ||
          getCategoryLabel(t.category).toLowerCase().includes(search.toLowerCase()));
      const matchesType = filterType === "all" || t.type === filterType;
      const matchesAccount = filterAccount === "all" || t.accountId === filterAccount;
      return matchesSearch && matchesType && matchesAccount;
    });
  }, [transactions, search, filterType, filterAccount]);

  const totalIncome = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="max-w-5xl space-y-5">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="pl-9 pr-4 py-2 rounded-xl text-sm text-slate-300 w-56"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            {(["all", "income", "expense", "transfer"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  background: filterType === t ? "rgba(99,102,241,0.2)" : "transparent",
                  color: filterType === t ? "#a78bfa" : "#64748b",
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Account Filter */}
          <select
            value={filterAccount}
            onChange={(e) => setFilterAccount(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs text-slate-400"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <option value="all">All Accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Entries", value: `${filtered.length}`, color: "#6366f1" },
          { label: "Total Income", value: formatFullCurrency(totalIncome), color: "#10b981" },
          { label: "Total Expense", value: formatFullCurrency(totalExpense), color: "#ef4444" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-lg font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Transaction List */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No transactions found
          </div>
        ) : (
          <div>
            {filtered.map((tx, i) => {
              const account = accounts.find((a) => a.id === tx.accountId);
              const toAccount = accounts.find((a) => a.id === tx.toAccountId);
              const { bg, color } = typeColors[tx.type];
              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
                  style={{
                    borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: bg }}>
                    {tx.type === "income" ? (
                      <ArrowDownLeft className="w-4 h-4" style={{ color }} />
                    ) : tx.type === "expense" ? (
                      <ArrowUpRight className="w-4 h-4" style={{ color }} />
                    ) : (
                      <ArrowLeftRight className="w-4 h-4" style={{ color }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {tx.notes || getCategoryLabel(tx.category)}
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: getCategoryColor(tx.category) + "20",
                          color: getCategoryColor(tx.category),
                        }}
                      >
                        {getCategoryLabel(tx.category)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatDate(tx.date)} ·{" "}
                      {tx.type === "transfer"
                        ? `${account?.name} → ${toAccount?.name}`
                        : account?.name}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p
                      className="text-sm font-semibold"
                      style={{ color }}
                    >
                      {tx.type === "income" ? "+" : tx.type === "expense" ? "-" : ""}
                      {formatFullCurrency(tx.amount)}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="text-slate-700 hover:text-red-400 transition-colors ml-2 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAdd && <AddTransactionModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
