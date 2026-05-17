"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const data = [
  { month: "Dec", income: 92000, expense: 58000 },
  { month: "Jan", income: 95000, expense: 62000 },
  { month: "Feb", income: 88000, expense: 55000 },
  { month: "Mar", income: 110000, expense: 72000 },
  { month: "Apr", income: 98000, expense: 65000 },
  { month: "May", income: 122200, expense: 68500 },
];

export default function IncomeExpenseChart() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300">Income vs Expense</h3>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" /> Income
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-500" /> Expense
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={20} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatCurrency}
            width={50}
          />
          <Tooltip
            formatter={(v) => [formatCurrency(Number(v)), ""]}
            contentStyle={{
              background: "#1a1a24",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              fontSize: 12,
            }}
            labelStyle={{ color: "#94a3b8" }}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="#ec4899" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
