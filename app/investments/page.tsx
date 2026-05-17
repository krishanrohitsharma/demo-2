"use client";

import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, Trash2, PieChart } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { formatFullCurrency, getProfitLossColor } from "@/lib/utils";
import type { StockHolding, MutualFund } from "@/types";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const sectorColors: Record<string, string> = {
  IT: "#6366f1",
  Banking: "#10b981",
  Energy: "#f59e0b",
  "Large Cap": "#8b5cf6",
  "Flexi Cap": "#3b82f6",
  "Small Cap": "#ec4899",
  FMCG: "#06b6d4",
  Pharma: "#14b8a6",
};

function StockRow({ stock, onDelete }: { stock: StockHolding; onDelete: () => void }) {
  const current = stock.quantity * stock.currentPrice;
  const invested = stock.quantity * stock.avgBuyPrice;
  const pnl = current - invested;
  const pnlPct = ((pnl / invested) * 100).toFixed(2);
  const positive = pnl >= 0;

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
        style={{ background: "rgba(99,102,241,0.1)", color: "#a78bfa" }}>
        {stock.ticker.substring(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200">{stock.name}</p>
        <p className="text-xs text-slate-500">{stock.ticker} · {stock.quantity} shares · {stock.sector}</p>
      </div>
      <div className="text-right hidden md:block">
        <p className="text-xs text-slate-500">Avg Buy</p>
        <p className="text-sm text-slate-300">₹{stock.avgBuyPrice.toLocaleString()}</p>
      </div>
      <div className="text-right hidden md:block">
        <p className="text-xs text-slate-500">Current</p>
        <p className="text-sm text-slate-300">₹{stock.currentPrice.toLocaleString()}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-white">{formatFullCurrency(current)}</p>
        <p className={`text-xs font-medium ${getProfitLossColor(pnl)}`}>
          {positive ? "+" : ""}{formatFullCurrency(pnl)} ({positive ? "+" : ""}{pnlPct}%)
        </p>
      </div>
      <button onClick={onDelete} className="text-slate-700 hover:text-red-400 transition-colors ml-1">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function MFRow({ mf, onDelete }: { mf: MutualFund; onDelete: () => void }) {
  const pnl = mf.currentValue - mf.investedAmount;
  const pnlPct = ((pnl / mf.investedAmount) * 100).toFixed(2);
  const positive = pnl >= 0;

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(139,92,246,0.1)" }}>
        <TrendingUp className="w-4 h-4 text-purple-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate">{mf.name}</p>
        <p className="text-xs text-slate-500">
          {mf.type === "sip" ? "SIP" : "Lumpsum"} · {mf.category} · {mf.units.toFixed(2)} units
        </p>
      </div>
      <div className="text-right hidden md:block">
        <p className="text-xs text-slate-500">NAV</p>
        <p className="text-sm text-slate-300">₹{mf.nav.toFixed(2)}</p>
      </div>
      <div className="text-right hidden md:block">
        <p className="text-xs text-slate-500">Invested</p>
        <p className="text-sm text-slate-300">{formatFullCurrency(mf.investedAmount)}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-white">{formatFullCurrency(mf.currentValue)}</p>
        <p className={`text-xs font-medium ${getProfitLossColor(pnl)}`}>
          {positive ? "+" : ""}{formatFullCurrency(pnl)} ({positive ? "+" : ""}{pnlPct}%)
        </p>
      </div>
      <button onClick={onDelete} className="text-slate-700 hover:text-red-400 transition-colors ml-1">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function AddStockModal({ onClose }: { onClose: () => void }) {
  const { addStock } = useFinanceStore();
  const [form, setForm] = useState({ name: "", ticker: "", quantity: "", avgBuyPrice: "", currentPrice: "", sector: "IT" });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStock({ ...form, quantity: Number(form.quantity), avgBuyPrice: Number(form.avgBuyPrice), currentPrice: Number(form.currentPrice) });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "#12121a", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Add Stock</h2>
          <button onClick={onClose} className="text-slate-500">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Company Name", key: "name", placeholder: "Reliance Industries" },
              { label: "Ticker", key: "ticker", placeholder: "RELIANCE" },
              { label: "Quantity", key: "quantity", placeholder: "50", type: "number" },
              { label: "Avg Buy Price (₹)", key: "avgBuyPrice", placeholder: "2450", type: "number" },
              { label: "Current Price (₹)", key: "currentPrice", placeholder: "2890", type: "number" },
              { label: "Sector", key: "sector", placeholder: "IT" },
            ].map(({ label, key, placeholder, type = "text" }) => (
              <div key={key}>
                <label className="block text-xs text-slate-500 mb-1">{label}</label>
                <input type={type} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required placeholder={placeholder}
                  className="w-full px-3 py-2.5 rounded-xl text-slate-200 text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
            ))}
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>Add Stock</button>
        </form>
      </div>
    </div>
  );
}

function AddMFModal({ onClose }: { onClose: () => void }) {
  const { addMutualFund } = useFinanceStore();
  const [form, setForm] = useState({ name: "", type: "sip" as "sip" | "lumpsum", units: "", nav: "", investedAmount: "", currentValue: "", category: "Large Cap" });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutualFund({ ...form, units: Number(form.units), nav: Number(form.nav), investedAmount: Number(form.investedAmount), currentValue: Number(form.currentValue) });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "#12121a", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Add Mutual Fund</h2>
          <button onClick={onClose} className="text-slate-500">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Fund Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Mirae Asset Large Cap Fund"
              className="w-full px-3 py-2.5 rounded-xl text-slate-200 text-sm"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "sip" | "lumpsum" })}
                className="w-full px-3 py-2.5 rounded-xl text-slate-200 text-sm"
                style={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.08)" }}>
                <option value="sip">SIP</option>
                <option value="lumpsum">Lumpsum</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Large Cap"
                className="w-full px-3 py-2.5 rounded-xl text-slate-200 text-sm"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
            {[
              { label: "Units", key: "units", placeholder: "284.5" },
              { label: "NAV (₹)", key: "nav", placeholder: "98.42" },
              { label: "Invested (₹)", key: "investedAmount", placeholder: "24000" },
              { label: "Current Value (₹)", key: "currentValue", placeholder: "27999" },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-xs text-slate-500 mb-1">{label}</label>
                <input type="number" value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required placeholder={placeholder}
                  className="w-full px-3 py-2.5 rounded-xl text-slate-200 text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
            ))}
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>Add Fund</button>
        </form>
      </div>
    </div>
  );
}

