"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/lib/inventory-types";
import { Sparkles, Loader2 } from "lucide-react";
import { generateProductDescription } from "@/ai/flows/generate-product-description-flow";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
  editingProduct?: Product;
}

const CATEGORIES = ["Camisetas", "Calças", "Vestidos", "Casacos", "Acessórios", "Sapatos", "Intima"];
const SIZES = ["PP", "P", "M", "G", "GG", "38", "40", "42", "44", "46"];

export function ProductModal({ isOpen, onClose, onSave, editingProduct }: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    size: '',
    color: '',
    quantity: 0,
    price: 0,
    description: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
    } else {
      setFormData({
        name: '',
        category: '',
        size: '',
        color: '',
        quantity: 0,
        price: 0,
        description: '',
      });
    }
  }, [editingProduct, isOpen]);

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.category) return;

    setIsGenerating(true);
    try {
      const result = await generateProductDescription({
        name: formData.name,
        category: formData.category,
        size: formData.size,
        color: formData.color,
      });
      setFormData(prev => ({ ...prev, description: result.description }));
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-6 bg-background max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input 
              id="name" 
              required
              className="rounded-xl h-12 border-none shadow-sm bg-white"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger className="rounded-xl h-12 border-none shadow-sm bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Tamanho</Label>
              <Select 
                value={formData.size} 
                onValueChange={(v) => setFormData({ ...formData, size: v })}
              >
                <SelectTrigger className="rounded-xl h-12 border-none shadow-sm bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Input 
                id="color" 
                className="rounded-xl h-12 border-none shadow-sm bg-white"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input 
                id="quantity" 
                type="number"
                min="0"
                required
                className="rounded-xl h-12 border-none shadow-sm bg-white"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço Unitário (R$)</Label>
            <Input 
              id="price" 
              type="number" 
              step="0.01"
              required
              className="rounded-xl h-12 border-none shadow-sm bg-white"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="description">Descrição</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 text-accent gap-1 font-semibold"
                disabled={!formData.name || !formData.category || isGenerating}
                onClick={handleGenerateDescription}
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Gerar com IA
              </Button>
            </div>
            <Textarea 
              id="description" 
              rows={3}
              placeholder="Descreva o produto..."
              className="rounded-xl border-none shadow-sm bg-white resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <DialogFooter className="pt-4 gap-2 sm:flex-col">
            <Button type="submit" className="h-12 w-full rounded-xl font-bold bg-accent hover:bg-accent/90">
              {editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose} className="h-12 w-full rounded-xl">
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
