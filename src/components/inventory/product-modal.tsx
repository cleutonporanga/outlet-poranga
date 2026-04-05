"use client";

import React, { useState, useEffect, useRef } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/lib/inventory-types";
import { Sparkles, Loader2, Camera, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { generateProductDescription } from "@/ai/flows/generate-product-description-flow";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
  editingProduct?: Product;
}

const SIZES = ["PP", "P", "M", "G", "GG", "38", "40", "42", "44", "46"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB permitido para seleção, mas será comprimido

export function ProductModal({ isOpen, onClose, onSave, editingProduct }: ProductModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    size: '',
    color: '',
    quantity: 0,
    price: undefined,
    costPrice: undefined,
    description: '',
    imageUrl: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        price: undefined,
        costPrice: undefined,
        description: '',
        imageUrl: '',
      });
    }
    setImageError(null);
  }, [editingProduct, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setImageError("A imagem é muito grande. Escolha uma foto menor que 10MB.");
        return;
      }

      setIsProcessingImage(true);
      setImageError(null);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          // Manter proporção
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Comprimir como JPEG com qualidade 0.7 para garantir que caiba no Firestore
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setFormData(prev => ({ ...prev, imageUrl: dataUrl }));
          setIsProcessingImage(false);
        };
        img.onerror = () => {
          setImageError("Erro ao carregar imagem.");
          setIsProcessingImage(false);
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => {
        setImageError("Erro ao ler arquivo.");
        setIsProcessingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAI = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const result = await generateProductDescription({
        name: formData.name,
        category: formData.category,
        size: formData.size,
        color: formData.color,
        photoDataUri: formData.imageUrl || undefined,
      });
      
      setFormData(prev => ({ 
        ...prev, 
        name: result.suggestedName || prev.name,
        category: result.suggestedCategory || prev.category,
        color: result.suggestedColor || prev.color,
      }));
      toast({ title: "Sugestões aplicadas", description: "O assistente preencheu os campos com base na foto." });
    } catch (error) {
      toast({ 
        title: "Falha na IA", 
        description: "Não foi possível gerar sugestões no momento.",
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast({ 
        title: "Campos obrigatórios", 
        description: "Por favor, preencha o nome e a categoria.",
        variant: "destructive" 
      });
      return;
    }

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
            <div className="flex justify-between items-center mb-1">
              <Label>Foto do Produto</Label>
              {formData.imageUrl && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-accent gap-1 font-bold p-0 px-2"
                  disabled={isGenerating || isProcessingImage}
                  onClick={handleGenerateAI}
                >
                  {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  Sugerir Dados
                </Button>
              )}
            </div>
            <div 
              className={`relative w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center bg-white cursor-pointer overflow-hidden group transition-colors ${imageError ? 'border-destructive' : 'border-muted'}`}
              onClick={() => !isProcessingImage && fileInputRef.current?.click()}
            >
              {isProcessingImage ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-accent" size={24} />
                  <p className="text-xs text-muted-foreground">Otimizando...</p>
                </div>
              ) : formData.imageUrl ? (
                <>
                  <Image 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    fill 
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white" size={32} />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full h-8 w-8 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(prev => ({ ...prev, imageUrl: '' }));
                    }}
                  >
                    <X size={14} />
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-3 bg-muted rounded-full mb-2">
                    <ImageIcon className="text-muted-foreground" size={24} />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Toque para adicionar foto</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
            </div>
            {imageError && (
              <p className="text-[10px] text-destructive flex items-center gap-1 mt-1">
                <AlertCircle size={10} /> {imageError}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground">Otimização automática ativada (máx 10MB)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto *</Label>
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
              <Label htmlFor="category">Categoria *</Label>
              <Input 
                id="category" 
                required
                placeholder="Ex: Camisetas"
                className="rounded-xl h-12 border-none shadow-sm bg-white"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
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
              <Label htmlFor="quantity">Estoque Inicial</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">Preço de Custo (R$)</Label>
              <Input 
                id="costPrice" 
                type="number" 
                step="0.01"
                min="0"
                required
                className="rounded-xl h-12 border-none shadow-sm bg-white"
                value={formData.costPrice ?? ''}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço de Venda (R$)</Label>
              <Input 
                id="price" 
                type="number" 
                step="0.01"
                min="0"
                required
                className="rounded-xl h-12 border-none shadow-sm bg-white"
                value={formData.price ?? ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <DialogFooter className="pt-4 gap-2 sm:flex-col">
            <Button 
              type="submit" 
              className="h-12 w-full rounded-xl font-bold bg-accent hover:bg-accent/90 text-white"
              disabled={isProcessingImage}
            >
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
