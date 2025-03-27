
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from './useProductTypes';
import { requestCache } from '@/utils/requestCache';

export function useProductSearch() {
  // Search products by name or description
  const searchProducts = async (query: string) => {
    try {
      const cacheKey = `search_products_${query}`;
      const cachedResult = requestCache.get(cacheKey);
      
      if (cachedResult) {
        return cachedResult;
      }
      
      if (requestCache.isLoading(cacheKey)) {
        // Request is already in progress
        return { success: true, data: [] as Product[] };
      }
      
      requestCache.setLoading(cacheKey);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
        
      if (error) {
        throw error;
      }
      
      const result = { success: true, data: data as Product[] };
      requestCache.set(cacheKey, result);
      return result;
    } catch (error: any) {
      toast.error(`Erro ao pesquisar produtos: ${error.message}`);
      return { success: false, error, data: [] as Product[] };
    }
  };

  // Get low stock products (less than 5 items)
  const getLowStockProducts = async () => {
    try {
      const cacheKey = 'low_stock_products';
      const cachedResult = requestCache.get(cacheKey);
      
      if (cachedResult) {
        return cachedResult;
      }
      
      if (requestCache.isLoading(cacheKey)) {
        // Request is already in progress
        return { success: true, data: [] as Product[] };
      }
      
      requestCache.setLoading(cacheKey);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .lt('stock', 5);
        
      if (error) {
        throw error;
      }
      
      const result = { success: true, data: data as Product[] };
      requestCache.set(cacheKey, result);
      return result;
    } catch (error: any) {
      toast.error(`Erro ao buscar produtos com estoque baixo: ${error.message}`);
      return { success: false, error, data: [] as Product[] };
    }
  };

  return {
    searchProducts,
    getLowStockProducts
  };
}
