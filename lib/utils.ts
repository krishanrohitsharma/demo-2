import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatFullCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function getProfitLossColor(value: number): string {
  return value >= 0 ? "text-emerald-400" : "text-red-400";
}

export function getProfitLossBg(value: number): string {
  return value >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400";
}

export function getAccountTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    savings: "Savings Account",
    current: "Current Account",
    cash: "Cash Wallet",
    debit: "Debit Card",
    credit: "Credit Card",
    upi: "UPI Wallet",
  };
  return labels[type] || type;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    salary: "Salary",
    freelance: "Freelance",
    business: "Business",
    interest: "Interest",
    rental: "Rental",
    food: "Food & Dining",
    travel: "Travel",
    shopping: "Shopping",
    emi: "EMI",
    bills: "Bills & Utilities",
    fuel: "Fuel",
    entertainment: "Entertainment",
    investment: "Investment",
    health: "Health",
    transfer: "Transfer",
    other: "Other",
  };
  return labels[category] || category;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    salary: "#6366f1",
    freelance: "#8b5cf6",
    business: "#a78bfa",
    interest: "#10b981",
    rental: "#059669",
    food: "#f59e0b",
    travel: "#3b82f6",
    shopping: "#ec4899",
    emi: "#ef4444",
    bills: "#f97316",
    fuel: "#84cc16",
    entertainment: "#06b6d4",
    investment: "#6366f1",
    health: "#14b8a6",
    transfer: "#94a3b8",
    other: "#64748b",
  };
  return colors[category] || "#64748b";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
