"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/components/FinanceProvider";
import { Download, Upload, RefreshCw } from "lucide-react";

export function Header() {
  const { exportData, importData, resetData } = useFinance();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          importData(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-background p-4 rounded-lg border shadow-sm">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Mis Finanzas
        </h1>
        <p className="text-muted-foreground">
          Gestiona tus ingresos y gastos de forma simple.
        </p>
      </div>
      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".json"
          onChange={handleFileChange}
        />
        <Button variant="outline" onClick={handleImportClick}>
          <Upload className="mr-2 h-4 w-4" /> Importar
        </Button>
        <Button variant="default" onClick={exportData}>
          <Download className="mr-2 h-4 w-4" /> Exportar
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={resetData}
          title="Reiniciar datos"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
