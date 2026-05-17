"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { formatFullCurrency } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  color: string;
  prefix?: string;
}

export default function SummaryCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color,
  prefix = "",
}: SummaryCardProps) {
  const positive = change !== undefined ? change >= 0 : true;

  return (
    <div
      className="rounded-2xl p-5 fade-in"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {change !== undefined && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
            style={{
              background: positive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              color: positive ? "#10b981" : "#ef4444",
            }}
          >
            {positive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-slate-500 text-xs font-medium mb-1.5">{title}</p>
      <p className="text-2xl font-bold text-white">
        {prefix}
        {formatFullCurrency(value)}
      </p>
      {changeLabel && (
        <p className="text-xs text-slate-600 mt-1">{changeLabel}</p>
      )}
    </div>
  );
}
