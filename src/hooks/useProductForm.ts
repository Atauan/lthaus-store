import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useProducts';
import { useProductPricing } from './products/useProductPricing';
import { useProductImages } from './products/useProductImages';
import { useProductFormDialogs } from './products/useProductFormDialogs';
import { useSuppliers, Supplier } from './products/useSuppliers';
import type { ProductFormValues } from './products/types';
import { Product } from './products/useProductTypes';

// Re-export the type with the 'export type' syntax
export type { ProductFormValues } from './products/types';

export function useProductForm(editProduct?: Product, isEditing = false) {
  const navigate = useNavigate();
  const { addProduct, updateProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values or edit product data
  const form = useForm<ProductFormValues>({
    defaultValues: isEditing && editProduct 
      ? {
          name: editProduct.name,
          description: editProduct.description || '',
          costPrice: editProduct.cost || 0,
          salePrice: editProduct.price,
          category: editProduct.category,
          brand: editProduct.brand,
          stock: editProduct.stock,
          productType: 'external', // Default to external (for sale to customers)
        } 
      : {
          name: '',
          description: '',
          costPrice: 0,
          salePrice: 0,
          category: '',
          brand: '',
          stock: 1,
          productType: 'external',
        },
  });

  // Use the extracted pricing hook
  const { 
    profit, 
    profitMargin, 
    handleMarginChange, 
    handleSalePriceChange,
    setInitialProfitMargin
  } = useProductPricing(form);

  // Set initial profit margin when editing a product
  useEffect(() => {
    if (isEditing && editProduct && editProduct.cost && editProduct.cost > 0) {
      const initialMargin = ((editProduct.price - editProduct.cost) / editProduct.cost) * 100;
      setInitialProfitMargin(initialMargin);
    }
  }, [isEditing, editProduct, setInitialProfitMargin]);

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
    handleAddSupplier,
    categories,
    brands
  } = useProductFormDialogs(form);

  // Use the suppliers hook
  const { suppliers } = useSuppliers();

  // Reset the form
  const handleResetForm = () => {
    clearImages();
    if (isEditing && editProduct) {
      // Reset to original product values
      form.reset({
        name: editProduct.name,
        description: editProduct.description || '',
        costPrice: editProduct.cost || 0,
        salePrice: editProduct.price,
        category: editProduct.category,
        brand: editProduct.brand,
        stock: editProduct.stock,
        supplier: '',
        productType: 'external',
      });
      
      if (editProduct.cost && editProduct.cost > 0) {
        const initialMargin = ((editProduct.price - editProduct.cost) / editProduct.cost) * 100;
        setInitialProfitMargin(initialMargin);
      }
    } else {
      // Reset to empty values for new product
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
    }
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
      setIsSubmitting(true);
      
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
      
      // Get the image file from the first selected image if available
      const imageFile = selectedImages.length > 0 ? selectedImages[0] : undefined;
      
      let result;
      
      if (isEditing && editProduct) {
        // Update existing product
        const updatedProduct = {
          ...productData,
          id: editProduct.id,
          // Keep existing image if not uploading a new one
          image: editProduct.image,
          image_url: editProduct.image_url
        };
        
        result = await updateProduct(updatedProduct, imageFile);
        
        if (result.success) {
          toast.success("Produto atualizado com sucesso!");
          
          // Redirect after 2 seconds
          setTimeout(() => {
            navigate('/products');
          }, 2000);
        } else {
          toast.error(`Erro ao atualizar produto: ${result.error?.message || 'Erro desconhecido'}`);
        }
      } else {
        // Add new product
        result = await addProduct(productData, imageFile);
        
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
      }
    } catch (error: any) {
      toast.error(`Erro ao ${isEditing ? 'atualizar' : 'adicionar'} produto: ${error.message}`);
    } finally {
      setIsSubmitting(false);
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
    navigate,
    isSubmitting,
    categories,
    brands,
    suppliers
  };
}
