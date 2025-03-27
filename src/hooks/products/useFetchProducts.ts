
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
        const cachedProducts = await requestCache.get(cacheKey);
        if (cachedProducts) {
          console.log('Using cached products data');
          setProducts(cachedProducts as Product[]);
          setLoading(false);
          return;
        }
      }
      
      // If a request is already in progress, don't start another one
      if (requestCache.isLoading(cacheKey)) {
        console.log('Products request already in progress');
        return;
      }
      
      requestCache.setLoading(cacheKey, true);
      setLoading(true);
      
      // Track this request for rate limiting
      requestCache.trackRequest('useFetchProducts');
      
      // Check if we should throttle this request
      if (requestCache.shouldThrottle()) {
        console.log('Throttling products request due to rate limiting');
        toast.warning('Muitas requisições! Aguarde um momento antes de tentar novamente.');
        setLoading(false);
        requestCache.setLoading(cacheKey, false);
        return;
      }
      
      // Implement retry logic with exponential backoff
      const maxRetries = 3;
      let retries = 0;
      let success = false;
      
      while (!success && retries < maxRetries) {
        try {
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
            success = true;
          }
        } catch (error: any) {
          retries++;
          console.log(`Retry ${retries}/${maxRetries} for products`);
          
          // Log the error
          requestCache.logError(error, cacheKey, 'useFetchProducts');
          
          if (retries >= maxRetries) {
            toast.error(`Erro ao carregar produtos: ${error.message}`);
            throw error;
          }
          
          // Exponential backoff
          const delay = Math.pow(2, retries) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    } catch (error: any) {
      requestCache.logError(error, 'products_list', 'useFetchProducts');
      toast.error(`Erro ao carregar produtos: ${error.message}`);
    } finally {
      setLoading(false);
      requestCache.setLoading('products_list', false);
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
