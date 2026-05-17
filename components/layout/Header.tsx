"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Your financial overview" },
  "/transactions": { title: "Transactions", subtitle: "All your money movements" },
  "/accounts": { title: "Accounts", subtitle: "Manage your bank accounts & wallets" },
  "/credit-cards": { title: "Credit Cards", subtitle: "Track your credit card usage" },
  "/investments": { title: "Investments", subtitle: "Stocks & mutual funds portfolio" },
  "/reports": { title: "Reports & Analytics", subtitle: "Insights into your finances" },
  "/settings": { title: "Settings", subtitle: "Manage your preferences" },
};

export default function Header() {
  const pathname = usePathname();
  const { userName } = useFinanceStore();

  if (pathname === "/login" || pathname === "/login/") return null;

  const page = pageTitles[pathname] || { title: "WealthFlow", subtitle: "" };

  return (
    <header className="flex items-center justify-between px-6 py-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div>
        <h1 className="text-xl font-semibold text-slate-100">{page.title}</h1>
        <p className="text-sm text-slate-500 mt-0.5">{page.subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          <Search className="w-4 h-4 text-slate-400" />
        </button>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors relative"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          <Bell className="w-4 h-4 text-slate-400" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-500" />
        </button>
        <div className="text-sm text-slate-400 hidden md:block">
          Hello, <span className="text-slate-200 font-medium">{userName || "User"}</span>
        </div>
      </div>
    </header>
  );
}
