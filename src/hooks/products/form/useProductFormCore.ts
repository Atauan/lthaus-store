
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Product } from '../useProductTypes';
import type { ProductFormValues } from '../types';

/**
 * Core form initialization hook that handles the basic form setup
 */
export function useProductFormCore(editProduct?: Product, isEditing = false) {
  const navigate = useNavigate();
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

  return {
    form,
    navigate,
    isSubmitting,
    setIsSubmitting
  };
}
