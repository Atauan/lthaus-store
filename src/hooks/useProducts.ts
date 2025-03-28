
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from './products/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setProducts(data as Product[]);
      }
    } catch (error: any) {
      toast.error(`Erro ao carregar produtos: ${error.message}`);
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Add a new product
  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Add the new product to the state
        setProducts([...products, data[0] as Product]);
        return { success: true, data: data[0] };
      }
      
      return { success: false, error: new Error('Failed to add product') };
    } catch (error: any) {
      console.error('Error adding product:', error);
      return { success: false, error };
    }
  };
  
  // Update an existing product
  const updateProduct = async (product: Product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', product.id)
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Update the product in the state
        setProducts(products.map(p => p.id === product.id ? data[0] as Product : p));
        return { success: true, data: data[0] };
      }
      
      return { success: false, error: new Error('Failed to update product') };
    } catch (error: any) {
      console.error('Error updating product:', error);
      return { success: false, error };
    }
  };
  
  // Delete a product
  const deleteProduct = async (id: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Remove the product from the state
      setProducts(products.filter(p => p.id !== id));
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting product:', error);
      return { success: false, error };
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get products with low stock
  const getLowStockProducts = useCallback(() => {
    const lowStock = products.filter(product => 
      product.stock <= product.min_stock
    );
    return { success: true, data: lowStock };
  }, [products]);

  return {
    products,
    loading,
    hasMore: false,
    loadMore: () => {},
    addProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    categories: ['Todas', 'Cabos', 'Capas', 'Áudio', 'Carregadores', 'Proteção', 'Acessórios'],
    brands: ['Todas', 'Apple', 'Samsung', 'Anker', 'JBL', 'Generic']
  };
}
