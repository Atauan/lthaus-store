
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ProductFormValues, Product } from '../useProductTypes';

type ProductOperations = {
  addProduct: (product: any, imageFile?: File) => Promise<any>;
  updateProduct: (product: Product, imageFile?: File) => Promise<any>;
};

/**
 * Hook for handling form submission logic
 */
export function useProductFormSubmit(
  form: UseFormReturn<ProductFormValues>,
  isEditing: boolean,
  editProduct: Product | undefined,
  selectedImages: File[],
  { addProduct, updateProduct }: ProductOperations,
  navigate: ReturnType<typeof useNavigate>,
  setIsSubmitting: (isSubmitting: boolean) => void
) {
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
        stock: data.stock,
        min_stock: data.minStock // Include min_stock field
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
    onSubmit: form.handleSubmit(onSubmit)
  };
}
