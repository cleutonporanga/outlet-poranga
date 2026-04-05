"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryStats, Product } from "@/lib/inventory-types";
import { Package, AlertTriangle, DollarSign, TrendingUp } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface DashboardTabProps {
  stats: InventoryStats;
  products: Product[];
}

export function DashboardTab({ stats, products }: DashboardTabProps) {
  // Simple data for category chart
  const categoryData = Array.from(new Set(products.map(p => p.category))).map(cat => ({
    name: cat,
    total: products.filter(p => p.category === cat).reduce((acc, p) => acc + p.quantity, 0)
  }));

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-md bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Package size={20} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Total Itens</span>
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
              <span className="text-xs font-medium text-muted-foreground">Estoque Baixo</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.lowStockCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-50 text-accent rounded-lg">
                <DollarSign size={20} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Valor em Estoque</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-accent">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalInventoryValue)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp size={16} />
            Estoque por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[200px] w-full mt-4 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={80} 
                  fontSize={12} 
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={20}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="hsl(var(--accent))" fillOpacity={1 - (index * 0.15)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
