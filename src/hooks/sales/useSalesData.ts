
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
          setSales(cachedSales);
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
        .from('sales')
        .select('*')
        .order('sale_date', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setSales(data as Sale[]);
        requestCache.set(cacheKey, data);
      }
    } catch (error: any) {
      toast.error(`Erro ao carregar vendas: ${error.message}`);
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
