
"use client";

import React, { useState } from 'react';
import { Product } from "@/lib/inventory-types";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, Edit2, Trash2, AlertCircle, ShoppingBag, Image as ImageIcon, Package, Tag } from "lucide-react";
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
    const searchLower = search.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchLower) || 
                          p.category.toLowerCase().includes(searchLower) ||
                          p.sku?.toLowerCase().includes(searchLower) ||
                          p.brand?.toLowerCase().includes(searchLower);
    const matchesCategory = !filterCategory || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="sticky top-[60px] md:top-[64px] bg-white z-30 py-6 space-y-6 border-b -mx-6 px-6 md:-mx-12 md:px-12">
        <div className="max-w-2xl w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input 
            className="pl-12 h-14 bg-slate-50 shadow-sm border-none rounded-2xl text-lg"
            placeholder="Buscar por nome, marca, código ou categoria..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          <Badge 
            variant={!filterCategory ? "default" : "outline"} 
            className="cursor-pointer whitespace-nowrap px-8 py-2.5 rounded-full text-sm font-bold transition-all uppercase tracking-wider"
            onClick={() => setFilterCategory(null)}
          >
            Todos os Itens
          </Badge>
          {categories.map(cat => (
            <Badge 
              key={cat}
              variant={filterCategory === cat ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap px-8 py-2.5 rounded-full text-sm font-bold transition-all uppercase tracking-wider"
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 md:gap-8">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-32 text-muted-foreground">
            <Package className="mx-auto mb-6 opacity-10" size={80} />
            <p className="text-xl font-medium">Nenhum produto encontrado.</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <Card key={product.id} className="border-none shadow-md bg-white overflow-hidden hover:shadow-2xl transition-all duration-300 group rounded-2xl">
              <CardContent className="p-0 flex flex-col">
                <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                  {product.imageUrl ? (
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                      <ImageIcon size={56} />
                    </div>
                  )}
                  {product.quantity < 5 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-xl z-10">
                      <AlertCircle size={14} /> ESTOQUE BAIXO
                    </div>
                  )}
                  {product.brand && (
                    <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm">
                      {product.brand}
                    </div>
                  )}
                </div>
                
                <div className="p-6 space-y-5">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 mb-1">
                        {product.sku && (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">
                            {product.sku}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-xl leading-tight line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-[0.15em] font-bold">{product.category}</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 text-muted-foreground hover:bg-slate-100 rounded-full transition-colors flex-shrink-0">
                          <MoreVertical size={24} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                        <DropdownMenuItem onClick={() => onSell(product.id)} className="text-accent font-black h-12 cursor-pointer rounded-xl">
                          <ShoppingBag size={18} className="mr-3" /> Registrar Venda
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(product)} className="h-12 cursor-pointer font-medium rounded-xl">
                          <Edit2 size={18} className="mr-3" /> Editar Produto
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive font-medium h-12 cursor-pointer rounded-xl" onClick={() => onDelete(product.id)}>
                          <Trash2 size={18} className="mr-3" /> Excluir do Sistema
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="px-4 py-1.5 rounded-xl text-xs font-bold">TAM: {product.size}</Badge>
                    <Badge variant="secondary" className="px-4 py-1.5 rounded-xl text-xs font-bold">COR: {product.color}</Badge>
                  </div>

                  <div className="pt-6 border-t flex justify-between items-center">
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${product.quantity < 5 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        Estoque
                      </span>
                      <p className={`text-2xl font-black ${product.quantity < 5 ? 'text-red-600' : 'text-foreground'}`}>
                        {product.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Preço Un.</span>
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
