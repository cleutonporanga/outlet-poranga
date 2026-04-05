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
    <div className="space-y-8">
      {/* Grid de Estatísticas Fluido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
        <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Package size={20} />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Estoque Total</span>
            </div>
            <div className="text-3xl font-black">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <AlertTriangle size={20} />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Reposição</span>
            </div>
            <div className="text-3xl font-black text-red-600">{stats.lowStockCount}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-50 text-accent rounded-lg">
                <PiggyBank size={20} />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Lucro Total</span>
            </div>
            <div className="text-3xl font-black text-accent">
              {formatCurrency(stats.totalProfit)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                <DollarSign size={20} />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Valor em Loja</span>
            </div>
            <div className="text-3xl font-black text-slate-700">
              {formatCurrency(stats.totalInventoryValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Gráfico de Categorias */}
        <Card className="border-none shadow-md bg-white xl:col-span-2 overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp size={20} />
              Distribuição de Estoque por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-8">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={120} 
                    fontSize={13}
                    fontWeight={600}
                  />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                  <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={40}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="hsl(var(--accent))" fillOpacity={1 - (index * 0.05)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Info extra */}
        <Card className="border-none shadow-md bg-accent text-accent-foreground p-8 flex flex-col justify-center text-center">
          <div className="mb-6 bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp size={40} />
          </div>
          <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Desempenho da Outlet</h3>
          <p className="text-base opacity-90 leading-relaxed">
            Seu lucro atual reflete a eficiência das vendas. Continue monitorando os itens de baixa reposição para não perder oportunidades.
          </p>
          <div className="mt-10 pt-10 border-t border-white/20">
            <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70 mb-2">Status da Operação</p>
            <p className="text-4xl font-black">
              {stats.totalProfit > 0 ? 'LUCRATIVO' : 'ESTÁVEL'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}