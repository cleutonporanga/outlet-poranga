"use client";

import React, { useState } from 'react';
import { Product } from "@/lib/inventory-types";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MoreVertical, Edit2, Trash2, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InventoryTabProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function InventoryTab({ products, onEdit, onDelete }: InventoryTabProps) {
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
    <div className="p-4 space-y-4">
      <div className="sticky top-0 bg-background z-10 py-2 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            className="pl-10 h-12 bg-white shadow-sm border-none rounded-xl"
            placeholder="Buscar produtos..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <Badge 
            variant={!filterCategory ? "default" : "outline"} 
            className="cursor-pointer whitespace-nowrap px-4 py-1.5 rounded-full"
            onClick={() => setFilterCategory(null)}
          >
            Todos
          </Badge>
          {categories.map(cat => (
            <Badge 
              key={cat}
              variant={filterCategory === cat ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap px-4 py-1.5 rounded-full"
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Package className="mx-auto mb-2 opacity-20" size={48} />
            <p>Nenhum produto encontrado.</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <Card key={product.id} className="border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base leading-tight">{product.name}</h3>
                      {product.quantity < 5 && (
                        <AlertCircle size={14} className="text-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                    
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px] font-medium h-5">Tam: {product.size}</Badge>
                      <Badge variant="secondary" className="text-[10px] font-medium h-5">Cor: {product.color}</Badge>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 text-muted-foreground hover:bg-muted rounded-md mb-2">
                          <MoreVertical size={18} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Edit2 size={14} className="mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(product.id)}>
                          <Trash2 size={14} className="mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <span className="text-sm font-bold text-accent">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </span>
                    <span className={`text-xs font-semibold mt-1 ${product.quantity < 5 ? 'text-red-500' : 'text-muted-foreground'}`}>
                      Qtd: {product.quantity}
                    </span>
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

// Utility icon
function Package(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16.5 9.4 7.5 4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}
