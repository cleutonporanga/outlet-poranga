"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTab } from "@/components/inventory/dashboard-tab";
import { InventoryTab } from "@/components/inventory/inventory-tab";
import { MovementsTab } from "@/components/inventory/movements-tab";
import { ReportsTab } from "@/components/inventory/reports-tab";
import { Product, Movement, InventoryStats } from "@/lib/inventory-types";
import { Plus } from "lucide-react";
import { ProductModal } from "@/components/inventory/product-modal";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Camiseta Basic Oversized', category: 'Camisetas', size: 'G', color: 'Preto', quantity: 12, price: 89.90, costPrice: 35.00, createdAt: new Date().toISOString() },
  { id: '2', name: 'Calça Jeans Slim', category: 'Calças', size: '42', color: 'Azul', quantity: 3, price: 159.00, costPrice: 70.00, createdAt: new Date().toISOString() },
  { id: '3', name: 'Vestido Midi Floral', category: 'Vestidos', size: 'M', color: 'Verde', quantity: 8, price: 199.90, costPrice: 85.00, createdAt: new Date().toISOString() },
  { id: '4', name: 'Jaqueta Puffer', category: 'Casacos', size: 'P', color: 'Bege', quantity: 2, price: 299.00, costPrice: 120.00, createdAt: new Date().toISOString() },
];

const MOCK_MOVEMENTS: Movement[] = [
  { id: 'm1', productId: '1', productName: 'Camiseta Basic Oversized', type: 'saída', quantity: 2, date: new Date().toISOString(), unitPrice: 89.90, unitCost: 35.00 },
  { id: 'm2', productId: '2', productName: 'Calça Jeans Slim', type: 'saída', quantity: 1, date: new Date().toISOString(), unitPrice: 159.00, unitCost: 70.00 },
];

export default function InventoryApp() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [movements, setMovements] = useState<Movement[]>(MOCK_MOVEMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const { toast } = useToast();

  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'createdAt'>) => {
    const product: Product = {
      ...newProduct,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setProducts([...products, product]);
    
    toast({
      title: "Sucesso!",
      description: "Produto adicionado ao inventário.",
    });
  };

  const handleUpdateProduct = (updatedFields: Partial<Product>) => {
    if (!editingProduct) return;
    
    setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...updatedFields } : p));
    
    toast({
      title: "Atualizado",
      description: "O produto foi atualizado com sucesso.",
    });
    setEditingProduct(undefined);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Excluído",
      description: "Produto removido do sistema.",
      variant: "destructive",
    });
  };

  const salesOnly = movements.filter(m => m.type === 'saída');
  
  const stats: InventoryStats = {
    totalProducts: products.reduce((acc, p) => acc + p.quantity, 0),
    lowStockCount: products.filter(p => p.quantity < 5).length,
    totalInventoryValue: products.reduce((acc, p) => acc + (p.price * p.quantity), 0),
    totalProfit: salesOnly.reduce((acc, m) => acc + ((m.unitPrice - m.unitCost) * m.quantity), 0),
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background overflow-hidden relative shadow-2xl">
      <header className="bg-white px-6 pt-8 pb-4 border-b">
        <h1 className="text-2xl font-bold text-primary">ModaEstoque Pro</h1>
        <p className="text-sm text-muted-foreground">Gestão de Vendas e Lucro</p>
      </header>

      <Tabs defaultValue="inicio" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start overflow-x-auto bg-white border-b rounded-none p-0 h-auto hide-scrollbar sticky top-0 z-40">
          <TabsTrigger value="inicio" className="top-tab-trigger min-w-[100px]">Início</TabsTrigger>
          <TabsTrigger value="estoque" className="top-tab-trigger min-w-[100px]">Estoque</TabsTrigger>
          <TabsTrigger value="vendas" className="top-tab-trigger min-w-[100px]">Vendas</TabsTrigger>
          <TabsTrigger value="relatorios" className="top-tab-trigger min-w-[110px]">Relatórios</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto pb-24">
          <TabsContent value="inicio" className="m-0 focus-visible:ring-0">
            <DashboardTab stats={stats} products={products} />
          </TabsContent>
          <TabsContent value="estoque" className="m-0 focus-visible:ring-0">
            <InventoryTab 
              products={products} 
              onEdit={(p) => { setEditingProduct(p); setIsModalOpen(true); }} 
              onDelete={handleDeleteProduct} 
            />
          </TabsContent>
          <TabsContent value="vendas" className="m-0 focus-visible:ring-0">
            <MovementsTab movements={salesOnly} />
          </TabsContent>
          <TabsContent value="relatorios" className="m-0 focus-visible:ring-0">
            <ReportsTab stats={stats} products={products} />
          </TabsContent>
        </div>
      </Tabs>

      <button 
        className="fab" 
        onClick={() => { setEditingProduct(undefined); setIsModalOpen(true); }}
        aria-label="Adicionar Produto"
      >
        <Plus size={28} />
      </button>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingProduct(undefined); }} 
        onSave={(data) => {
          if (editingProduct) {
            handleUpdateProduct(data);
          } else {
            handleAddProduct(data as Omit<Product, 'id' | 'createdAt'>);
          }
          setIsModalOpen(false);
        }}
        editingProduct={editingProduct}
      />
      <Toaster />
    </div>
  );
}
