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
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-black text-primary uppercase tracking-[0.2em]">Histórico de Vendas</h2>
        <div className="bg-slate-100 text-slate-700 px-6 py-2 rounded-full text-sm font-bold">
          {movements.length} vendas realizadas
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
        {movements.length === 0 ? (
          <div className="col-span-full text-center py-32 text-muted-foreground">
            <p className="text-xl font-medium">Nenhuma venda registrada ainda.</p>
          </div>
        ) : (
          movements.map(movement => {
            const profit = (movement.unitPrice - movement.unitCost) * movement.quantity;
            
            return (
              <Card key={movement.id} className="border-none shadow-md bg-white overflow-hidden hover:shadow-xl transition-all rounded-2xl">
                <CardContent className="p-0">
                  <div className="p-6 flex items-center gap-5">
                    <div className="p-5 rounded-2xl bg-accent/10 text-accent">
                      <ShoppingCart size={28} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate mb-1.5">{movement.productName}</h3>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-bold uppercase">
                          {format(new Date(movement.date), "dd/MM, HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-foreground">
                        {movement.quantity}x
                      </span>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">Qtd</p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/5 px-8 py-5 flex justify-between items-center border-t border-accent/10">
                    <div className="flex items-center gap-3">
                      <div className="bg-accent text-white p-1.5 rounded-lg">
                        <TrendingUp size={16} />
                      </div>
                      <span className="text-xs font-black text-accent uppercase tracking-widest">Lucro</span>
                    </div>
                    <span className="text-2xl font-black text-accent">
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