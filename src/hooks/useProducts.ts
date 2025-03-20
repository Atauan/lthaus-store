
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useProductFilters } from './products/useProductFilters';
import { useProductLogs } from './products/useProductLogs';
import { useProductOperations } from './products/useProductOperations';
import { useProductSearch } from './products/useProductSearch';
import { Product, categories, brands } from './products/types';

// Re-export types from our types file
export type { Product, StockLog, CostChangeLog } from './products/types';
export { categories, brands } from './products/types';

export function useProducts() {
  const { session } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Use our smaller hooks
  const { 
    filteredProducts, 
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand
  } = useProductFilters(products);
  
  const {
    stockLogs,
    costChangeLogs,
    fetchStockLogs,
    fetchCostChangeLogs
  } = useProductLogs();
  
  const {
    addProduct,
    updateProduct,
    updateStock,
    deleteProduct
  } = useProductOperations(products, setProducts);
  
  const {
    searchProducts,
    getLowStockProducts
  } = useProductSearch();
  
  // Fetch products from the database - now works without any authentication
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
    
    fetchProducts();
  }, []);

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
    isAuthenticated: true // Always true now since we don't need authentication
  };
}
