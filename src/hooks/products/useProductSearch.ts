
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from './types';

export function useProductSearch() {
  // Search products by name or description
  const searchProducts = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
        
      if (error) {
        throw error;
      }
      
      return { success: true, data: data as Product[] };
    } catch (error: any) {
      toast.error(`Erro ao pesquisar produtos: ${error.message}`);
      return { success: false, error };
    }
  };

  // Get low stock products (less than 5 items)
  const getLowStockProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .lt('stock', 5);
        
      if (error) {
        throw error;
      }
      
      return { success: true, data: data as Product[] };
    } catch (error: any) {
      toast.error(`Erro ao buscar produtos com estoque baixo: ${error.message}`);
      return { success: false, error };
    }
  };

  return {
    searchProducts,
    getLowStockProducts
  };
}
