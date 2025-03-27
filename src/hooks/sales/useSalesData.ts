
import { useState, useEffect, useCallback } from 'react';
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { Sale } from './types';
import { toast } from 'sonner';
import { requestCache } from '@/utils/requestCache';

export function useSalesData() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = useCallback(async (forceRefresh = false) => {
    try {
      const cacheKey = 'sales_list';
      
      // Use cached data if available and not forcing refresh
      if (!forceRefresh) {
        const cachedSales = requestCache.get(cacheKey);
        if (cachedSales) {
          setSales(cachedSales as Sale[]);
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
      
      // Implement retry logic with exponential backoff
      const maxRetries = 3;
      let retries = 0;
      let success = false;
      
      while (!success && retries < maxRetries) {
        try {
          const { data, error } = await supabase
            .from('sales')
            .select('*')
            .order('sale_date', { ascending: false });
            
          if (error) {
            throw error;
          }
          
          if (data) {
            const typedData = data as unknown as Sale[];
            setSales(typedData);
            requestCache.set(cacheKey, typedData);
            success = true;
          }
        } catch (error: any) {
          retries++;
          
          // Log the error
          requestCache.logError(error, cacheKey, 'useSalesData');
          
          if (retries >= maxRetries) {
            handleSupabaseError(error, "Erro ao carregar vendas");
            throw error;
          }
          
          // Exponential backoff
          const delay = Math.pow(2, retries) * 1000;
          console.log(`Retry ${retries}/${maxRetries} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch sales:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return {
    sales,
    setSales,
    loading,
    isAuthenticated: true, // Always return true to bypass authentication checks
    refresh: useCallback((forceRefresh = true) => fetchSales(forceRefresh), [fetchSales])
  };
}
