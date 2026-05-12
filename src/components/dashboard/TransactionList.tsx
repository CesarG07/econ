"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/components/FinanceProvider";
import { TransactionType } from "@/types/finance";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2, ArrowUp, ArrowDown, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionFormContent } from "./TransactionForm";

export function TransactionList() {
  const { data, removeTransaction, updateTransaction } = useFinance();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Combine properly
  const allTransactions = [
    ...data.income.map((t) => ({ ...t, type: "income" as TransactionType })),
    ...data.expenses.map((t) => ({ ...t, type: "expense" as TransactionType })),
    ...data.pendingPayments.map((t) => ({
      ...t,
      type: "pending" as TransactionType,
    })),
    ...data.initialBalance.map((t) => ({
      ...t,
      type: "initial" as TransactionType,
    })),
  ];

  // Sort by date
  allTransactions.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Historial de Movimientos</CardTitle>
      </CardHeader>
      <CardContent>
        {allTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay movimientos registrados.
          </p>
        ) : (
          <Table>
            <TableCaption>Lista de tus movimientos recientes.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={toggleSort}
                    className="flex items-center gap-1 p-0 hover:bg-transparent font-bold text-muted-foreground"
                  >
                    Fecha
                    {sortOrder === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">
                    {format(parseISO(t.date), "dd MMM yyyy", { locale: es })}
                  </TableCell>
                  <TableCell>{t.description || "-"}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      {t.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <TypeBadge type={t.type} />
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        t.type === "income" || t.type === "initial"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {t.type === "income" || t.type === "initial" ? "+" : "-"}
                      {t.amount.toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Dialog
                        open={editingId === t.id}
                        onOpenChange={(open) => setEditingId(open ? t.id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Editar Movimiento</DialogTitle>
                            <DialogDescription>
                              Realiza cambios en tu registro financiero.
                            </DialogDescription>
                          </DialogHeader>
                          <TransactionFormContent
                            label="Editar"
                            buttonLabel="Guardar Cambios"
                            initialData={t}
                            onSubmit={(updated) => {
                              updateTransaction(t.type, updated);
                              setEditingId(null);
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTransaction(t.type, t.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function TypeBadge({ type }: { type: TransactionType }) {
  switch (type) {
    case "income":
      return (
        <span className="text-green-600 font-bold text-xs uppercase">
          Ingreso
        </span>
      );
    case "expense":
      return (
        <span className="text-red-600 font-bold text-xs uppercase">Gasto</span>
      );
    case "pending":
      return (
        <span className="text-orange-500 font-bold text-xs uppercase">
          Pendiente
        </span>
      );
    case "initial":
      return (
        <span className="text-blue-500 font-bold text-xs uppercase">
          Inicial
        </span>
      );
    default:
      return null;
  }
}
