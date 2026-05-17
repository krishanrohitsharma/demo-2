"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  CreditCard,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { href: "/accounts", icon: Wallet, label: "Accounts" },
  { href: "/credit-cards", icon: CreditCard, label: "Credit Cards" },
  { href: "/investments", icon: TrendingUp, label: "Investments" },
  { href: "/reports", icon: BarChart3, label: "Reports" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { userName, userEmail, logout } = useFinanceStore();

  if (pathname === "/login") return null;

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col z-40"
      style={{ background: "#0d0d14", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}>
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">WealthFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                color: active ? "#fff" : "#64748b",
                background: active
                  ? "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))"
                  : "transparent",
                border: active ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
              }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}>
            {userName ? userName[0].toUpperCase() : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{userName || "User"}</p>
            <p className="text-xs text-slate-500 truncate">{userEmail || "user@example.com"}</p>
          </div>
          <button
            onClick={logout}
            className="text-slate-500 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
