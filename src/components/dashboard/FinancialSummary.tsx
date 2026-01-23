"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/components/FinanceProvider";
import { calculateBalance } from "@/lib/finance-utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Optional for spanish
import { CalendarIcon, TrendingDown, TrendingUp, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function FinancialSummary() {
  const { data } = useFinance();
  const [targetDate, setTargetDate] = useState<Date>(new Date());

  const balance = calculateBalance(data, targetDate);
  const isDeficit = balance.total < 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Tablero Financiero
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Proyectar al:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !targetDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {targetDate ? (
                  format(targetDate, "PPP", { locale: es })
                ) : (
                  <span>Seleccionar fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={targetDate}
                onSelect={(d) => d && setTargetDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Balance Proyectado
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                isDeficit ? "text-red-600" : "text-green-600",
              )}
            >
              {balance.total.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isDeficit ? "Déficit proyectado" : "Superávit disponible"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {balance.breakdown.income.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Acumulado a la fecha
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {balance.breakdown.expenses.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Acumulado a la fecha
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pagos Pendientes
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {balance.breakdown.pending.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">A descontar</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
