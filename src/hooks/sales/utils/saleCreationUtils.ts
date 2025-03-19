
import { supabase } from '@/integrations/supabase/client';
import { Sale, SaleItem, SalePayment } from '../types';
import { toast } from 'sonner';
import { getSaleDetails } from './saleDetailsUtils';

export async function createSale(
  sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>,
  items: Omit<SaleItem, 'id' | 'created_at' | 'updated_at' | 'sale_id'>[],
  payments: Omit<SalePayment, 'id' | 'created_at' | 'updated_at' | 'sale_id'>[]
): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Start a transaction
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert([{
        ...sale,
        user_id: userId
      }])
      .select()
      .single();
      
    if (saleError) throw saleError;
    
    const saleId = saleData.id;
    
    // Insert items
    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(
        items.map(item => ({
          ...item,
          sale_id: saleId,
          user_id: userId
        }))
      );
      
    if (itemsError) throw itemsError;
    
    // Insert payments
    const { error: paymentsError } = await supabase
      .from('sale_payments')
      .insert(
        payments.map(payment => ({
          ...payment,
          sale_id: saleId,
          user_id: userId
        }))
      );
      
    if (paymentsError) throw paymentsError;
    
    // Update product stock if needed
    for (const item of items) {
      if (item.type === 'product' && item.product_id) {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();
          
        if (productError) throw productError;
        
        const currentStock = productData.stock;
        const newStock = Math.max(0, currentStock - item.quantity);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.product_id);
          
        if (updateError) throw updateError;
      }
    }
    
    // Return the complete sale details
    return await getSaleDetails(saleId);
  } catch (error: any) {
    toast.error(`Erro ao criar venda: ${error.message}`);
    return { success: false, error };
  }
}
