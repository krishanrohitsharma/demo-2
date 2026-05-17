"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { mockNetWorth } from "@/lib/mockData";

export default function NetWorthChart() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-slate-300">Net Worth Growth</h3>
        <span className="text-xs px-2 py-0.5 rounded-md text-emerald-400"
          style={{ background: "rgba(16,185,129,0.1)" }}>
          +26.6% YTD
        </span>
      </div>
      <p className="text-2xl font-bold text-white mb-4">₹7,85,000</p>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={mockNetWorth}>
          <defs>
            <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            width={52}
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
            cursor={{ stroke: "rgba(99,102,241,0.3)" }}
          />
          <Area
            type="monotone"
            dataKey="netWorth"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#netWorthGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#6366f1" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
