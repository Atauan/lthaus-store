
import { useState } from 'react';
import { Product } from '@/hooks/products/types';

export function useEditProductDialog() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<'price' | 'profit' | 'stock' | 'cost' | 'full'>('price');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editValue, setEditValue] = useState('');

  const openEditDialog = (type: 'price' | 'profit' | 'stock' | 'cost' | 'full', product: Product) => {
    setEditType(type);
    setSelectedProduct(product);
    
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

  return {
    editDialogOpen,
    setEditDialogOpen,
    editType,
    selectedProduct,
    editValue,
    setEditValue,
    openEditDialog
  };
}
