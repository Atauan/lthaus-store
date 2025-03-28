
import { supabase } from '@/integrations/supabase/client';
import { Sale, SaleItem, SalePayment, SaleDetails } from '../types';

export async function getSaleDetails(saleId: number): Promise<{ 
  success: boolean; 
  data?: SaleDetails; 
  error?: string 
}> {
  try {
    // Fetch the sale
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .select('*')
      .eq('id', saleId)
      .single();
      
    if (saleError) {
      throw saleError;
    }
    
    if (!saleData) {
      return { 
        success: false,
        error: 'Venda não encontrada'
      };
    }
    
    // Fetch the sale items
    const { data: itemsData, error: itemsError } = await supabase
      .from('sale_items')
      .select(`
        *,
        products(*)
      `)
      .eq('sale_id', saleId);
      
    if (itemsError) {
      throw itemsError;
    }
    
    // Fetch the payments
    const { data: paymentsData, error: paymentsError } = await supabase
      .from('sale_payments')
      .select('*')
      .eq('sale_id', saleId);
      
    if (paymentsError) {
      throw paymentsError;
    }
    
    // Map the items to include product details
    const mappedItems: SaleItem[] = (itemsData || []).map(item => {
      const productData = item.products;
      
      return {
        id: item.id,
        sale_id: item.sale_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        cost: item.cost || 0,
        name: item.name || productData?.name || 'Unknown',
        type: item.type || 'product',
        custom_price: item.custom_price || false,
        created_at: item.created_at,
        updated_at: item.updated_at || null,
        user_id: item.user_id || null
      };
    });
    
    return {
      success: true,
      data: {
        sale: saleData as Sale,
        items: mappedItems,
        payments: (paymentsData || []) as SalePayment[]
      }
    };
  } catch (error: any) {
    console.error('Error fetching sale details:', error);
    return {
      success: false,
      error: error.message || 'An error occurred while fetching sale details'
    };
  }
}
