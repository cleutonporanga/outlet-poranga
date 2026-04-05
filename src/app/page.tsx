
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTab } from "@/components/inventory/dashboard-tab";
import { InventoryTab } from "@/components/inventory/inventory-tab";
import { MovementsTab } from "@/components/inventory/movements-tab";
import { ReportsTab } from "@/components/inventory/reports-tab";
import { Product, Movement, InventoryStats } from "@/lib/inventory-types";
import { Plus, Loader2, LogOut, LayoutDashboard, Package, ShoppingCart, BarChart3 } from "lucide-react";
import { ProductModal } from "@/components/inventory/product-modal";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { 
  useUser, 
  useFirestore, 
  useAuth,
  useCollection, 
  useMemoFirebase,
  setDocumentNonBlocking,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking
} from "@/firebase";
import { collection, doc, query, orderBy } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function InventoryApp() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // Protected route logic
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Memoize Firestore references
  const productsRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'products'), orderBy('createdAt', 'desc'));
  }, [db, user]);

  const movementsRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'movements'), orderBy('date', 'desc'));
  }, [db, user]);

  const { data: products = [], isLoading: isProductsLoading } = useCollection<Product>(productsRef);
  const { data: movements = [], isLoading: isMovementsLoading } = useCollection<Movement>(movementsRef);

  const handleSaveProduct = (formData: Partial<Product>) => {
    if (!user || !db) return;

    const productsCollection = collection(db, 'users', user.uid, 'products');
    
    const cleanData = {
      ...formData,
      quantity: Number(formData.quantity) || 0,
      price: Number(formData.price) || 0,
      costPrice: Number(formData.costPrice) || 0,
    };

    if (editingProduct) {
      const docRef = doc(productsCollection, editingProduct.id);
      updateDocumentNonBlocking(docRef, {
        ...cleanData,
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Atualizado", description: "O produto foi atualizado com sucesso." });
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      const docRef = doc(productsCollection, newId);
      setDocumentNonBlocking(docRef, {
        ...cleanData,
        id: newId,
        createdAt: new Date().toISOString(),
      }, { merge: true });
      toast({ title: "Sucesso!", description: "Produto adicionado ao inventário." });
    }
    setIsModalOpen(false);
    setEditingProduct(undefined);
  };

  const handleDeleteProduct = (id: string) => {
    if (!user || !db) return;
    const docRef = doc(db, 'users', user.uid, 'products', id);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Excluído", description: "Produto removido do sistema.", variant: "destructive" });
  };

  const handleSellProduct = (id: string) => {
    const product = products?.find(p => p.id === id);
    if (!product || product.quantity <= 0 || !user || !db) {
      toast({ title: "Sem Estoque", description: "Não é possível vender um produto sem estoque.", variant: "destructive" });
      return;
    }

    const productRef = doc(db, 'users', user.uid, 'products', id);
    updateDocumentNonBlocking(productRef, { quantity: product.quantity - 1 });

    const movementsCollection = collection(db, 'users', user.uid, 'movements');
    const movementId = Math.random().toString(36).substr(2, 9);
    const movementRef = doc(movementsCollection, movementId);
    
    setDocumentNonBlocking(movementRef, {
      id: movementId,
      productId: product.id,
      productName: product.name,
      type: 'saída' as const,
      quantity: 1,
      date: new Date().toISOString(),
      unitPrice: product.price,
      unitCost: product.costPrice,
    }, { merge: true });

    toast({ title: "Venda Registrada!", description: `1x ${product.name} vendida com sucesso.` });
  };

  const handleLogout = () => {
    if (auth) {
      signOut(auth).then(() => {
        router.push('/login');
      });
    }
  };

  if (isUserLoading || (!user && isUserLoading)) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) return null;

  const salesOnly = (movements || []).filter(m => m.type === 'saída');
  
  const stats: InventoryStats = {
    totalProducts: (products || []).reduce((acc, p) => acc + (Number(p.quantity) || 0), 0),
    lowStockCount: (products || []).filter(p => p.quantity < 5).length,
    totalInventoryValue: (products || []).reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.quantity) || 0)), 0),
    totalProfit: salesOnly.reduce((acc, m) => acc + (((Number(m.unitPrice) || 0) - (Number(m.unitCost) || 0)) * (Number(m.quantity) || 0)), 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full bg-white min-h-screen flex flex-col relative">
        <header className="bg-[#81C784] px-6 md:px-12 pt-10 pb-6 border-b border-[#6db371] flex justify-between items-start shadow-sm">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Outlet Multimarcas Poranga</h1>
            <p className="text-sm md:text-base text-white/90">Gestão de Vendas e Lucro</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-white hover:text-white/80 transition-colors flex items-center gap-2 font-medium"
            title="Sair"
          >
            <span className="hidden md:inline">Sair do Sistema</span>
            <LogOut size={20} />
          </button>
        </header>

        <Tabs defaultValue="inicio" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start md:justify-center overflow-x-auto bg-white border-b rounded-none p-0 h-auto hide-scrollbar sticky top-0 z-40 px-6 md:px-12">
            <TabsTrigger value="inicio" className="top-tab-trigger min-w-[120px] md:px-10 flex items-center gap-2">
              <LayoutDashboard size={18} />
              Início
            </TabsTrigger>
            <TabsTrigger value="estoque" className="top-tab-trigger min-w-[120px] md:px-10 flex items-center gap-2">
              <Package size={18} />
              Estoque
            </TabsTrigger>
            <TabsTrigger value="vendas" className="top-tab-trigger min-w-[120px] md:px-10 flex items-center gap-2">
              <ShoppingCart size={18} />
              Vendas
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="top-tab-trigger min-w-[130px] md:px-10 flex items-center gap-2">
              <BarChart3 size={18} />
              Relatórios
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 p-6 md:p-12">
            <TabsContent value="inicio" className="m-0 focus-visible:ring-0">
              <DashboardTab stats={stats} products={products || []} />
            </TabsContent>
            <TabsContent value="estoque" className="m-0 focus-visible:ring-0">
              <InventoryTab 
                products={products || []} 
                onEdit={(p) => { setEditingProduct(p); setIsModalOpen(true); }} 
                onDelete={handleDeleteProduct} 
                onSell={handleSellProduct}
              />
            </TabsContent>
            <TabsContent value="vendas" className="m-0 focus-visible:ring-0">
              <MovementsTab movements={salesOnly} />
            </TabsContent>
            <TabsContent value="relatorios" className="m-0 focus-visible:ring-0">
              <ReportsTab stats={stats} products={products || []} />
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
          onSave={handleSaveProduct}
          editingProduct={editingProduct}
        />
      </div>
      <Toaster />
    </div>
  );
}
