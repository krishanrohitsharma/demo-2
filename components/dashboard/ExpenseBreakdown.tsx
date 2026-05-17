"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getCategoryColor, getCategoryLabel, formatFullCurrency } from "@/lib/utils";
import type { Transaction } from "@/types";

interface Props {
  transactions: Transaction[];
}

export default function ExpenseBreakdown({ transactions }: Props) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const totals: Record<string, number> = {};
  expenses.forEach((t) => {
    const cat = t.category as string;
    totals[cat] = (totals[cat] || 0) + t.amount;
  });

  const data = Object.entries(totals)
    .map(([name, value]) => ({ name, value, label: getCategoryLabel(name) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Expense Breakdown</h3>
      <div className="flex items-center gap-6">
        <div style={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={getCategoryColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [formatFullCurrency(Number(v)), ""]}
                contentStyle={{
                  background: "#1a1a24",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#94a3b8" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2.5">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: getCategoryColor(d.name) }}
                />
                <span className="text-xs text-slate-400">{d.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-medium">
                  {formatFullCurrency(d.value)}
                </span>
                <span className="text-xs text-slate-600 w-8 text-right">
                  {((d.value / total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
