import { FinanceData, Transaction } from "@/types/finance";
import { isBefore, isSameDay, parseISO } from "date-fns";

export function calculateBalance(data: FinanceData, targetDate: Date) {
  // Normalize targetDate to start of day to avoid time issues if needed,
  // but usually we want comprehensive up to end of that day.
  // Let's assume targetDate is set to some time, we want to include transactions ON that date.

  const isEligible = (t: Transaction) => {
    const tDate = parseISO(t.date);
    // standard comparison
    return isBefore(tDate, targetDate) || isSameDay(tDate, targetDate);
  };

  const initialSum = data.initialBalance
    .filter(isEligible)
    .reduce((acc, t) => acc + t.amount, 0);
  const incomeSum = data.income
    .filter(isEligible)
    .reduce((acc, t) => acc + t.amount, 0);
  const expenseSum = data.expenses
    .filter(isEligible)
    .reduce((acc, t) => acc + t.amount, 0);
  const pendingSum = data.pendingPayments
    .filter(isEligible)
    .reduce((acc, t) => acc + t.amount, 0);

  return {
    total: initialSum + incomeSum - expenseSum - pendingSum,
    breakdown: {
      initial: initialSum,
      income: incomeSum,
      expenses: expenseSum,
      pending: pendingSum,
    },
  };
}
