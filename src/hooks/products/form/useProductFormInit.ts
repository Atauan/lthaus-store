import { useEffect } from 'react';
import { Product } from '../useProductTypes';

/**
 * Hook for handling initial form setup, particularly for edited products
 */
export function useProductFormInit(
  isEditing: boolean,
  editProduct?: Product,
  setInitialProfitMargin?: (margin: number) => void
) {
  // Set initial profit margin when editing a product
  useEffect(() => {
    if (isEditing && editProduct && editProduct.cost && editProduct.cost > 0 && setInitialProfitMargin) {
      const initialMargin = ((editProduct.price - editProduct.cost) / editProduct.cost) * 100;
      setInitialProfitMargin(initialMargin);
    }
  }, [isEditing, editProduct, setInitialProfitMargin]);

  return {};
}