export default function InvestmentsPage() {
  const { stocks, mutualFunds, deleteStock, deleteMutualFund } = useFinanceStore();
  const [tab, setTab] = useState<"stocks" | "mf">("stocks");
  const [showAddStock, setShowAddStock] = useState(false);
  const [showAddMF, setShowAddMF] = useState(false);

  const stockValue = stocks.reduce((s, st) => s + st.quantity * st.currentPrice, 0);
  const stockInvested = stocks.reduce((s, st) => s + st.quantity * st.avgBuyPrice, 0);
  const mfValue = mutualFunds.reduce((s, m) => s + m.currentValue, 0);
  const mfInvested = mutualFunds.reduce((s, m) => s + m.investedAmount, 0);
  const totalValue = stockValue + mfValue;
  const totalInvested = stockInvested + mfInvested;
  const totalPnl = totalValue - totalInvested;

  // Sector allocation data for pie chart
  const sectorData = stocks.reduce<Record<string, number>>((acc, s) => {
    acc[s.sector] = (acc[s.sector] || 0) + s.quantity * s.currentPrice;
    return acc;
  }, {});
  const sectorChartData = Object.entries(sectorData).map(([name, value]) => ({ name, value }));

  return (
    <div className="max-w-5xl space-y-5">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Value", value: formatFullCurrency(totalValue), color: "#6366f1" },
          { label: "Total Invested", value: formatFullCurrency(totalInvested), color: "#94a3b8" },
          { label: "Total P&L", value: `${totalPnl >= 0 ? "+" : ""}${formatFullCurrency(totalPnl)}`, color: totalPnl >= 0 ? "#10b981" : "#ef4444" },
          { label: "Overall Return", value: `${((totalPnl / totalInvested) * 100).toFixed(2)}%`, color: totalPnl >= 0 ? "#10b981" : "#ef4444" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-lg font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Sector Allocation */}
      {sectorChartData.length > 0 && (
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Sector Allocation</h3>
          <div className="flex items-center gap-6">
            <div style={{ width: 160, height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie data={sectorChartData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                    {sectorChartData.map((entry) => (
                      <Cell key={entry.name} fill={sectorColors[entry.name] || "#6366f1"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [formatFullCurrency(Number(v)), ""]}
                    contentStyle={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12 }} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {sectorChartData.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: sectorColors[d.name] || "#6366f1" }} />
                    <span className="text-xs text-slate-400">{d.name}</span>
                  </div>
                  <span className="text-xs text-slate-300 font-medium">{formatFullCurrency(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
          {(["stocks", "mf"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: tab === t ? "rgba(99,102,241,0.2)" : "transparent",
                color: tab === t ? "#a78bfa" : "#64748b",
              }}>
              {t === "stocks" ? `Stocks (${stocks.length})` : `Mutual Funds (${mutualFunds.length})`}
            </button>
          ))}
        </div>
        <button
          onClick={() => tab === "stocks" ? setShowAddStock(true) : setShowAddMF(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
          <Plus className="w-4 h-4" />
          Add {tab === "stocks" ? "Stock" : "Fund"}
        </button>
      </div>

      {/* List */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {tab === "stocks" ? (
          stocks.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">No stocks added yet</div>
          ) : (
            stocks.map((s) => <StockRow key={s.id} stock={s} onDelete={() => deleteStock(s.id)} />)
          )
        ) : (
          mutualFunds.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">No mutual funds added yet</div>
          ) : (
            mutualFunds.map((mf) => <MFRow key={mf.id} mf={mf} onDelete={() => deleteMutualFund(mf.id)} />)
          )
        )}
      </div>

      {showAddStock && <AddStockModal onClose={() => setShowAddStock(false)} />}
      {showAddMF && <AddMFModal onClose={() => setShowAddMF(false)} />}
    </div>
  );
}
