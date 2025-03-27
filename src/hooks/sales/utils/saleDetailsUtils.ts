
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SaleDetails, SaleItem } from '../types';
import { requestCache } from '@/utils/requestCache';

export async function getSaleDetails(saleId: number): Promise<{ success: boolean; data?: SaleDetails; error?: any }> {
  try {
    const cacheKey = `sale_details_${saleId}`;
    
    // Check if data is in cache
    const cachedData = requestCache.get(cacheKey);
    if (cachedData) {
      return { success: true, data: cachedData };
    }
    
    // If request is already in progress, don't start another one
    if (requestCache.isLoading(cacheKey)) {
      return { success: false, error: "Request already in progress" };
    }
    
    requestCache.setLoading(cacheKey);
    
    // Implement retry logic with exponential backoff
    const maxRetries = 3;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        const { data: saleData, error: saleError } = await supabase
          .from('sales')
          .select('*')
          .eq('id', saleId)
          .single();
          
        if (saleError) throw saleError;
        
        const { data: itemsData, error: itemsError } = await supabase
          .from('sale_items')
          .select('*')
          .eq('sale_id', saleId);
          
        if (itemsError) throw itemsError;
        
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('sale_payments')
          .select('*')
          .eq('sale_id', saleId);
          
        if (paymentsError) throw paymentsError;
        
        // Validate and normalize the status field
        if (saleData.status && !['completed', 'revoked', 'pending'].includes(saleData.status)) {
          console.warn(`Unknown sale status: ${saleData.status}, defaulting to 'completed'`);
          saleData.status = 'completed';
        }
        
        // Map the items data to the format expected by SaleItem
        const mappedItems: SaleItem[] = (itemsData || []).map(item => ({
          id: item.id,
          sale_id: item.sale_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          cost: item.cost,
          created_at: item.created_at,
          name: `Produto #${item.product_id}`, // Default name
          type: 'product' // Default type
        }));
        
        const result = {
          sale: saleData,
          items: mappedItems,
          payments: paymentsData || []
        };
        
        // Save to cache
        requestCache.set(cacheKey, result);
        
        return {
          success: true,
          data: result
        };
      } catch (error: any) {
        retries++;
        
        if (retries >= maxRetries) {
          handleSupabaseError(error, "Erro ao carregar detalhes da venda");
          return { success: false, error };
        }
        
        // Exponential backoff
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return { success: false, error: "Max retries exceeded" };
  } catch (error: any) {
    handleSupabaseError(error, "Erro ao carregar detalhes da venda");
    return { success: false, error };
  }
}
