
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryStats, Product } from "@/lib/inventory-types";
import { Package, AlertTriangle, DollarSign, TrendingUp, PiggyBank } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface DashboardTabProps {
  stats: InventoryStats;
  products: Product[];
}

export function DashboardTab({ stats, products }: DashboardTabProps) {
  const categoryData = Array.from(new Set(products.map(p => p.category))).map(cat => ({
    name: cat,
    total: products.filter(p => p.category === cat).reduce((acc, p) => acc + p.quantity, 0)
  }));

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-6">
      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-none shadow-md bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Package size={20} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Estoque Total</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <AlertTriangle size={20} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Reposição</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.lowStockCount}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-50 text-accent rounded-lg">
                <PiggyBank size={20} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Lucro Total</span>
            </div>
            <div className="text-2xl font-bold text-accent">
              {formatCurrency(stats.totalProfit)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                <DollarSign size={20} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Valor em Loja</span>
            </div>
            <div className="text-2xl font-bold text-slate-700">
              {formatCurrency(stats.totalInventoryValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Categorias */}
        <Card className="border-none shadow-md bg-white lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp size={18} />
              Distribuição de Estoque por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] w-full mt-4 pr-6 pb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={100} 
                    fontSize={12} 
                  />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={30}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="hsl(var(--accent))" fillOpacity={1 - (index * 0.1)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Info extra para preencher desktop */}
        <Card className="border-none shadow-md bg-accent text-accent-foreground p-6 flex flex-col justify-center text-center">
          <div className="mb-4 bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Desempenho da Outlet</h3>
          <p className="text-sm opacity-90">
            Seu lucro atual representa o retorno sobre o investimento em produtos vendidos até o momento.
          </p>
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm font-medium uppercase tracking-wider opacity-70 mb-1">Margem Média</p>
            <p className="text-3xl font-black">
              {stats.totalProfit > 0 ? 'Bom!' : 'Acompanhando'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
