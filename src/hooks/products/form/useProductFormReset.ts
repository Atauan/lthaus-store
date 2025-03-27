import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '../types';
import { Product } from '../useProductTypes';

/**
 * Hook for handling form reset functionality
 */
export function useProductFormReset(
  form: UseFormReturn<ProductFormValues>,
  isEditing: boolean,
  editProduct?: Product,
  clearImages?: () => void,
  setInitialProfitMargin?: (margin: number) => void
) {
  // Reset the form
  const handleResetForm = () => {
    if (clearImages) {
      clearImages();
    }
    
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
      
      if (editProduct.cost && editProduct.cost > 0 && setInitialProfitMargin) {
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

  return { handleResetForm };
}
