
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '../useProductTypes';

export function useStockOperations() {
  // Update stock manually
  const updateStock = async (products: Product[], productId: number, newStock: number, notes: string = 'Atualização manual') => {
    try {
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        throw new Error('Produto não encontrado');
      }
      
      // Get current stock before update
      const currentStock = product.stock;
      
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);
        
      if (error) {
        throw error;
      }
      
      // Add stock log entry
      const changeAmount = newStock - currentStock;
      const { error: logError } = await supabase
        .from('stock_logs')
        .insert({
          product_id: productId,
          previous_stock: currentStock,
          new_stock: newStock,
          change_amount: changeAmount,
          reference_type: 'manual_update',
          notes: notes
        });
      
      if (logError) {
        console.error('Erro ao criar log de estoque:', logError);
      }
      
      toast.success(`Estoque do produto "${product.name}" atualizado para ${newStock} unidades.`);
      
      // Check if stock is below minimum
      if (newStock <= (product.min_stock || 5)) {
        toast.warning(`Atenção: O estoque do produto "${product.name}" está abaixo do mínimo recomendado (${product.min_stock || 5} unidades).`);
      }
      
      return { success: true, data: { ...product, stock: newStock } };
    } catch (error: any) {
      toast.error(`Erro ao atualizar estoque: ${error.message}`);
      return { success: false, error };
    }
  };

  return { updateStock };
}
