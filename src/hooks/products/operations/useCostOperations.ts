
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '../types';

export function useCostOperations() {
  const updateCost = async (productId: number, newCost: number, notes?: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ cost: newCost })
        .eq('id', productId);

      if (error) throw error;

      toast.success('Custo atualizado com sucesso!');
      return { success: true };
    } catch (error: any) {
      toast.error(`Erro ao atualizar custo: ${error.message}`);
      return { success: false, error };
    }
  };

  return { updateCost };
}
