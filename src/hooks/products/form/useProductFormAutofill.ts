
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '../types';

/**
 * Hook for handling product auto-fill functionality
 */
export function useProductFormAutofill(
  form: UseFormReturn<ProductFormValues>,
  handleMarginChange?: (newMargin: number) => void
) {
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
    if (productData.cost && productData.price && handleMarginChange) {
      const newMargin = ((productData.price - productData.cost) / productData.cost) * 100;
      handleMarginChange(parseFloat(newMargin.toFixed(0)));
    }
  };

  return { handleAutoFill };
}
