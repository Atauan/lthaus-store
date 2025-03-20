
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from './types';

export function useProductOperations(products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>>) {
  // Add a new product
  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Since user_id is required in the database, provide a default UUID for development
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...product,
          user_id: '00000000-0000-0000-0000-000000000000' // Default UUID for development
        })
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Add new product to state
        setProducts(prev => [...prev, data[0] as Product]);
        toast.success(`Produto "${product.name}" adicionado com sucesso!`);
        return { success: true, data: data[0] as Product };
      }
      
      return { success: false, error: new Error('Falha ao adicionar produto') };
    } catch (error: any) {
      toast.error(`Erro ao adicionar produto: ${error.message}`);
      return { success: false, error };
    }
  };

  // Update an existing product
  const updateProduct = async (updatedProduct: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('id', updatedProduct.id);
        
      if (error) {
        throw error;
      }
      
      // Update product in state
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
      
      toast.success(`Produto "${updatedProduct.name}" atualizado com sucesso!`);
      return { success: true };
    } catch (error: any) {
      toast.error(`Erro ao atualizar produto: ${error.message}`);
      return { success: false, error };
    }
  };

  // Update stock manually
  const updateStock = async (productId: number, newStock: number, notes: string = 'Atualização manual') => {
    try {
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        throw new Error('Produto não encontrado');
      }
      
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);
        
      if (error) {
        throw error;
      }
      
      // Update product in state
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === productId ? { ...p, stock: newStock } : p)
      );
      
      toast.success(`Estoque do produto "${product.name}" atualizado para ${newStock} unidades.`);
      
      // Stock log will be created automatically by the database trigger
      return { success: true };
    } catch (error: any) {
      toast.error(`Erro ao atualizar estoque: ${error.message}`);
      return { success: false, error };
    }
  };

  // Delete a product
  const deleteProduct = async (id: number) => {
    try {
      const product = products.find(p => p.id === id);
      
      if (!product) {
        throw new Error('Produto não encontrado');
      }
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Remove product from state
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      toast.success(`Produto "${product.name}" excluído com sucesso!`);
      return { success: true };
    } catch (error: any) {
      toast.error(`Erro ao excluir produto: ${error.message}`);
      return { success: false, error };
    }
  };

  return {
    addProduct,
    updateProduct,
    updateStock,
    deleteProduct
  };
}
