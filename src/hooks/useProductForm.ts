
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useProducts';
import { ProductFormValues } from './products/types';
import { useProductPricing } from './products/useProductPricing';
import { useProductImages } from './products/useProductImages';
import { useProductFormDialogs } from './products/useProductFormDialogs';

export { ProductFormValues } from './products/types';

export function useProductForm() {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  
  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      description: '',
      costPrice: 0,
      salePrice: 0,
      category: '',
      brand: '',
      stock: 1,
      productType: 'external', // Default to external (for sale to customers)
    },
  });

  // Use the extracted pricing hook
  const { 
    profit, 
    profitMargin, 
    handleMarginChange, 
    handleSalePriceChange 
  } = useProductPricing(form);

  // Use the extracted images hook
  const { 
    selectedImages, 
    previewUrls, 
    handleImageUpload, 
    removeImage, 
    clearImages 
  } = useProductImages();

  // Use the extracted dialogs hook
  const { 
    isNewCategoryDialogOpen,
    isNewBrandDialogOpen,
    isNewSupplierDialogOpen,
    setIsNewCategoryDialogOpen,
    setIsNewBrandDialogOpen,
    setIsNewSupplierDialogOpen,
    handleAddCategory,
    handleAddBrand,
    handleAddSupplier
  } = useProductFormDialogs(form);

  // Reset the form
  const handleResetForm = () => {
    clearImages();
    form.reset({
      name: '',
      description: '',
      costPrice: 0,
      salePrice: 0,
      category: '',
      brand: '',
      stock: 1,
      supplier: '',
      productType: 'external',
    });
  };

  // Handle auto-fill
  const handleAutoFill = (productData: any) => {
    form.setValue('name', productData.name);
    form.setValue('description', productData.description);
    form.setValue('category', productData.category);
    form.setValue('brand', productData.brand);
    
    // Set cost price (if available)
    if (productData.cost) {
      form.setValue('costPrice', productData.cost);
    }
    
    // Set sale price
    form.setValue('salePrice', productData.price);
    
    // Update profit margin if we have both cost and price
    if (productData.cost && productData.price) {
      const newMargin = ((productData.price - productData.cost) / productData.cost) * 100;
      handleMarginChange(parseFloat(newMargin.toFixed(0)));
    }
  };

  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Map form data to product structure
      const productData = {
        name: data.name,
        description: data.description,
        category: data.category,
        brand: data.brand,
        price: data.salePrice,
        cost: data.costPrice > 0 ? data.costPrice : null,
        stock: data.stock
      };
      
      // Call the addProduct function from useProducts hook
      const result = await addProduct(productData);
      
      if (result.success) {
        toast.success("Produto adicionado com sucesso!");
        
        // Reset the form
        handleResetForm();
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/products');
        }, 2000);
      } else {
        toast.error(`Erro ao adicionar produto: ${result.error?.message || 'Erro desconhecido'}`);
      }
    } catch (error: any) {
      toast.error(`Erro ao adicionar produto: ${error.message}`);
    }
  };

  return {
    form,
    profit,
    profitMargin,
    selectedImages,
    previewUrls,
    isNewCategoryDialogOpen,
    isNewBrandDialogOpen,
    isNewSupplierDialogOpen,
    setIsNewCategoryDialogOpen,
    setIsNewBrandDialogOpen,
    setIsNewSupplierDialogOpen,
    handleMarginChange,
    handleSalePriceChange,
    handleImageUpload,
    removeImage,
    handleResetForm,
    handleAutoFill,
    handleAddCategory,
    handleAddBrand,
    handleAddSupplier,
    onSubmit: form.handleSubmit(onSubmit),
    navigate
  };
}
