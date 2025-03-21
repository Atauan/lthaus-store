
export interface ProductFormValues {
  name: string;
  description: string;
  costPrice: number;
  salePrice: number;
  category: string;
  brand: string;
  stock: number;
  minStock: number; // Added minimum stock field
  supplier?: string;
  productType: 'internal' | 'external';
  image?: File;
}

export interface ProductImage {
  file: File;
  previewUrl: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  category: string;
  brand: string;
  price: number;
  cost?: number;
  stock: number;
  min_stock: number; // Database field name
  image?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  file?: File; // Add file property for temporary storage during editing
}

export interface StockLog {
  id: string;
  product_id: number;
  previous_stock: number;
  new_stock: number;
  change_amount: number;
  reference_type: string;
  reference_id?: string;
  notes?: string;
  created_at: string;
  product_name?: string; // For UI display
}

export interface CostChangeLog {
  id: string;
  product_id: number;
  previous_cost: number;
  new_cost: number;
  change_percentage: number;
  notes?: string;
  created_at: string;
  product_name?: string; // For UI display
}

export const categories = ['Todas', 'Cabos', 'Capas', 'Áudio', 'Carregadores', 'Proteção', 'Acessórios'];
export const brands = ['Todas', 'Apple', 'Samsung', 'Anker', 'JBL', 'Generic'];
