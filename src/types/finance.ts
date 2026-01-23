export type TransactionType = "income" | "expense" | "pending" | "initial";

export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO 8601 Date String
  label: string;
  description: string;
}

export interface FinanceData {
  income: Transaction[];
  expenses: Transaction[];
  pendingPayments: Transaction[];
  initialBalance: Transaction[];
}

export const initialFinanceData: FinanceData = {
  income: [],
  expenses: [],
  pendingPayments: [],
  initialBalance: [],
};
