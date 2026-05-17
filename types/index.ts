export type AccountType =
  | "savings"
  | "current"
  | "cash"
  | "debit"
  | "credit"
  | "upi";

export type TransactionType = "income" | "expense" | "transfer";

export type IncomeCategory =
  | "salary"
  | "freelance"
  | "business"
  | "interest"
  | "rental"
  | "other";

export type ExpenseCategory =
  | "food"
  | "travel"
  | "shopping"
  | "emi"
  | "bills"
  | "fuel"
  | "entertainment"
  | "investment"
  | "health"
  | "other";

export type TransactionCategory = IncomeCategory | ExpenseCategory | "transfer";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  bankName?: string;
  lastFourDigits?: string;
  color: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  accountId: string;
  toAccountId?: string;
  date: string;
  notes?: string;
  isRecurring?: boolean;
}

export interface CreditCard {
  id: string;
  name: string;
  bankName: string;
  lastFourDigits: string;
  creditLimit: number;
  outstandingAmount: number;
  billingCycleDay: number;
  dueDate: string;
  color: string;
}

export interface StockHolding {
  id: string;
  name: string;
  ticker: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  sector: string;
}

export interface MutualFund {
  id: string;
  name: string;
  type: "sip" | "lumpsum";
  units: number;
  nav: number;
  investedAmount: number;
  currentValue: number;
  category: string;
}

export interface NetWorthEntry {
  month: string;
  netWorth: number;
  assets: number;
  liabilities: number;
}
