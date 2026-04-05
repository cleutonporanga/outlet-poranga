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
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Histórico de Vendas</h2>
      </div>

      <div className="space-y-3">
        {movements.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>Nenhuma venda registrada ainda.</p>
          </div>
        ) : (
          movements.map(movement => {
            const profit = (movement.unitPrice - movement.unitCost) * movement.quantity;
            
            return (
              <Card key={movement.id} className="border-none shadow-sm bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-accent/10 text-accent">
                      <ShoppingCart size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{movement.productName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar size={12} className="text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">
                          {format(new Date(movement.date), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-foreground">
                        {movement.quantity}x
                      </span>
                      <p className="text-[10px] text-muted-foreground">Vendido</p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/5 px-4 py-2 flex justify-between items-center border-t border-accent/10">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-accent" />
                      <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Lucro da Venda</span>
                    </div>
                    <span className="text-sm font-black text-accent">
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
