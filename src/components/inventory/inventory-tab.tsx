
"use client";

import React, { useState } from 'react';
import { Product } from "@/lib/inventory-types";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, Edit2, Trash2, AlertCircle, ShoppingBag, Image as ImageIcon, Package } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from 'next/image';

interface InventoryTabProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onSell: (id: string) => void;
}

export function InventoryTab({ products, onEdit, onDelete, onSell }: InventoryTabProps) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="sticky top-[60px] md:top-[64px] bg-white z-30 py-4 space-y-4 border-b -mx-4 px-4 md:-mx-8 md:px-8">
        <div className="max-w-xl mx-auto md:mx-0 w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            className="pl-10 h-12 bg-slate-50 shadow-sm border-none rounded-xl"
            placeholder="Buscar por nome ou categoria..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <Badge 
            variant={!filterCategory ? "default" : "outline"} 
            className="cursor-pointer whitespace-nowrap px-6 py-2 rounded-full text-sm transition-all"
            onClick={() => setFilterCategory(null)}
          >
            Todos os Itens
          </Badge>
          {categories.map(cat => (
            <Badge 
              key={cat}
              variant={filterCategory === cat ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap px-6 py-2 rounded-full text-sm transition-all"
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            <Package className="mx-auto mb-4 opacity-10" size={64} />
            <p className="text-lg">Nenhum produto encontrado nesta busca.</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <Card key={product.id} className="border-none shadow-md bg-white overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-0 flex flex-col">
                <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                  {product.imageUrl ? (
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  {product.quantity < 5 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg">
                      <AlertCircle size={12} /> ESTOQUE BAIXO
                    </div>
                  )}
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg leading-tight line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{product.category}</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 text-muted-foreground hover:bg-slate-100 rounded-full transition-colors">
                          <MoreVertical size={20} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl">
                        <DropdownMenuItem onClick={() => onSell(product.id)} className="text-accent font-bold h-10 cursor-pointer">
                          <ShoppingBag size={16} className="mr-2" /> Registrar Venda
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(product)} className="h-10 cursor-pointer">
                          <Edit2 size={16} className="mr-2" /> Editar Produto
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive h-10 cursor-pointer" onClick={() => onDelete(product.id)}>
                          <Trash2 size={16} className="mr-2" /> Excluir do Sistema
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="px-3 py-1 rounded-lg">Tam: {product.size}</Badge>
                    <Badge variant="secondary" className="px-3 py-1 rounded-lg">Cor: {product.color}</Badge>
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center">
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-widest ${product.quantity < 5 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        Qtd Disponível
                      </span>
                      <p className={`text-2xl font-black ${product.quantity < 5 ? 'text-red-600' : 'text-foreground'}`}>
                        {product.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preço Un.</span>
                      <p className="text-2xl font-black text-accent">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
