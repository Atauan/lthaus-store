
import { supabase } from '@/integrations/supabase/client';

export async function getSaleDetails(saleId: number) {
  try {
    console.log('Fetching sale details for ID:', saleId);
    
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .select('*')
      .eq('id', saleId)
      .single();

    if (saleError) {
      console.error('Error fetching sale:', saleError);
      throw saleError;
    }

    const { data: items, error: itemsError } = await supabase
      .from('sale_items')
      .select(`
        *,
        products (
          name,
          category,
          brand
        )
      `)
      .eq('sale_id', saleId);

    if (itemsError) {
      console.error('Error fetching sale items:', itemsError);
      throw itemsError;
    }

    const { data: payments, error: paymentsError } = await supabase
      .from('sale_payments')
      .select('*')
      .eq('sale_id', saleId);

    if (paymentsError) {
      console.error('Error fetching sale payments:', paymentsError);
      throw paymentsError;
    }

    return {
      sale,
      items: items || [],
      payments: payments || []
    };
  } catch (error) {
    console.error('Error in getSaleDetails:', error);
    throw error;
  }
}
