"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import Sidebar from "./Sidebar";
import Header from "./Header";

function isLogin(pathname: string) {
  return pathname === "/login" || pathname === "/login/";
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useFinanceStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated && !isLogin(pathname)) {
      router.replace("/login");
    }
    if (isAuthenticated && isLogin(pathname)) {
      router.replace("/");
    }
  }, [isAuthenticated, pathname, router, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <p className="text-slate-500 text-sm">Loading WealthFlow…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isLogin(pathname)) return null;

  if (isLogin(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: 240 }}>
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
