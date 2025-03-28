
import { supabase } from '@/integrations/supabase/client';
import { Sale, SaleDetails } from '../types';
import { toast } from 'sonner';
import { getFromCache, saveToCache } from '@/utils/requestCache';
import { handleRequestRateLimit } from '@/utils/rateLimiter';

export const getSaleDetails = async (saleId: number): Promise<{ success: boolean; data?: SaleDetails; error?: string }> => {
  try {
    // Check rate limit
    if (!handleRequestRateLimit(`getSaleDetails_${saleId}`)) {
      const cachedData = getFromCache<SaleDetails>(`sale_${saleId}`, 60 * 1000);
      if (cachedData) {
        return { success: true, data: cachedData };
      }
      return { success: false, error: 'Taxa de requisições excedida. Tente novamente em alguns instantes.' };
    }

    // Try to get from cache first
    const cachedData = getFromCache<SaleDetails>(`sale_${saleId}`, 5 * 60 * 1000); // 5 minutes cache
    if (cachedData) {
      return { success: true, data: cachedData };
    }

    // Get sale details
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .select('*')
      .eq('id', saleId)
      .single();

    if (saleError) {
      return { success: false, error: saleError.message };
    }

    if (!sale) {
      return { success: false, error: 'Venda não encontrada' };
    }

    // Get sale items
    const { data: items, error: itemsError } = await supabase
      .from('sale_items')
      .select('*')
      .eq('sale_id', saleId);

    if (itemsError) {
      return { success: false, error: itemsError.message };
    }

    // Get payment methods
    const { data: payments, error: paymentsError } = await supabase
      .from('sale_payments')
      .select('*')
      .eq('sale_id', saleId);

    if (paymentsError) {
      return { success: false, error: paymentsError.message };
    }

    // Add product names to items by fetching products
    const enhancedItems = await Promise.all(
      items.map(async (item) => {
        // If no product_id, it's a custom item (service) with no related product
        if (!item.product_id) {
          return {
            ...item,
            name: item.name || 'Item personalizado',
            type: item.type || 'service',
            custom_price: true
          };
        }

        const { data: product } = await supabase
          .from('products')
          .select('name')
          .eq('id', item.product_id)
          .single();

        return {
          ...item,
          name: product?.name || `Produto #${item.product_id}`,
          type: 'product',
          custom_price: false
        };
      })
    );

    const saleDetails: SaleDetails = {
      sale: sale as Sale,
      items: enhancedItems,
      payments: payments || []
    };

    // Save to cache
    saveToCache(`sale_${saleId}`, saleDetails);

    return { success: true, data: saleDetails };
  } catch (error: any) {
    console.error('Error fetching sale details:', error);
    toast.error(`Erro ao carregar detalhes da venda: ${error.message}`);
    return { success: false, error: error.message };
  }
};
