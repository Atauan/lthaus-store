
import { supabase } from '@/integrations/supabase/client';
import { Sale } from '../types';
import { toast } from 'sonner';
import { getFromCache, saveToCache } from '@/utils/requestCache';
import { handleRequestRateLimit } from '@/utils/rateLimiter';

export async function fetchSales(): Promise<{ data: Sale[] | null; error: any }> {
  try {
    // Check if rate limited
    if (handleRequestRateLimit('fetchSales')) {
      const cachedData = await getFromCache('sales');
      if (cachedData) {
        console.log('Using cached sales data due to rate limiting');
        return { data: cachedData as Sale[], error: null };
      } else {
        return { data: [], error: { message: 'Rate limited. No cached data available.' } };
      }
    }

    // Try to get from cache first
    const cachedData = await getFromCache('sales');
    if (cachedData) {
      console.log('Using cached sales data');
      return { data: cachedData as Sale[], error: null };
    }

    // If not in cache, fetch from Supabase
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('sale_date', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    // Save to cache
    if (data) {
      saveToCache('sales', data);
    }
    
    return { data: data as Sale[], error: null };
  } catch (error: any) {
    console.error('Error fetching sales:', error);
    toast.error(`Erro ao carregar vendas: ${error.message}`);
    
    // Try to return cached data if available
    const cachedData = await getFromCache('sales');
    if (cachedData) {
      console.log('Using cached sales data after error');
      return { data: cachedData as Sale[], error: null };
    }
    
    return { data: null, error };
  }
}
