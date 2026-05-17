"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from "lucide-react";
import { formatFullCurrency, formatShortDate, getCategoryLabel } from "@/lib/utils";
import type { Transaction } from "@/types";

interface Props {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: Props) {
  const recent = transactions.slice(0, 6);

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300">Recent Transactions</h3>
        <Link href="/transactions" className="text-xs text-indigo-400 hover:text-indigo-300">
          View all →
        </Link>
      </div>
      <div className="space-y-3">
        {recent.map((tx) => (
          <div key={tx.id} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  tx.type === "income"
                    ? "rgba(16,185,129,0.12)"
                    : tx.type === "expense"
                    ? "rgba(239,68,68,0.12)"
                    : "rgba(99,102,241,0.12)",
              }}
            >
              {tx.type === "income" ? (
                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
              ) : tx.type === "expense" ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">
                {tx.notes || getCategoryLabel(tx.category)}
              </p>
              <p className="text-xs text-slate-600">{formatShortDate(tx.date)}</p>
            </div>
            <span
              className="text-sm font-semibold flex-shrink-0"
              style={{
                color:
                  tx.type === "income"
                    ? "#10b981"
                    : tx.type === "expense"
                    ? "#f87171"
                    : "#a78bfa",
              }}
            >
              {tx.type === "income" ? "+" : tx.type === "expense" ? "-" : ""}
              {formatFullCurrency(tx.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
