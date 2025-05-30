
import { UseFormReturn } from 'react-hook-form';
import { Product } from '../types';

export function useProductFormReset(
  form: UseFormReturn<any>,
  isEditing: boolean,
  editProduct: Product | undefined,
  clearImages: () => void,
  setInitialProfitMargin: (product?: Product) => void
) {
  const handleResetForm = () => {
    if (isEditing && editProduct) {
      // Reset to original product data
      form.reset({
        name: editProduct.name,
        description: editProduct.description || '',
        costPrice: editProduct.cost || 0,
        salePrice: editProduct.price,
        category: editProduct.category,
        brand: editProduct.brand,
        stock: editProduct.stock,
        minStock: editProduct.min_stock || 5,
        productType: 'external',
      });
      setInitialProfitMargin(editProduct);
    } else {
      // Reset to default values for new product
      form.reset({
        name: '',
        description: '',
        costPrice: 0,
        salePrice: 0,
        category: '',
        brand: '',
        stock: 1,
        minStock: 5,
        productType: 'external',
      });
      clearImages();
      setInitialProfitMargin();
    }
  };

  return { handleResetForm };
}
