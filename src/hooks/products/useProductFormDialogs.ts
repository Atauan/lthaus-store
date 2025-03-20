
import { useState } from 'react';
import { toast } from 'sonner';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from './types';

export function useProductFormDialogs(form: UseFormReturn<ProductFormValues>) {
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [isNewBrandDialogOpen, setIsNewBrandDialogOpen] = useState(false);
  const [isNewSupplierDialogOpen, setIsNewSupplierDialogOpen] = useState(false);

  // Add new category
  const handleAddCategory = (newCategory: string) => {
    console.log("New category to add:", newCategory);
    toast.success(`Categoria "${newCategory}" adicionada com sucesso!`);
    form.setValue('category', newCategory);
    setIsNewCategoryDialogOpen(false);
  };

  // Add new brand
  const handleAddBrand = (newBrand: string) => {
    console.log("New brand to add:", newBrand);
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
    handleAddSupplier
  };
}
