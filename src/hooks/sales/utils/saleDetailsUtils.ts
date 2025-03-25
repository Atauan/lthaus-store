
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SaleDetails, SaleItem } from '../types';

export async function getSaleDetails(saleId: number): Promise<{ success: boolean; data?: SaleDetails; error?: any }> {
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
    
    // Mapear os dados dos itens para o formato esperado por SaleItem
    const mappedItems: SaleItem[] = (itemsData || []).map(item => ({
      id: item.id,
      sale_id: item.sale_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      cost: item.cost,
      created_at: item.created_at,
      name: `Produto #${item.product_id}`, // Nome padrão
      type: 'product' // Tipo padrão
    }));
    
    return {
      success: true,
      data: {
        sale: saleData,
        items: mappedItems,
        payments: paymentsData || []
      }
    };
  } catch (error: any) {
    toast.error(`Erro ao carregar detalhes da venda: ${error.message}`);
    return { success: false, error };
  }
}
