"use client";

import React from 'react';
import { InventoryStats, Product } from "@/lib/inventory-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FileText, ChevronRight } from "lucide-react";

interface ReportsTabProps {
  stats: InventoryStats;
  products: Product[];
}

export function ReportsTab({ stats, products }: ReportsTabProps) {
  const lowStockItems = products.filter(p => p.quantity < 5).sort((a, b) => a.quantity - b.quantity);

  return (
    <div className="p-4 space-y-6">
      <section>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={18} className="text-red-500" />
          <h2 className="font-semibold text-base">Alerta de Estoque Baixo</h2>
        </div>

        <div className="space-y-3">
          {lowStockItems.length === 0 ? (
            <Card className="border-dashed border-2 bg-transparent">
              <CardContent className="p-8 text-center text-muted-foreground">
                <p>Nenhum item com estoque baixo.</p>
              </CardContent>
            </Card>
          ) : (
            lowStockItems.map(product => (
              <Card key={product.id} className="border-none shadow-sm bg-white overflow-hidden border-l-4 border-l-red-500">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">Tam: {product.size} • Cor: {product.color}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="font-bold">
                      {product.quantity} restando
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <FileText size={18} className="text-accent" />
          <h2 className="font-semibold text-base">Indicadores Rápidos</h2>
        </div>

        <div className="space-y-3">
          <Card className="border-none shadow-sm bg-white cursor-pointer hover:bg-muted/30 transition-colors">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">Relatório Geral de Inventário</h3>
                <p className="text-[10px] text-muted-foreground">Visão detalhada de todos os itens ativos</p>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white cursor-pointer hover:bg-muted/30 transition-colors">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">Histórico Mensal de Vendas</h3>
                <p className="text-[10px] text-muted-foreground">Saídas e volume de movimentação por mês</p>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white cursor-pointer hover:bg-muted/30 transition-colors">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">Curva ABC de Produtos</h3>
                <p className="text-[10px] text-muted-foreground">Identifique os itens de maior giro</p>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
