"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFinanceStore } from "@/store/useFinanceStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useFinanceStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/login") {
      router.replace("/login");
    }
    if (isAuthenticated && pathname === "/login") {
      router.replace("/");
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated && pathname !== "/login") return null;

  return <>{children}</>;
}
