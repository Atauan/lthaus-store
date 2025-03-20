
export interface ProductFormValues {
  name: string;
  description: string;
  costPrice: number;
  salePrice: number;
  category: string;
  brand: string;
  stock: number;
  supplier?: string;
  productType: 'internal' | 'external';
}

export interface ProductImage {
  file: File;
  previewUrl: string;
}
