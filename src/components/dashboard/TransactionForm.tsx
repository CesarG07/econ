"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Plus } from "lucide-react";
import { TransactionType, Transaction } from "@/types/finance";
import { useFinance } from "@/components/FinanceProvider";

export function TransactionForm() {
  const { addTransaction } = useFinance();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nueva Transacción</CardTitle>
        <CardDescription>Registra un nuevo movimiento.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="expense" className="w-full">
          <TabsList className="flex flex-wrap h-auto w-full gap-1 bg-muted p-1">
            <TabsTrigger
              value="expense"
              className="flex-1 text-xs sm:text-sm py-1.5 px-2"
            >
              Gasto
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="flex-1 text-xs sm:text-sm py-1.5 px-2"
            >
              Ingreso
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="flex-1 text-xs sm:text-sm py-1.5 px-2"
            >
              Pendiente
            </TabsTrigger>
            <TabsTrigger
              value="initial"
              className="flex-1 text-xs sm:text-sm py-1.5 px-2"
            >
              Ajuste
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expense">
            <FormContent
              type="expense"
              label="Nuevo Gasto"
              onSubmit={(t) => addTransaction("expense", t)}
            />
          </TabsContent>
          <TabsContent value="income">
            <FormContent
              type="income"
              label="Nuevo Ingreso"
              onSubmit={(t) => addTransaction("income", t)}
            />
          </TabsContent>
          <TabsContent value="pending">
            <FormContent
              type="pending"
              label="Pago Pendiente"
              onSubmit={(t) => addTransaction("pending", t)}
            />
          </TabsContent>
          <TabsContent value="initial">
            <FormContent
              type="initial"
              label="Ajuste Saldo"
              onSubmit={(t) => addTransaction("initial", t)}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function FormContent({
  label,
  onSubmit,
}: {
  type: TransactionType;
  label: string;
  onSubmit: (t: Transaction) => void;
}) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tag, setTag] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !tag) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      date: date.toISOString(), // Keep strict ISO
      label: tag,
      description: desc,
    };

    onSubmit(newTransaction);
    // Reset
    setAmount("");
    setTag("");
    setDesc("");
    // Keep date or reset? Keep today.
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Monto</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label>Fecha</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">
                  {date ? (
                    format(date, "PP", { locale: es })
                  ) : (
                    <span>Seleccionar</span>
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tag">Etiqueta (Categoría)</Label>
        <Input
          id="tag"
          placeholder="Ej: Comida, Transporte, Salario"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="desc">Descripción</Label>
        <Input
          id="desc"
          placeholder="Detalles opcionales"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full mt-4">
        <Plus className="mr-2 h-4 w-4" /> Registrar {label}
      </Button>
    </form>
  );
}
