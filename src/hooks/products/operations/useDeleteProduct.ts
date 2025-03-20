
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '../useProductTypes';

export function useDeleteProduct() {
  // Delete a product
  const deleteProduct = async (products: Product[], id: number) => {
    try {
      const product = products.find(p => p.id === id);
      
      if (!product) {
        throw new Error('Produto não encontrado');
      }
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast.success(`Produto "${product.name}" excluído com sucesso!`);
      return { success: true };
    } catch (error: any) {
      toast.error(`Erro ao excluir produto: ${error.message}`);
      return { success: false, error };
    }
  };

  return { deleteProduct };
}
