"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  FinanceData,
  initialFinanceData,
  Transaction,
  TransactionType,
} from "@/types/finance";

interface FinanceContextType {
  data: FinanceData;
  addTransaction: (type: TransactionType, transaction: Transaction) => void;
  removeTransaction: (type: TransactionType, id: string) => void;
  updateTransaction: (type: TransactionType, transaction: Transaction) => void;
  importData: (jsonData: string) => void;
  exportData: () => void;
  resetData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<FinanceData>(initialFinanceData);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("finance_data");
    setTimeout(() => {
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load local data", e);
        }
      }
      setIsInitialized(true);
    }, 0);
  }, []);

  // Save on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("finance_data", JSON.stringify(data));
    }
  }, [data, isInitialized]);

  const addTransaction = (type: TransactionType, transaction: Transaction) => {
    setData((prev) => {
      const targetKey = mapTypeToKey(type);
      return {
        ...prev,
        [targetKey]: [...prev[targetKey], transaction],
      };
    });
  };

  const updateTransaction = (
    type: TransactionType,
    transaction: Transaction,
  ) => {
    setData((prev) => {
      const targetKey = mapTypeToKey(type);
      return {
        ...prev,
        [targetKey]: prev[targetKey].map((t: Transaction) =>
          t.id === transaction.id ? transaction : t,
        ),
      };
    });
  };

  const removeTransaction = (type: TransactionType, id: string) => {
    setData((prev) => {
      const targetKey = mapTypeToKey(type);
      return {
        ...prev,
        [targetKey]: prev[targetKey].filter((t: Transaction) => t.id !== id),
      };
    });
  };

  const resetData = () => {
    if (confirm("Are you sure you want to clear all data?")) {
      setData(initialFinanceData);
    }
  };

  const importData = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      // Basic validation could be improved
      if (Array.isArray(parsed.income) && Array.isArray(parsed.expenses)) {
        setData(parsed);
      } else {
        alert("Invalid JSON structure. Missing income/expenses arrays.");
      }
    } catch {
      alert("Failed to parse JSON file.");
    }
  };

  const exportData = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resumen_financiero_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <FinanceContext.Provider
      value={{
        data,
        addTransaction,
        updateTransaction,
        removeTransaction,
        importData,
        exportData,
        resetData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context)
    throw new Error("useFinance must be used within FinanceProvider");
  return context;
};

function mapTypeToKey(type: TransactionType): keyof FinanceData {
  switch (type) {
    case "income":
      return "income";
    case "expense":
      return "expenses";
    case "pending":
      return "pendingPayments";
    case "initial":
      return "initialBalance";
  }
}
