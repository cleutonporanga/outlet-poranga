"use client";

import React from 'react';
import { Movement } from "@/lib/inventory-types";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MovementsTabProps {
  movements: Movement[];
}

export function MovementsTab({ movements }: MovementsTabProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Histórico Recente</h2>
      </div>

      <div className="space-y-3">
        {movements.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>Nenhuma movimentação registrada.</p>
          </div>
        ) : (
          movements.map(movement => (
            <Card key={movement.id} className="border-none shadow-sm bg-white">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-full ${movement.type === 'entrada' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {movement.type === 'entrada' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{movement.productName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={12} className="text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">
                      {format(new Date(movement.date), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-sm font-bold ${movement.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                    {movement.type === 'entrada' ? '+' : '-'}{movement.quantity}
                  </span>
                  <p className="text-[10px] text-muted-foreground capitalize">{movement.type}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
