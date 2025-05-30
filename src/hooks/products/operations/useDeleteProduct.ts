
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '../types';

export function useDeleteProduct() {
  const deleteProduct = async (productId: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast.success('Produto excluído com sucesso!');
      return { success: true };
    } catch (error: any) {
      toast.error(`Erro ao excluir produto: ${error.message}`);
      return { success: false, error };
    }
  };

  return { deleteProduct };
}
