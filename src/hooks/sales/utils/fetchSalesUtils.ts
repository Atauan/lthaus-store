
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { Sale } from '../types';
import { requestCache } from '@/utils/requestCache';

export async function fetchSales(): Promise<{ data: Sale[] | null; error: any }> {
  try {
    const cacheKey = 'sales_list';
    
    // Check if data is in cache
    const cachedData = requestCache.get(cacheKey);
    if (cachedData) {
      return { data: cachedData, error: null };
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
          requestCache.set(cacheKey, data);
          return { data: data as Sale[], error: null };
        }
        
        return { data: null, error: "No data returned" };
      } catch (error: any) {
        retries++;
        
        if (retries >= maxRetries) {
          handleSupabaseError(error, "Erro ao carregar vendas");
          return { data: null, error };
        }
        
        // Exponential backoff
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return { data: null, error: "Max retries exceeded" };
  } catch (error: any) {
    handleSupabaseError(error, "Erro ao carregar vendas");
    return { data: null, error };
  }
}
