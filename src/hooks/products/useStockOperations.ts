
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from './types';

export function useStockOperations() {
  const updateStock = async (productId: number, newStock: number, notes?: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);

      if (error) throw error;

      toast.success('Estoque atualizado com sucesso!');
      return { success: true };
    } catch (error: any) {
      toast.error(`Erro ao atualizar estoque: ${error.message}`);
      return { success: false, error };
    }
  };

  return { updateStock };
}
