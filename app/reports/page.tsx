"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useFinanceStore } from "@/store/useFinanceStore";
import { formatCurrency, formatFullCurrency, getCategoryColor, getCategoryLabel } from "@/lib/utils";
import { mockNetWorth } from "@/lib/mockData";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";

const monthlyData = [
  { month: "Dec", income: 92000, expense: 58000, savings: 34000 },
  { month: "Jan", income: 95000, expense: 62000, savings: 33000 },
  { month: "Feb", income: 88000, expense: 55000, savings: 33000 },
  { month: "Mar", income: 110000, expense: 72000, savings: 38000 },
  { month: "Apr", income: 98000, expense: 65000, savings: 33000 },
  { month: "May", income: 122200, expense: 68500, savings: 53700 },
];

export default function ReportsPage() {
  const { transactions } = useFinanceStore();

  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      const cat = t.category as string;
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {});

  const categoryData = Object.entries(expenseByCategory)
    .map(([name, value]) => ({ name, value, label: getCategoryLabel(name) }))
    .sort((a, b) => b.value - a.value);

  const totalExpense = categoryData.reduce((s, d) => s + d.value, 0);
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : "0";

  const stats = [
    { label: "Total Income (Month)", value: formatFullCurrency(totalIncome), icon: TrendingUp, color: "#10b981" },
    { label: "Total Expense (Month)", value: formatFullCurrency(totalExpense), icon: TrendingDown, color: "#ef4444" },
    { label: "Savings Rate", value: `${savingsRate}%`, icon: Target, color: "#6366f1" },
    { label: "Avg Daily Spend", value: formatFullCurrency(Math.round(totalExpense / 17)), icon: DollarSign, color: "#f59e0b" },
  ];

  return (
    <div className="max-w-6xl space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500">{label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${color}15` }}>
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Cash Flow Chart */}
      <div className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Monthly Cash Flow</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} barSize={22} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} width={52} />
            <Tooltip formatter={(v) => [formatCurrency(Number(v)), ""]}
              contentStyle={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: "#94a3b8" }}
              cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expense" fill="#ec4899" radius={[4, 4, 0, 0]} name="Expense" />
            <Bar dataKey="savings" fill="#10b981" radius={[4, 4, 0, 0]} name="Savings" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category Breakdown */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Spending by Category</h3>
          <div className="space-y-3">
            {categoryData.map((d) => (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400">{d.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-300">{formatFullCurrency(d.value)}</span>
                    <span className="text-xs text-slate-600 w-8 text-right">
                      {((d.value / totalExpense) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(d.value / totalExpense) * 100}%`,
                      background: getCategoryColor(d.name),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings Trend */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Savings Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} width={50} />
              <Tooltip formatter={(v) => [formatCurrency(Number(v)), ""]}
                contentStyle={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: "#94a3b8" }} />
              <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} fill="url(#savingsGrad)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Net Worth */}
      <div className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-300">Net Worth Growth</h3>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Assets</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-500" /> Liabilities</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Net Worth</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={mockNetWorth}>
            <defs>
              <linearGradient id="assetsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} width={55} />
            <Tooltip formatter={(v) => [formatCurrency(Number(v)), ""]}
              contentStyle={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: "#94a3b8" }} />
            <Area type="monotone" dataKey="assets" stroke="#6366f1" strokeWidth={1.5} fill="url(#assetsGrad)" dot={false} />
            <Area type="monotone" dataKey="liabilities" stroke="#ec4899" strokeWidth={1.5} fill="none" dot={false} />
            <Area type="monotone" dataKey="netWorth" stroke="#10b981" strokeWidth={2} fill="url(#nwGrad)" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
