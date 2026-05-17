"use client";

import { useState } from "react";
import { Plus, Wallet, Landmark, Coins, CreditCard, Smartphone, Trash2, Pencil } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { formatFullCurrency, getAccountTypeLabel, generateId } from "@/lib/utils";
import type { Account, AccountType } from "@/types";

const accountIcons: Record<AccountType, React.ElementType> = {
  savings: Landmark,
  current: Landmark,
  cash: Coins,
  debit: CreditCard,
  credit: CreditCard,
  upi: Smartphone,
};

const accountColors = [
  "#6366f1", "#8b5cf6", "#a78bfa", "#10b981", "#f59e0b", "#ec4899", "#3b82f6", "#06b6d4",
];

function AccountCard({ account, onDelete }: { account: Account; onDelete: () => void }) {
  const Icon = accountIcons[account.type];
  return (
    <div className="rounded-2xl p-5 relative overflow-hidden group"
      style={{ background: `${account.color}10`, border: `1px solid ${account.color}25` }}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
        style={{ background: account.color, transform: "translate(30%, -30%)" }} />

      <div className="flex items-start justify-between mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${account.color}20` }}>
          <Icon className="w-5 h-5" style={{ color: account.color }} />
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-1">{getAccountTypeLabel(account.type)}</p>
      <p className="text-lg font-bold text-white mb-0.5">{account.name}</p>
      {account.bankName && (
        <p className="text-xs text-slate-500 mb-3">
          {account.bankName}
          {account.lastFourDigits && ` •••• ${account.lastFourDigits}`}
        </p>
      )}

      <div className="pt-3" style={{ borderTop: `1px solid ${account.color}20` }}>
        <p className="text-xs text-slate-500 mb-0.5">Balance</p>
        <p className="text-xl font-bold" style={{ color: account.color }}>
          {formatFullCurrency(account.balance)}
        </p>
      </div>
    </div>
  );
}

function AddAccountModal({ onClose }: { onClose: () => void }) {
  const { addAccount } = useFinanceStore();
  const [form, setForm] = useState({
    name: "",
    type: "savings" as AccountType,
    balance: "",
    bankName: "",
    lastFourDigits: "",
    color: accountColors[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount({
      name: form.name,
      type: form.type,
      balance: Number(form.balance),
      bankName: form.bankName || undefined,
      lastFourDigits: form.lastFourDigits || undefined,
      color: form.color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl p-6"
        style={{ background: "#12121a", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Add Account</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Account Name", key: "name", placeholder: "HDFC Savings", type: "text", required: true },
            { label: "Bank Name", key: "bankName", placeholder: "HDFC Bank", type: "text" },
            { label: "Last 4 Digits", key: "lastFourDigits", placeholder: "4521", type: "text" },
            { label: "Opening Balance (₹)", key: "balance", placeholder: "0", type: "number", required: true },
          ].map(({ label, key, placeholder, type, required }) => (
            <div key={key}>
              <label className="block text-xs text-slate-500 mb-1.5">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required={required}
                placeholder={placeholder}
                className="w-full px-3.5 py-2.5 rounded-xl text-slate-200 text-sm"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Account Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AccountType })}
              className="w-full px-3.5 py-2.5 rounded-xl text-slate-200 text-sm"
              style={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.08)" }}>
              {(["savings","current","cash","debit","credit","upi"] as AccountType[]).map((t) => (
                <option key={t} value={t}>{getAccountTypeLabel(t)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {accountColors.map((c) => (
                <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                  className="w-7 h-7 rounded-lg transition-transform hover:scale-110"
                  style={{
                    background: c,
                    outline: form.color === c ? `2px solid ${c}` : "none",
                    outlineOffset: 2,
                  }} />
              ))}
            </div>
          </div>
          <button type="submit"
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            Add Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AccountsPage() {
  const { accounts, deleteAccount } = useFinanceStore();
  const [showAdd, setShowAdd] = useState(false);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="rounded-xl px-4 py-2.5 text-sm"
          style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <span className="text-slate-400">Total Balance: </span>
          <span className="text-indigo-300 font-semibold">{formatFullCurrency(totalBalance)}</span>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
          <Plus className="w-4 h-4" />
          Add Account
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} onDelete={() => deleteAccount(account.id)} />
        ))}
        <button onClick={() => setShowAdd(true)}
          className="rounded-2xl p-5 flex flex-col items-center justify-center gap-3 min-h-[200px] transition-colors hover:bg-white/[0.03]"
          style={{ border: "2px dashed rgba(255,255,255,0.08)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(99,102,241,0.1)" }}>
            <Plus className="w-6 h-6 text-indigo-400" />
          </div>
          <p className="text-sm text-slate-500">Add New Account</p>
        </button>
      </div>

      {showAdd && <AddAccountModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
