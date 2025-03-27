
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { Sale } from '../types';
import { requestCache } from '@/utils/requestCache';

export async function fetchSales(): Promise<{ data: Sale[] | null; error: any }> {
  try {
    const cacheKey = 'sales_list';
    
    // Check if data is in cache
    const cachedData = requestCache.get(cacheKey);
    if (cachedData) {
      return { data: cachedData as Sale[], error: null };
    }
    
    // If request is already in progress, don't start another one
    if (requestCache.isLoading(cacheKey)) {
      return { data: null, error: "Request already in progress" };
    }
    
    requestCache.setLoading(cacheKey);
    
    // Implement retry logic with exponential backoff
    const maxRetries = 3;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        const { data, error } = await supabase
          .from('sales')
          .select('*')
          .order('sale_date', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          // Type assertion to ensure compatibility
          const typedData = data as unknown as Sale[];
          requestCache.set(cacheKey, typedData);
          return { data: typedData, error: null };
        }
        
        return { data: null, error: "No data returned" };
      } catch (error: any) {
        retries++;
        
        // Log the error
        requestCache.logError(error, cacheKey, 'fetchSales');
        
        if (retries >= maxRetries) {
          handleSupabaseError(error, "Erro ao carregar vendas");
          return { data: null, error };
        }
        
        // Exponential backoff
        const delay = Math.pow(2, retries) * 1000;
        console.log(`Retry ${retries}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return { data: null, error: "Max retries exceeded" };
  } catch (error: any) {
    // Log the error
    requestCache.logError(error, 'sales_list', 'fetchSales');
    handleSupabaseError(error, "Erro ao carregar vendas");
    return { data: null, error };
  } finally {
    // Clear loading state if it's still set
    const entry = cache['sales_list'];
    if (entry?.loading) {
      entry.loading = false;
    }
  }
}
