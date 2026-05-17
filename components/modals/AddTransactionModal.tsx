"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import type { TransactionType, IncomeCategory, ExpenseCategory } from "@/types";

const incomeCategories: IncomeCategory[] = [
  "salary", "freelance", "business", "interest", "rental", "other",
];
const expenseCategories: ExpenseCategory[] = [
  "food", "travel", "shopping", "emi", "bills", "fuel", "entertainment", "investment", "health", "other",
];

const categoryLabels: Record<string, string> = {
  salary: "Salary", freelance: "Freelance", business: "Business",
  interest: "Interest", rental: "Rental",
  food: "Food", travel: "Travel", shopping: "Shopping", emi: "EMI",
  bills: "Bills", fuel: "Fuel", entertainment: "Entertainment",
  investment: "Investment", health: "Health", other: "Other",
};

interface Props {
  onClose: () => void;
}

export default function AddTransactionModal({ onClose }: Props) {
  const { accounts, addTransaction } = useFinanceStore();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("food");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const categories = type === "income" ? incomeCategories : expenseCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    addTransaction({
      type,
      amount: Number(amount),
      category: category as IncomeCategory | ExpenseCategory | "transfer",
      accountId,
      toAccountId: type === "transfer" ? toAccountId : undefined,
      date,
      notes,
    });
    onClose();
  };

  const tabStyle = (active: boolean) => ({
    flex: 1,
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
    background: active ? (
      type === "income" ? "rgba(16,185,129,0.15)" :
      type === "expense" ? "rgba(239,68,68,0.15)" :
      "rgba(99,102,241,0.15)"
    ) : "transparent",
    color: active ? (
      type === "income" ? "#10b981" :
      type === "expense" ? "#ef4444" :
      "#a78bfa"
    ) : "#64748b",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl p-6"
        style={{ background: "#12121a", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Add Transaction</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-5"
          style={{ background: "rgba(255,255,255,0.04)" }}>
          {(["expense", "income", "transfer"] as TransactionType[]).map((t) => (
            <button key={t} onClick={() => { setType(t); setCategory(t === "income" ? "salary" : t === "expense" ? "food" : "transfer"); }}
              style={tabStyle(type === t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              placeholder="0.00"
              className="w-full px-3.5 py-2.5 rounded-xl text-slate-200 text-sm"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>

          {type !== "transfer" && (
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-slate-200 text-sm"
                style={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{categoryLabels[c]}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-500 mb-1.5">
              {type === "transfer" ? "From Account" : "Account"}
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-slate-200 text-sm"
              style={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {type === "transfer" && (
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">To Account</label>
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-slate-200 text-sm"
                style={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {accounts.filter((a) => a.id !== accountId).map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-slate-200 text-sm"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional"
                className="w-full px-3.5 py-2.5 rounded-xl text-slate-200 text-sm"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
