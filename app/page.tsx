"use client";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  ArrowLeftRight,
  BarChart3,
  Landmark,
} from "lucide-react";
import SummaryCard from "@/components/dashboard/SummaryCard";
import ExpenseBreakdown from "@/components/dashboard/ExpenseBreakdown";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import NetWorthChart from "@/components/dashboard/NetWorthChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import AddTransactionModal from "@/components/modals/AddTransactionModal";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { transactions, accounts, stocks, mutualFunds } = useFinanceStore();
  const [showAdd, setShowAdd] = useState(false);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  const monthlyIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const monthlyExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const netSavings = monthlyIncome - monthlyExpense;

  const stockValue = stocks.reduce((s, st) => s + st.quantity * st.currentPrice, 0);
  const stockInvested = stocks.reduce((s, st) => s + st.quantity * st.avgBuyPrice, 0);
  const stockGain = stockValue - stockInvested;

  const mfValue = mutualFunds.reduce((s, m) => s + m.currentValue, 0);
  const mfInvested = mutualFunds.reduce((s, m) => s + m.investedAmount, 0);
  const mfGain = mfValue - mfInvested;

  const quickActions = [
    { label: "Add Expense", icon: Plus, color: "#ef4444", href: "#", action: () => setShowAdd(true) },
    { label: "Transactions", icon: ArrowLeftRight, color: "#6366f1", href: "/transactions" },
    { label: "Investments", icon: TrendingUp, color: "#10b981", href: "/investments" },
    { label: "Reports", icon: BarChart3, color: "#f59e0b", href: "/reports" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Quick Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        {quickActions.map(({ label, icon: Icon, color, href, action }) =>
          action ? (
            <button
              key={label}
              onClick={action}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ) : (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#94a3b8",
              }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
              {label}
            </Link>
          )
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Balance"
          value={totalBalance}
          change={8.4}
          changeLabel="vs last month"
          icon={Wallet}
          color="#6366f1"
        />
        <SummaryCard
          title="Monthly Income"
          value={monthlyIncome}
          change={12.1}
          changeLabel="vs last month"
          icon={TrendingUp}
          color="#10b981"
        />
        <SummaryCard
          title="Monthly Expense"
          value={monthlyExpense}
          change={-3.2}
          changeLabel="vs last month"
          icon={TrendingDown}
          color="#ef4444"
        />
        <SummaryCard
          title="Net Savings"
          value={netSavings}
          change={18.5}
          changeLabel="vs last month"
          icon={PiggyBank}
          color="#f59e0b"
        />
      </div>

      {/* Investment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-medium">Stock Portfolio</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-white mb-1">
            ₹{(stockValue / 1000).toFixed(1)}K
          </p>
          <p className="text-xs" style={{ color: stockGain >= 0 ? "#10b981" : "#ef4444" }}>
            {stockGain >= 0 ? "+" : ""}₹{(stockGain / 1000).toFixed(1)}K ({((stockGain / stockInvested) * 100).toFixed(1)}%)
          </p>
        </div>

        <div className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-medium">Mutual Funds</span>
            <Landmark className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl font-bold text-white mb-1">
            ₹{(mfValue / 1000).toFixed(1)}K
          </p>
          <p className="text-xs" style={{ color: mfGain >= 0 ? "#10b981" : "#ef4444" }}>
            {mfGain >= 0 ? "+" : ""}₹{(mfGain / 1000).toFixed(1)}K ({((mfGain / mfInvested) * 100).toFixed(1)}%)
          </p>
        </div>

        <div className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-medium">Total Investment Value</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-white mb-1">
            ₹{((stockValue + mfValue) / 1000).toFixed(1)}K
          </p>
          <p className="text-xs text-emerald-400">
            +₹{((stockGain + mfGain) / 1000).toFixed(1)}K overall
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IncomeExpenseChart />
        <ExpenseBreakdown transactions={transactions} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NetWorthChart />
        <RecentTransactions transactions={transactions} />
      </div>

      {showAdd && <AddTransactionModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
