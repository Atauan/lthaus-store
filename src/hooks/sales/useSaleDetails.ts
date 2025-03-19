
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useSaleDetails() {
  const getSaleDetails = useCallback(async (saleId: number) => {
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
      
      return {
        success: true,
        data: {
          sale: saleData,
          items: itemsData || [],
          payments: paymentsData || []
        }
      };
    } catch (error: any) {
      toast.error(`Erro ao carregar detalhes da venda: ${error.message}`);
      return { success: false, error };
    }
  }, []);

  return { getSaleDetails };
}
