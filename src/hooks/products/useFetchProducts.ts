
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from './useProductTypes';
import { requestCache } from '@/utils/requestCache';

export function useFetchProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch products from the database
  const fetchProducts = useCallback(async (forceRefresh = false) => {
    try {
      const cacheKey = 'products_list';
      
      // Use cached data if available and not forcing refresh
      if (!forceRefresh) {
        const cachedProducts = requestCache.get(cacheKey);
        if (cachedProducts) {
          setProducts(cachedProducts as Product[]);
          setLoading(false);
          return;
        }
      }
      
      // If a request is already in progress, don't start another one
      if (requestCache.isLoading(cacheKey)) {
        return;
      }
      
      requestCache.setLoading(cacheKey);
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
          
      if (error) {
        throw error;
      }
      
      if (data) {
        // Cast data to Product[] to handle type compatibility
        const typedProducts = data as unknown as Product[];
        setProducts(typedProducts);
        requestCache.set(cacheKey, typedProducts);
      }
    } catch (error: any) {
      requestCache.logError(error, 'products_list', 'useFetchProducts');
      toast.error(`Erro ao carregar produtos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    setProducts,
    loading,
    refresh: useCallback(() => fetchProducts(true), [fetchProducts])
  };
}
