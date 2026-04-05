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
    <div className="space-y-12">
      {/* Resumo Visual em Grid Fluido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-none shadow-md bg-white p-8 flex items-center gap-6 rounded-2xl">
          <div className="p-5 bg-slate-50 text-slate-600 rounded-2xl">
            <Package size={32} />
          </div>
          <div>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Total Itens</p>
            <p className="text-3xl font-black">{stats.totalProducts}</p>
          </div>
        </Card>
        <Card className="border-none shadow-md bg-white p-8 flex items-center gap-6 rounded-2xl">
          <div className="p-5 bg-green-50 text-accent rounded-2xl">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Lucro Atual</p>
            <p className="text-3xl font-black text-accent">{formatCurrency(stats.totalProfit)}</p>
          </div>
        </Card>
        <Card className="border-none shadow-md bg-white p-8 flex items-center gap-6 rounded-2xl">
          <div className="p-5 bg-red-50 text-red-600 rounded-2xl">
            <AlertCircle size={32} />
          </div>
          <div>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Em Alerta</p>
            <p className="text-3xl font-black text-red-600">{stats.lowStockCount}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-12">
        {/* Coluna 1: Estoque Baixo */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-red-500 text-white p-3 rounded-2xl shadow-lg">
              <AlertCircle size={24} />
            </div>
            <h2 className="font-black text-2xl uppercase tracking-tight">Urgência de Reposição</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lowStockItems.length === 0 ? (
              <Card className="col-span-full border-dashed border-2 bg-slate-50 rounded-2xl">
                <CardContent className="p-16 text-center text-muted-foreground">
                  <Package className="mx-auto mb-6 opacity-20" size={64} />
                  <p className="font-bold text-lg">Excelente! Estoque saudável em toda a loja.</p>
                </CardContent>
              </Card>
            ) : (
              lowStockItems.map(product => (
                <Card key={product.id} className="border-none shadow-md bg-white overflow-hidden border-l-8 border-l-red-500 hover:translate-y-[-2px] transition-all rounded-2xl">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold mb-1.5">{product.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                        TAM: {product.size} • COR: {product.color}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="font-black px-6 py-2 rounded-full text-sm">
                        QTD: {product.quantity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Coluna 2: Relatórios */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-accent text-white p-3 rounded-2xl shadow-lg">
              <FileText size={24} />
            </div>
            <h2 className="font-black text-2xl uppercase tracking-tight">Análises Detalhadas</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="border-none shadow-md bg-white cursor-pointer hover:bg-slate-50 transition-all group p-2 rounded-2xl">
              <CardContent className="p-8 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-accent group-hover:text-white transition-all">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Inventário Completo</h3>
                    <p className="text-sm text-muted-foreground mt-1">Listagem detalhada de todos os itens ativos.</p>
                  </div>
                </div>
                <ChevronRight size={28} className="text-muted-foreground group-hover:text-accent transition-all" />
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white cursor-pointer hover:bg-slate-50 transition-all group p-2 rounded-2xl">
              <CardContent className="p-8 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-accent group-hover:text-white transition-all">
                    <TrendingUp size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Relatório Financeiro</h3>
                    <p className="text-sm text-muted-foreground mt-1">Evolução de lucro e faturamento mensal.</p>
                  </div>
                </div>
                <ChevronRight size={28} className="text-muted-foreground group-hover:text-accent transition-all" />
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white cursor-pointer hover:bg-slate-50 transition-all group p-2 rounded-2xl">
              <CardContent className="p-8 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-accent group-hover:text-white transition-all">
                    <DollarSign size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Ranking de Vendas</h3>
                    <p className="text-sm text-muted-foreground mt-1">Os produtos mais vendidos da sua outlet.</p>
                  </div>
                </div>
                <ChevronRight size={28} className="text-muted-foreground group-hover:text-accent transition-all" />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}