
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Product } from '../types';

export function useProductFormInit(
  isEditing: boolean,
  editProduct: Product | undefined,
  setInitialProfitMargin: (product: Product) => void
) {
  useEffect(() => {
    if (isEditing && editProduct) {
      setInitialProfitMargin(editProduct);
    }
  }, [isEditing, editProduct, setInitialProfitMargin]);
}
