
import { useState } from 'react';
import { Product } from './useProductTypes';
import { useAddProduct } from './operations/useAddProduct';
import { useUpdateProduct } from './operations/useUpdateProduct';
import { useStockOperations } from './operations/useStockOperations';
import { useCostOperations } from './operations/useCostOperations';
import { useDeleteProduct } from './operations/useDeleteProduct';

export function useProductOperations(products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>>) {
  const { addProduct: addProductService } = useAddProduct();
  const { updateProduct: updateProductService } = useUpdateProduct();
  const { updateStock: updateStockService } = useStockOperations();
  const { updateCost: updateCostService } = useCostOperations();
  const { deleteProduct: deleteProductService } = useDeleteProduct();
  
  // Add a new product
  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>, imageFile?: File) => {
    const result = await addProductService(product, imageFile);
    
    if (result.success && result.data) {
      // Add new product to state
      setProducts(prev => [...prev, result.data as Product]);
    }
    
    return result;
  };

  // Update an existing product
  const updateProduct = async (updatedProduct: Product, imageFile?: File) => {
    const result = await updateProductService(updatedProduct, imageFile);
    
    if (result.success && result.data) {
      // Update product in state
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === updatedProduct.id ? result.data as Product : p)
      );
    }
    
    return result;
  };

  // Update stock manually
  const updateStock = async (productId: number, newStock: number, notes: string = 'Atualização manual') => {
    const result = await updateStockService(products, productId, newStock, notes);
    
    if (result.success && result.data) {
      // Update product in state
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === productId ? result.data as Product : p)
      );
    }
    
    return result;
  };

  // Update product cost
  const updateCost = async (productId: number, newCost: number) => {
    const result = await updateCostService(products, productId, newCost);
    
    if (result.success && result.data) {
      // Update product in state
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === productId ? result.data as Product : p)
      );
    }
    
    return result;
  };

  // Delete a product
  const deleteProduct = async (id: number) => {
    const result = await deleteProductService(products, id);
    
    if (result.success) {
      // Remove product from state
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    }
    
    return result;
  };

  return {
    addProduct,
    updateProduct,
    updateStock,
    updateCost,
    deleteProduct
  };
}
