
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

// Product data type
export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  cost?: number;
  stock: number;
  image: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export const categories = ['Todas', 'Cabos', 'Capas', 'Áudio', 'Carregadores', 'Proteção', 'Acessórios'];
export const brands = ['Todas', 'Apple', 'Samsung', 'Anker', 'JBL', 'Generic'];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  
  // Fetch products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setProducts(data as Product[]);
        }
      } catch (error: any) {
        toast.error(`Erro ao carregar produtos: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'Todas' || product.brand === selectedBrand;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Add a new product
  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setProducts(prev => [...prev, data[0] as Product]);
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
      
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
      
      return { success: true };
    } catch (error: any) {
      toast.error(`Erro ao atualizar produto: ${error.message}`);
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
      
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      return { success: true };
    } catch (error: any) {
      toast.error(`Erro ao excluir produto: ${error.message}`);
      return { success: false, error };
    }
  };

  // Search products by name or description
  const searchProducts = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
        
      if (error) {
        throw error;
      }
      
      return { success: true, data: data as Product[] };
    } catch (error: any) {
      toast.error(`Erro ao pesquisar produtos: ${error.message}`);
      return { success: false, error };
    }
  };

  // Get low stock products (less than 5 items)
  const getLowStockProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .lt('stock', 5);
        
      if (error) {
        throw error;
      }
      
      return { success: true, data: data as Product[] };
    } catch (error: any) {
      toast.error(`Erro ao buscar produtos com estoque baixo: ${error.message}`);
      return { success: false, error };
    }
  };

  return {
    products,
    filteredProducts,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getLowStockProducts
  };
}
