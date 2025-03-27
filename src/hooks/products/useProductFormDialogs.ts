import { useState } from 'react';
import { toast } from 'sonner';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from './useProductTypes';
import { useCategoriesAndBrands } from './useCategoriesAndBrands';
import { useSuppliers, Supplier } from './useSuppliers';

export function useProductFormDialogs(form: UseFormReturn<ProductFormValues>) {
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [isNewBrandDialogOpen, setIsNewBrandDialogOpen] = useState(false);
  const [isNewSupplierDialogOpen, setIsNewSupplierDialogOpen] = useState(false);
  
  // Use our new hooks
  const { categories, brands, addCategory, addBrand } = useCategoriesAndBrands();
  const { addSupplier } = useSuppliers();

  // Add new category
  const handleAddCategory = async (newCategory: string) => {
    console.log("New category to add:", newCategory);
    
    const result = await addCategory(newCategory);
    
    if (result) {
      toast.success(`Categoria "${newCategory}" adicionada com sucesso!`);
      form.setValue('category', newCategory);
      setIsNewCategoryDialogOpen(false);
    }
  };

  // Add new brand
  const handleAddBrand = async (newBrand: string) => {
    console.log("New brand to add:", newBrand);
    
    const result = await addBrand(newBrand);
    
    if (result) {
      toast.success(`Marca "${newBrand}" adicionada com sucesso!`);
      form.setValue('brand', newBrand);
      setIsNewBrandDialogOpen(false);
    }
  };

  // Add new supplier
  const handleAddSupplier = async (supplierData: {
    name: string;
    contactName?: string;
    phone?: string;
    email?: string;
    address?: string;
  }) => {
    console.log("New supplier to add:", supplierData);
    
    const result = await addSupplier({
      name: supplierData.name,
      contact_name: supplierData.contactName,
      phone: supplierData.phone,
      email: supplierData.email,
      address: supplierData.address
    });
    
    if (result.success) {
      toast.success(`Fornecedor "${supplierData.name}" adicionado com sucesso!`);
      form.setValue('supplier', supplierData.name);
      setIsNewSupplierDialogOpen(false);
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
