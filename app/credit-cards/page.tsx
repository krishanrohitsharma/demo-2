"use client";

import { useState } from "react";
import { Plus, CreditCard, AlertTriangle, Calendar, Trash2 } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { formatFullCurrency, formatDate } from "@/lib/utils";
import type { CreditCard as CCType } from "@/types";

const cardColors = [
  "#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#3b82f6",
];

function CreditCardDisplay({ card, onDelete }: { card: CCType; onDelete: () => void }) {
  const utilization = (card.outstandingAmount / card.creditLimit) * 100;
  const isHighUtil = utilization > 60;
  const daysUntilDue = Math.ceil(
    (new Date(card.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Card Visual */}
      <div className="p-5 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}88)` }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15"
          style={{ background: "white", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10"
          style={{ background: "white", transform: "translate(-30%, 30%)" }} />

        <div className="flex items-start justify-between mb-6">
          <CreditCard className="w-6 h-6 text-white opacity-80" />
          <button onClick={onDelete}
            className="text-white/50 hover:text-white/90 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-white/60 text-xs mb-1">{card.bankName}</p>
        <p className="text-white font-semibold text-base mb-4">{card.name}</p>
        <p className="text-white font-mono text-sm tracking-widest">
          •••• •••• •••• {card.lastFourDigits}
        </p>
      </div>

      {/* Card Details */}
      <div className="p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Outstanding</p>
            <p className="text-lg font-bold" style={{ color: isHighUtil ? "#ef4444" : "#f1f5f9" }}>
              {formatFullCurrency(card.outstandingAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Credit Limit</p>
            <p className="text-lg font-bold text-white">
              {formatFullCurrency(card.creditLimit)}
            </p>
          </div>
        </div>

        {/* Utilization Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Credit Utilization</span>
            <span className="text-xs font-medium" style={{ color: isHighUtil ? "#ef4444" : "#10b981" }}>
              {utilization.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(utilization, 100)}%`,
                background: utilization > 80 ? "#ef4444" : utilization > 60 ? "#f59e0b" : "#10b981",
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            Due: {formatDate(card.dueDate)}
          </div>
          {daysUntilDue <= 7 && (
            <div className="flex items-center gap-1 text-amber-400">
              <AlertTriangle className="w-3 h-3" />
              {daysUntilDue}d left
            </div>
          )}
          <span className="text-slate-500">
            Available: {formatFullCurrency(card.creditLimit - card.outstandingAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}

function AddCardModal({ onClose }: { onClose: () => void }) {
  const { addCreditCard } = useFinanceStore();
  const [form, setForm] = useState({
    name: "",
    bankName: "",
    lastFourDigits: "",
    creditLimit: "",
    outstandingAmount: "",
    billingCycleDay: "15",
    dueDate: "",
    color: cardColors[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCreditCard({
      name: form.name,
      bankName: form.bankName,
      lastFourDigits: form.lastFourDigits,
      creditLimit: Number(form.creditLimit),
      outstandingAmount: Number(form.outstandingAmount),
      billingCycleDay: Number(form.billingCycleDay),
      dueDate: form.dueDate,
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
          <h2 className="text-base font-semibold text-white">Add Credit Card</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Card Name", key: "name", placeholder: "HDFC Regalia", type: "text", req: true },
              { label: "Bank Name", key: "bankName", placeholder: "HDFC Bank", type: "text", req: true },
              { label: "Last 4 Digits", key: "lastFourDigits", placeholder: "7823", type: "text", req: true },
              { label: "Credit Limit (₹)", key: "creditLimit", placeholder: "300000", type: "number", req: true },
              { label: "Outstanding (₹)", key: "outstandingAmount", placeholder: "0", type: "number", req: true },
              { label: "Due Date", key: "dueDate", placeholder: "", type: "date", req: true },
            ].map(({ label, key, placeholder, type, req }) => (
              <div key={key}>
                <label className="block text-xs text-slate-500 mb-1.5">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={req}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 rounded-xl text-slate-200 text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-2">Card Color</label>
            <div className="flex gap-2">
              {cardColors.map((c) => (
                <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                  className="w-7 h-7 rounded-lg transition-transform hover:scale-110"
                  style={{ background: c, outline: form.color === c ? `2px solid ${c}` : "none", outlineOffset: 2 }} />
              ))}
            </div>
          </div>
          <button type="submit"
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            Add Card
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CreditCardsPage() {
  const { creditCards, deleteCreditCard } = useFinanceStore();
  const [showAdd, setShowAdd] = useState(false);

  const totalOutstanding = creditCards.reduce((s, c) => s + c.outstandingAmount, 0);
  const totalLimit = creditCards.reduce((s, c) => s + c.creditLimit, 0);

  return (
    <div className="max-w-5xl space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Outstanding", value: formatFullCurrency(totalOutstanding), color: "#ef4444" },
          { label: "Total Credit Limit", value: formatFullCurrency(totalLimit), color: "#6366f1" },
          {
            label: "Available Credit",
            value: formatFullCurrency(totalLimit - totalOutstanding),
            color: "#10b981",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-lg font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
          <Plus className="w-4 h-4" />
          Add Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {creditCards.map((card) => (
          <CreditCardDisplay key={card.id} card={card} onDelete={() => deleteCreditCard(card.id)} />
        ))}
      </div>

      {showAdd && <AddCardModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
