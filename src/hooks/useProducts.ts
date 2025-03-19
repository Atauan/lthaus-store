
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
          setProducts(data as unknown as Product[]);
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
        setProducts(prev => [...prev, data[0] as unknown as Product]);
        return { success: true, data: data[0] };
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
        .update(updatedProduct as any)
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
    deleteProduct
  };
}
