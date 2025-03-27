
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from './useProductTypes';
import { requestCache } from '@/utils/requestCache';

export function useProductSearch() {
  // Search products by name or description
  const searchProducts = async (query: string) => {
    try {
      const cacheKey = `search_products_${query}`;
      const cachedResult = await requestCache.get(cacheKey);
      
      if (cachedResult) {
        console.log('Using cached search results');
        return cachedResult;
      }
      
      if (requestCache.isLoading(cacheKey)) {
        // Request is already in progress
        console.log('Search request already in progress');
        return { success: true, data: [] as Product[] };
      }
      
      requestCache.setLoading(cacheKey, true);
      
      // Track this request for rate limiting
      requestCache.trackRequest('searchProducts');
      
      // Check if we should throttle this request
      if (requestCache.shouldThrottle()) {
        console.log('Throttling search request due to rate limiting');
        toast.warning('Muitas requisições! Aguarde um momento antes de tentar novamente.');
        requestCache.setLoading(cacheKey, false);
        return { success: true, data: [] as Product[] };
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
        
      if (error) {
        throw error;
      }
      
      // Type casting to ensure compatibility
      const typedData = data as unknown as Product[];
      const result = { success: true, data: typedData };
      requestCache.set(cacheKey, result);
      requestCache.setLoading(cacheKey, false);
      return result;
    } catch (error: any) {
      requestCache.logError(error, `search_products_${query}`, 'searchProducts');
      toast.error(`Erro ao pesquisar produtos: ${error.message}`);
      return { success: false, error, data: [] as Product[] };
    }
  };

  // Get low stock products (less than 5 items)
  const getLowStockProducts = async () => {
    try {
      const cacheKey = 'low_stock_products';
      const cachedResult = await requestCache.get(cacheKey);
      
      if (cachedResult) {
        console.log('Using cached low stock products');
        return cachedResult;
      }
      
      if (requestCache.isLoading(cacheKey)) {
        // Request is already in progress
        console.log('Low stock products request already in progress');
        return { success: true, data: [] as Product[] };
      }
      
      requestCache.setLoading(cacheKey, true);
      
      // Track this request for rate limiting
      requestCache.trackRequest('getLowStockProducts');
      
      // Check if we should throttle this request
      if (requestCache.shouldThrottle()) {
        console.log('Throttling low stock request due to rate limiting');
        toast.warning('Muitas requisições! Aguarde um momento antes de tentar novamente.');
        requestCache.setLoading(cacheKey, false);
        return { success: true, data: [] as Product[] };
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .lt('stock', 5);
        
      if (error) {
        throw error;
      }
      
      // Type casting to ensure compatibility
      const typedData = data as unknown as Product[];
      const result = { success: true, data: typedData };
      requestCache.set(cacheKey, result);
      requestCache.setLoading(cacheKey, false);
      return result;
    } catch (error: any) {
      requestCache.logError(error, 'low_stock_products', 'getLowStockProducts');
      toast.error(`Erro ao buscar produtos com estoque baixo: ${error.message}`);
      return { success: false, error, data: [] as Product[] };
    }
  };

  return {
    searchProducts,
    getLowStockProducts
  };
}
