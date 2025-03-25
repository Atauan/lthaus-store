
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sale, SaleItem } from './types';

export function useRevokeSale() {
  const [isRevoking, setIsRevoking] = useState(false);
  
  const revokeSale = async (saleId: number): Promise<{ success: boolean; error?: any }> => {
    try {
      setIsRevoking(true);
      
      // 1. Get the sale details
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .select('*')
        .eq('id', saleId)
        .single();
      
      if (saleError) {
        throw saleError;
      }
      
      if (sale.status === 'revoked') {
        throw new Error('Esta venda já foi cancelada');
      }
      
      // 2. Get the sale items
      const { data: saleItems, error: itemsError } = await supabase
        .from('sale_items')
        .select('*')
        .eq('sale_id', saleId);
      
      if (itemsError) {
        throw itemsError;
      }
      
      // 3. Begin a transaction to update everything
      // 3.1 Update the sale status
      const { error: updateError } = await supabase
        .from('sales')
        .update({ 
          status: 'revoked',
          updated_at: new Date().toISOString()
        })
        .eq('id', saleId);
      
      if (updateError) {
        throw updateError;
      }
      
      // 3.2 Update product stock (add items back to inventory)
      for (const item of saleItems) {
        if (item.product_id) {
          // Get current product stock
          const { data: product, error: productError } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single();
          
          if (productError) {
            console.error(`Error getting product ${item.product_id}: ${productError.message}`);
            continue;
          }
          
          // Update stock
          const newStock = (product.stock || 0) + item.quantity;
          
          const { error: stockError } = await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', item.product_id);
          
          if (stockError) {
            console.error(`Error updating stock for product ${item.product_id}: ${stockError.message}`);
          }
        }
      }
      
      return { success: true };
    } catch (error: any) {
      toast.error(`Erro ao cancelar venda: ${error.message}`);
      return { success: false, error };
    } finally {
      setIsRevoking(false);
    }
  };
  
  return {
    revokeSale,
    isRevoking
  };
}
