
import { useState } from 'react';
import { Product } from '@/hooks/products/types';

export function useEditProductDialog(
  selectedProduct?: Product | null,
  editType?: 'price' | 'profit' | 'stock' | 'cost' | 'full',
  open?: boolean,
  onFullSave?: (updatedProduct: Product) => void
) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTypeState, setEditType] = useState<'price' | 'profit' | 'stock' | 'cost' | 'full'>('price');
  const [selectedProductState, setSelectedProduct] = useState<Product | null>(null);
  const [editValue, setEditValue] = useState('');
  const [fullEditProduct, setFullEditProduct] = useState<Product | null>(null);
  const [localIsTransitioning, setLocalIsTransitioning] = useState(false);

  // Use props if provided, otherwise use internal state
  const currentEditType = editType || editTypeState;
  const currentSelectedProduct = selectedProduct || selectedProductState;

  // Initialize full edit product when selectedProduct changes
  useState(() => {
    if (currentSelectedProduct && currentEditType === 'full') {
      setFullEditProduct({ ...currentSelectedProduct });
    }
  });

  const openEditDialog = (type: 'price' | 'profit' | 'stock' | 'cost' | 'full', product: Product) => {
    setEditType(type);
    setSelectedProduct(product);
    
    if (type === 'full') {
      setFullEditProduct({ ...product });
    }
    
    switch (type) {
      case 'price':
        setEditValue(product.price.toString());
        break;
      case 'stock':
        setEditValue(product.stock.toString());
        break;
      case 'cost':
        setEditValue((product.cost || 0).toString());
        break;
      case 'profit':
        if (product.cost && product.cost > 0) {
          const margin = ((product.price - product.cost) / product.cost) * 100;
          setEditValue(margin.toFixed(2));
        } else {
          setEditValue('0');
        }
        break;
      default:
        setEditValue('');
    }
    
    setEditDialogOpen(true);
  };

  const handleFullEditChange = (updatedProduct: Product) => {
    setFullEditProduct(updatedProduct);
  };

  const handleFullSave = () => {
    if (fullEditProduct && onFullSave) {
      onFullSave(fullEditProduct);
    }
  };

  return {
    editDialogOpen,
    setEditDialogOpen,
    editType: currentEditType,
    selectedProduct: currentSelectedProduct,
    editValue,
    setEditValue,
    openEditDialog,
    fullEditProduct,
    localIsTransitioning,
    setLocalIsTransitioning,
    handleFullEditChange,
    handleFullSave
  };
}
