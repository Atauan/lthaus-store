
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Product data type
export interface Product {
  id: number;
  name: string;
  description?: string;
  category: string;
  brand: string;
  price: number;
  cost?: number;
  stock: number;
  image?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface StockLog {
  id: string;
  product_id: number;
  previous_stock: number;
  new_stock: number;
  change_amount: number;
  reference_type: string;
  reference_id?: string;
  notes?: string;
  created_at: string;
  user_id: string;
  product_name?: string; // For UI display
}

export interface CostChangeLog {
  id: string;
  product_id: number;
  previous_cost: number;
  new_cost: number;
  change_percentage: number;
  notes?: string;
  created_at: string;
  user_id: string;
  product_name?: string; // For UI display
}

export const categories = ['Todas', 'Cabos', 'Capas', 'Áudio', 'Carregadores', 'Proteção', 'Acessórios'];
export const brands = ['Todas', 'Apple', 'Samsung', 'Anker', 'JBL', 'Generic'];

export function useProducts() {
  const { session } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [costChangeLogs, setCostChangeLogs] = useState<CostChangeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  
  // Fetch products from the database
  useEffect(() => {
    const fetchProducts = async () => {
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
      } finally {
        setLoading(false);
      }
    };
    
    if (session) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [session]);
  
  // Fetch stock logs
  const fetchStockLogs = useCallback(async () => {
    try {
      setLoading(true);
      
      // First get all stock logs
      const { data: logsData, error: logsError } = await supabase
        .from('stock_logs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (logsError) throw logsError;
      
      // Get product names for display
      const productIds = [...new Set(logsData.map(log => log.product_id))];
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name')
        .in('id', productIds);
        
      if (productsError) throw productsError;
      
      // Create a map of product IDs to names
      const productMap = Object.fromEntries(
        productsData.map(product => [product.id, product.name])
      );
      
      // Combine the data
      const logsWithProductNames = logsData.map(log => ({
        ...log,
        product_name: productMap[log.product_id] || 'Produto Desconhecido'
      }));
      
      setStockLogs(logsWithProductNames);
      
      return logsWithProductNames;
    } catch (error: any) {
      toast.error(`Erro ao carregar histórico de estoque: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch cost change logs
  const fetchCostChangeLogs = useCallback(async () => {
    try {
      setLoading(true);
      
      // First get all cost change logs
      const { data: logsData, error: logsError } = await supabase
        .from('cost_change_logs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (logsError) throw logsError;
      
      // Get product names for display
      const productIds = [...new Set(logsData.map(log => log.product_id))];
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name')
        .in('id', productIds);
        
      if (productsError) throw productsError;
      
      // Create a map of product IDs to names
      const productMap = Object.fromEntries(
        productsData.map(product => [product.id, product.name])
      );
      
      // Combine the data
      const logsWithProductNames = logsData.map(log => ({
        ...log,
        product_name: productMap[log.product_id] || 'Produto Desconhecido'
      }));
      
      setCostChangeLogs(logsWithProductNames);
      
      return logsWithProductNames;
    } catch (error: any) {
      toast.error(`Erro ao carregar histórico de alterações de custo: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'Todas' || product.brand === selectedBrand;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Add a new product
  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...product,
          user_id: user.id
        }])
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
    stockLogs,
    costChangeLogs,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    addProduct,
    updateProduct,
    updateStock,
    deleteProduct,
    searchProducts,
    getLowStockProducts,
    fetchStockLogs,
    fetchCostChangeLogs,
    isAuthenticated: !!session
  };
}
