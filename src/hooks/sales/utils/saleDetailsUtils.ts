
import { supabase } from '@/integrations/supabase/client';
import { Sale, SaleItem, SalePayment, SaleDetails } from '../types';
import { toast } from 'sonner';

export async function getSaleDetails(saleId: number): Promise<{ success: boolean; data?: SaleDetails; error?: string }> {
  try {
    // Get the sale data
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .select('*')
      .eq('id', saleId)
      .single();

    if (saleError) {
      throw new Error(saleError.message);
    }

    if (!saleData) {
      return { 
        success: false, 
        error: 'Venda não encontrada' 
      };
    }

    // Get the sale items
    const { data: itemsData, error: itemsError } = await supabase
      .from('sale_items')
      .select('*')
      .eq('sale_id', saleId);

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    // Get the sale payments
    const { data: paymentsData, error: paymentsError } = await supabase
      .from('sale_payments')
      .select('*')
      .eq('sale_id', saleId);

    if (paymentsError) {
      throw new Error(paymentsError.message);
    }

    // Map database items to our SaleItem type
    const saleItems: SaleItem[] = itemsData.map(item => ({
      id: item.id,
      sale_id: item.sale_id,
      product_id: item.product_id,
      name: item.name || 'Produto', // Set a default name
      price: item.price,
      cost: item.cost,
      quantity: item.quantity,
      type: item.type || 'product', // Set a default type
      custom_price: item.custom_price || false,
      created_at: item.created_at,
      updated_at: item.updated_at || null,
      user_id: item.user_id || null
    }));

    // Return combined data
    return {
      success: true,
      data: {
        sale: saleData as Sale,
        items: saleItems,
        payments: paymentsData as SalePayment[]
      }
    };
  } catch (error: any) {
    console.error('Error fetching sale details:', error);
    toast.error(`Erro ao buscar detalhes da venda: ${error.message}`);
    return {
      success: false,
      error: error.message || 'Erro ao buscar detalhes da venda'
    };
  }
}

export async function updateSaleStatus(
  saleId: number, 
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('sales')
      .update({ status })
      .eq('id', saleId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating sale status:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
