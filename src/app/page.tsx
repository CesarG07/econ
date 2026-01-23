"use client";

import { FinanceProvider } from "@/components/FinanceProvider";
import { Header } from "@/components/dashboard/Header";
import { FinancialSummary } from "@/components/dashboard/FinancialSummary";
import { TransactionForm } from "@/components/dashboard/TransactionForm";
import { TransactionList } from "@/components/dashboard/TransactionList";

export default function Home() {
  return (
    <FinanceProvider>
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4 md:p-8 font-sans transition-colors duration-500">
        <div className="mx-auto max-w-6xl space-y-8">
          <Header />
          <FinancialSummary />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <TransactionForm />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <TransactionList />
            </div>
          </div>
        </div>
      </main>
    </FinanceProvider>
  );
}
