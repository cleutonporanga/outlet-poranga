
"use client";

import React from 'react';
import { InventoryStats, Product } from "@/lib/inventory-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FileText, ChevronRight, Package, TrendingUp, DollarSign } from "lucide-react";

interface ReportsTabProps {
  stats: InventoryStats;
  products: Product[];
}

export function ReportsTab({ stats, products }: ReportsTabProps) {
  const lowStockItems = products.filter(p => p.quantity < 5).sort((a, b) => a.quantity - b.quantity);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-8">
      {/* Resumo Visual no Desktop */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        <Card className="border-none shadow-md bg-white p-6 flex items-center gap-4">
          <div className="p-4 bg-slate-50 text-slate-600 rounded-2xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Itens</p>
            <p className="text-2xl font-black">{stats.totalProducts}</p>
          </div>
        </Card>
        <Card className="border-none shadow-md bg-white p-6 flex items-center gap-4">
          <div className="p-4 bg-green-50 text-accent rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Lucro Registrado</p>
            <p className="text-2xl font-black text-accent">{formatCurrency(stats.totalProfit)}</p>
          </div>
        </Card>
        <Card className="border-none shadow-md bg-white p-6 flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Alertas de Estoque</p>
            <p className="text-2xl font-black text-red-600">{stats.lowStockCount}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna 1: Estoque Baixo */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-500 text-white p-2 rounded-lg">
              <AlertCircle size={20} />
            </div>
            <h2 className="font-bold text-xl">Urgência de Reposição</h2>
          </div>

          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <Card className="border-dashed border-2 bg-slate-50">
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Package className="mx-auto mb-4 opacity-20" size={48} />
                  <p className="font-medium">Excelente! Todos os seus itens estão com estoque saudável.</p>
                </CardContent>
              </Card>
            ) : (
              lowStockItems.map(product => (
                <Card key={product.id} className="border-none shadow-md bg-white overflow-hidden border-l-4 border-l-red-500 hover:translate-x-1 transition-transform">
                  <CardContent className="p-5 flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-bold mb-1">{product.name}</h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Tamanho: {product.size} • Cor: {product.color}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="font-black px-4 py-1.5 rounded-full">
                        APENAS {product.quantity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Coluna 2: Relatórios e Ações */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-accent text-white p-2 rounded-lg">
              <FileText size={20} />
            </div>
            <h2 className="font-bold text-xl">Análises Detalhadas</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Card className="border-none shadow-md bg-white cursor-pointer hover:bg-slate-50 transition-all group p-2">
              <CardContent className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-accent group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Inventário Completo</h3>
                    <p className="text-xs text-muted-foreground">Listagem detalhada de todos os itens ativos e inativos</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground group-hover:text-accent transition-colors" />
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white cursor-pointer hover:bg-slate-50 transition-all group p-2">
              <CardContent className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-accent group-hover:text-white transition-colors">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Volume de Vendas Mensal</h3>
                    <p className="text-xs text-muted-foreground">Evolução financeira e volume de saídas por período</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground group-hover:text-accent transition-colors" />
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white cursor-pointer hover:bg-slate-50 transition-all group p-2">
              <CardContent className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-accent group-hover:text-white transition-colors">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Curva ABC de Produtos</h3>
                    <p className="text-xs text-muted-foreground">Ranking de itens que mais trazem lucro para a outlet</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground group-hover:text-accent transition-colors" />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
