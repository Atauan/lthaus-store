
import { useEffect, useState } from 'react';
import { Product } from '@/hooks/products/useProductTypes';

export function useEditProductDialog(
  selectedProduct: Product | null,
  editType: 'price' | 'profit' | 'stock' | 'cost' | 'full',
  open: boolean,
  onFullSave?: (updatedProduct: Product) => void,
) {
  const [fullEditProduct, setFullEditProduct] = useState<Product | null>(null);
  const [localIsTransitioning, setLocalIsTransitioning] = useState(false);

  // Reset state when dialog opens or closes
  useEffect(() => {
    if (!open) {
      // Add a small delay before cleaning up resources to ensure proper animation
      setTimeout(() => {
        setFullEditProduct(null);
        setLocalIsTransitioning(false);
      }, 300);
    } else if (editType === 'full' && selectedProduct) {
      setFullEditProduct({...selectedProduct});
    }
  }, [open, editType, selectedProduct]);

  const handleFullEditChange = (field: keyof Product, value: any) => {
    if (fullEditProduct) {
      setFullEditProduct({
        ...fullEditProduct,
        [field]: value
      });
    }
  };

  const handleFullSave = () => {
    if (fullEditProduct && onFullSave) {
      setLocalIsTransitioning(true);
      
      // Create a copy without the file property before saving
      // as it might not be needed in the API call
      const productToSave = { ...fullEditProduct };
      if ('file' in productToSave) {
        // The file property is only used for UI preview
        // and should not be part of the saved product
        const { file, ...rest } = productToSave;
        onFullSave(rest as Product);
      } else {
        onFullSave(productToSave);
      }
    }
  };

  return {
    fullEditProduct,
    localIsTransitioning,
    setLocalIsTransitioning,
    handleFullEditChange,
    handleFullSave
  };
}
