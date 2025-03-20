
import React, { createContext, useContext, ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Product } from '@/hooks/products/useProductTypes';
import { ProductFormValues } from '@/hooks/products/types';
import { useProductForm } from '@/hooks/useProductForm';
import { Supplier } from '@/hooks/products/useSuppliers';

// Define context type
type ProductFormContextType = {
  form: UseFormReturn<ProductFormValues>;
  profit: number;
  profitMargin: number;
  selectedImages: File[];
  previewUrls: string[];
  isNewCategoryDialogOpen: boolean;
  isNewBrandDialogOpen: boolean;
  isNewSupplierDialogOpen: boolean;
  setIsNewCategoryDialogOpen: (isOpen: boolean) => void;
  setIsNewBrandDialogOpen: (isOpen: boolean) => void;
  setIsNewSupplierDialogOpen: (isOpen: boolean) => void;
  handleMarginChange: (newMargin: number) => void;
  handleSalePriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  handleResetForm: () => void;
  handleAutoFill: (productData: any) => void;
  handleAddCategory: (newCategory: string) => Promise<void>;
  handleAddBrand: (newBrand: string) => Promise<void>;
  handleAddSupplier: (supplierData: {
    name: string;
    contactName?: string;
    phone?: string;
    email?: string;
    address?: string;
  }) => Promise<void>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  categories: string[];
  brands: string[];
  suppliers: Supplier[];
  isEditing: boolean;
};

// Create context with a default undefined value
const ProductFormContext = createContext<ProductFormContextType | undefined>(undefined);

// Props for the context provider
interface ProductFormProviderProps {
  children: ReactNode;
  product?: Product;
  isEditing?: boolean;
}

// Provider component that wraps the form
export const ProductFormProvider: React.FC<ProductFormProviderProps> = ({ 
  children, 
  product, 
  isEditing = false 
}) => {
  // Use the existing hook to get all form functionality
  const formProps = useProductForm(product, isEditing);
  
  // Provide the form context to all children
  return (
    <ProductFormContext.Provider value={{ ...formProps, isEditing }}>
      {children}
    </ProductFormContext.Provider>
  );
};

// Custom hook to use the form context
export function useProductFormContext() {
  const context = useContext(ProductFormContext);
  
  if (context === undefined) {
    throw new Error('useProductFormContext must be used within a ProductFormProvider');
  }
  
  return context;
}
