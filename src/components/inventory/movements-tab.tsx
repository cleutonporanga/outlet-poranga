
"use client";

import React from 'react';
import { Movement } from "@/lib/inventory-types";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MovementsTabProps {
  movements: Movement[];
}

export function MovementsTab({ movements }: MovementsTabProps) {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-muted-foreground uppercase tracking-widest">Histórico de Saídas</h2>
        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">{movements.length} vendas registradas</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {movements.length === 0 ? (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            <p className="text-lg">Nenhuma venda registrada ainda.</p>
          </div>
        ) : (
          movements.map(movement => {
            const profit = (movement.unitPrice - movement.unitCost) * movement.quantity;
            
            return (
              <Card key={movement.id} className="border-none shadow-md bg-white overflow-hidden hover:shadow-lg transition-all">
                <CardContent className="p-0">
                  <div className="p-5 flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-accent/10 text-accent">
                      <ShoppingCart size={24} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base truncate mb-1">{movement.productName}</h3>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-medium">
                          {format(new Date(movement.date), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black text-foreground">
                        {movement.quantity}x
                      </span>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">Unidades</p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/5 px-6 py-4 flex justify-between items-center border-t border-accent/10">
                    <div className="flex items-center gap-2">
                      <div className="bg-accent text-white p-1 rounded-md">
                        <TrendingUp size={14} />
                      </div>
                      <span className="text-xs font-bold text-accent uppercase tracking-widest">Lucro Líquido</span>
                    </div>
                    <span className="text-xl font-black text-accent">
                      {formatCurrency(profit)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

// Re-using Badge component logic for simplicity
function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-colors ${className}`}>
      {children}
    </div>
  );
}
