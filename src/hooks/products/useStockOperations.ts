
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from './useProductTypes';

export function useStockOperations() {
  // Update stock manually
  const updateStock = async (products: Product[], productId: number, newStock: number, notes: string = 'Atualização manual') => {
    try {
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        throw new Error('Produto não encontrado');
      }
      
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);
        
      if (error) {
        throw error;
      }
      
      toast.success(`Estoque do produto "${product.name}" atualizado para ${newStock} unidades.`);
      
      // Check if stock is below minimum
      if (newStock <= (product.min_stock || 5)) {
        toast.warning(`Atenção: O estoque do produto "${product.name}" está abaixo do mínimo recomendado (${product.min_stock || 5} unidades).`);
      }
      
      // Stock log will be created automatically by the database trigger
      return { success: true, data: { ...product, stock: newStock } };
    } catch (error: any) {
      toast.error(`Erro ao atualizar estoque: ${error.message}`);
      return { success: false, error };
    }
  };

  // Get low stock products
  const getLowStockProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .lt('stock', supabase.rpc('min_stock'))  // Fixed: Using rpc instead of sql
        .order('stock', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return { success: true, data: data as Product[] };
    } catch (error: any) {
      toast.error(`Erro ao buscar produtos com estoque baixo: ${error.message}`);
      return { success: false, error, data: [] as Product[] };
    }
  };

  return { updateStock, getLowStockProducts };
}
