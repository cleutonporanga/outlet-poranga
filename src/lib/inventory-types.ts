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
  description?: string;
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
};

export type InventoryStats = {
  totalProducts: number;
  lowStockCount: number;
  totalInventoryValue: number;
};
