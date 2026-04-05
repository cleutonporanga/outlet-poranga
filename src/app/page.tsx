"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTab } from "@/components/inventory/dashboard-tab";
import { InventoryTab } from "@/components/inventory/inventory-tab";
import { MovementsTab } from "@/components/inventory/movements-tab";
import { ReportsTab } from "@/components/inventory/reports-tab";
import { Product, Movement, InventoryStats } from "@/lib/inventory-types";
import { Plus, Loader2, LogOut } from "lucide-react";
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

  // Memoize Firestore references for products and movements
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
    
    if (editingProduct) {
      const docRef = doc(productsCollection, editingProduct.id);
      updateDocumentNonBlocking(docRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Atualizado", description: "O produto foi atualizado com sucesso." });
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      const docRef = doc(productsCollection, newId);
      setDocumentNonBlocking(docRef, {
        ...formData,
        id: newId,
        createdAt: new Date().toISOString(),
        quantity: formData.quantity || 0,
        price: formData.price || 0,
        costPrice: formData.costPrice || 0,
      }, { merge: true });
      toast({ title: "Sucesso!", description: "Produto adicionado ao inventário." });
    }
    setIsModalOpen(false);
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

  // Show loading spinner while checking auth state
  if (isUserLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  // Prevent flash of content if user is not authenticated and redirect is pending
  if (!user) {
    return null;
  }

  const salesOnly = (movements || []).filter(m => m.type === 'saída');
  
  const stats: InventoryStats = {
    totalProducts: (products || []).reduce((acc, p) => acc + (Number(p.quantity) || 0), 0),
    lowStockCount: (products || []).filter(p => p.quantity < 5).length,
    totalInventoryValue: (products || []).reduce((acc, p) => acc + ((p.price || 0) * (p.quantity || 0)), 0),
    totalProfit: salesOnly.reduce((acc, m) => acc + (((m.unitPrice || 0) - (m.unitCost || 0)) * (m.quantity || 0)), 0),
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background overflow-hidden relative shadow-2xl">
      <header className="bg-white px-6 pt-8 pb-4 border-b flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-primary">Outlet Multimarcas Poranga</h1>
          <p className="text-sm text-muted-foreground">Gestão de Vendas e Lucro</p>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
          title="Sair"
        >
          <LogOut size={20} />
        </button>
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
      <Toaster />
    </div>
  );
}
