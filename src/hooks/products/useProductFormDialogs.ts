
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { ProductFormValues } from './types';
import { useCategoriesAndBrands } from './useCategoriesAndBrands';

export function useProductFormDialogs(form: UseFormReturn<ProductFormValues>) {
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [isNewBrandDialogOpen, setIsNewBrandDialogOpen] = useState(false);
  const [isNewSupplierDialogOpen, setIsNewSupplierDialogOpen] = useState(false);
  
  const { 
    categories, 
    brands,
    addCategory,
    addBrand
  } = useCategoriesAndBrands();

  const handleAddCategory = async (newCategory: string) => {
    try {
      const success = await addCategory(newCategory);
      if (success) {
        form.setValue('category', newCategory);
        toast.success(`Categoria "${newCategory}" adicionada com sucesso!`);
        setIsNewCategoryDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Erro ao adicionar categoria');
    }
  };

  const handleAddBrand = async (newBrand: string) => {
    try {
      const success = await addBrand(newBrand);
      if (success) {
        form.setValue('brand', newBrand);
        toast.success(`Marca "${newBrand}" adicionada com sucesso!`);
        setIsNewBrandDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding brand:', error);
      toast.error('Erro ao adicionar marca');
    }
  };

  const handleAddSupplier = async (supplierData: any) => {
    try {
      toast.success(`Fornecedor "${supplierData.name}" adicionado com sucesso!`);
      setIsNewSupplierDialogOpen(false);
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast.error('Erro ao adicionar fornecedor');
    }
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
