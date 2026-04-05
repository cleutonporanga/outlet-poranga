export type ProductVariation = {
  size: string;
  color: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  costPrice: number;
  description?: string;
  imageUrl?: string;
  createdAt: string;
};

export type MovementType = 'entrada' | 'saída';

export type Movement = {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  date: string;
  unitPrice: number;
  unitCost: number;
};

export type InventoryStats = {
  totalProducts: number;
  lowStockCount: number;
  totalInventoryValue: number;
  totalProfit: number;
};
