
import { useState } from 'react';
import { toast } from 'sonner';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from './useProductTypes';
import { categories as initialCategories, brands as initialBrands } from './useProductTypes';

export function useProductFormDialogs(form: UseFormReturn<ProductFormValues>) {
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [isNewBrandDialogOpen, setIsNewBrandDialogOpen] = useState(false);
  const [isNewSupplierDialogOpen, setIsNewSupplierDialogOpen] = useState(false);
  
  // Create local state for categories and brands to allow adding new ones
  const [categories, setCategories] = useState<string[]>([...initialCategories.filter(cat => cat !== 'Todas')]);
  const [brands, setBrands] = useState<string[]>([...initialBrands.filter(brand => brand !== 'Todas')]);

  // Add new category
  const handleAddCategory = (newCategory: string) => {
    console.log("New category to add:", newCategory);
    
    // Add to local categories list if not already exists
    if (!categories.includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
    }
    
    toast.success(`Categoria "${newCategory}" adicionada com sucesso!`);
    form.setValue('category', newCategory);
    setIsNewCategoryDialogOpen(false);
  };

  // Add new brand
  const handleAddBrand = (newBrand: string) => {
    console.log("New brand to add:", newBrand);
    
    // Add to local brands list if not already exists
    if (!brands.includes(newBrand)) {
      setBrands(prev => [...prev, newBrand]);
    }
    
    toast.success(`Marca "${newBrand}" adicionada com sucesso!`);
    form.setValue('brand', newBrand);
    setIsNewBrandDialogOpen(false);
  };

  // Add new supplier
  const handleAddSupplier = (newSupplier: string) => {
    console.log("New supplier to add:", newSupplier);
    toast.success(`Fornecedor "${newSupplier}" adicionado com sucesso!`);
    form.setValue('supplier', newSupplier);
    setIsNewSupplierDialogOpen(false);
  };

  return {
    isNewCategoryDialogOpen,
    isNewBrandDialogOpen,
    isNewSupplierDialogOpen,
    setIsNewCategoryDialogOpen,
    setIsNewBrandDialogOpen,
    setIsNewSupplierDialogOpen,
    handleAddCategory,
    handleAddBrand,
    handleAddSupplier,
    categories,
    brands
  };
}
