
import { supabase } from '@/integrations/supabase/client';
import { SaleDetails } from '../types';
import { getFromCache, saveToCache } from '@/utils/requestCache';
import { handleRequestRateLimit } from '@/utils/rateLimiter';

export async function getSaleDetails(saleId: number): Promise<{ success: boolean; data: SaleDetails | null; error: any }> {
  try {
    // Check if rate limited
    if (handleRequestRateLimit(`saleDetails-${saleId}`)) {
      const cachedData = await getFromCache(`saleDetails-${saleId}`);
      if (cachedData) {
        console.log(`Using cached sale details for ID ${saleId} due to rate limiting`);
        return { success: true, data: cachedData as SaleDetails, error: null };
      } else {
        return { success: false, data: null, error: { message: 'Rate limited. No cached data available.' } };
      }
    }

    // Try to get from cache first
    const cachedData = await getFromCache(`saleDetails-${saleId}`);
    if (cachedData) {
      console.log(`Using cached sale details for ID ${saleId}`);
      return { success: true, data: cachedData as SaleDetails, error: null };
    }

    // Fetch sale details from database
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .select('*')
      .eq('id', saleId)
      .single();
    
    if (saleError) {
      throw saleError;
    }
    
    // Fetch sale items
    const { data: items, error: itemsError } = await supabase
      .from('sale_items')
      .select('*')
      .eq('sale_id', saleId);
    
    if (itemsError) {
      throw itemsError;
    }
    
    // Fetch payment methods
    const { data: payments, error: paymentsError } = await supabase
      .from('sale_payments')
      .select('*')
      .eq('sale_id', saleId);
    
    if (paymentsError) {
      throw paymentsError;
    }
    
    const saleDetails: SaleDetails = {
      sale,
      items: items || [],
      payments: payments || []
    };
    
    // Save to cache
    saveToCache(`saleDetails-${saleId}`, saleDetails);
    
    return { success: true, data: saleDetails, error: null };
  } catch (error: any) {
    console.error(`Error fetching sale details for ID ${saleId}:`, error);
    
    // Try to return cached data if available
    const cachedData = await getFromCache(`saleDetails-${saleId}`);
    if (cachedData) {
      console.log(`Using cached sale details for ID ${saleId} after error`);
      return { success: true, data: cachedData as SaleDetails, error: null };
    }
    
    return { 
      success: false, 
      data: null, 
      error: { 
        message: error.message || 'Erro ao buscar detalhes da venda' 
      } 
    };
  }
}
