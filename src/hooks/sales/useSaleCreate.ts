
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sale, SaleItem, SalePayment } from './types';

export function useSaleCreate() {
  const createSale = useCallback(async (
    sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>,
    items: Omit<SaleItem, 'id' | 'created_at' | 'updated_at' | 'sale_id'>[],
    payments: Omit<SalePayment, 'id' | 'created_at' | 'updated_at' | 'sale_id'>[]
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

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
      
      // Get the complete sale details for returning
      const { data: saleItemsData, error: saleItemsError } = await supabase
        .from('sale_items')
        .select('*')
        .eq('sale_id', saleId);
        
      if (saleItemsError) throw saleItemsError;
      
      const { data: salePaymentsData, error: salePaymentsError } = await supabase
        .from('sale_payments')
        .select('*')
        .eq('sale_id', saleId);
        
      if (salePaymentsError) throw salePaymentsError;
      
      return {
        success: true,
        data: {
          sale: saleData,
          items: saleItemsData || [],
          payments: salePaymentsData || []
        }
      };
    } catch (error: any) {
      toast.error(`Erro ao criar venda: ${error.message}`);
      return { success: false, error };
    }
  }, []);

  return { createSale };
}
