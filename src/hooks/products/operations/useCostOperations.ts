import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '../useProductTypes';
import { formatCurrency } from '../utils/pricingUtils';

export function useCostOperations() {
  // Update product cost
  const updateCost = async (products: Product[], productId: number, newCost: number) => {
    try {
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        throw new Error('Produto não encontrado');
      }
      
      const { error } = await supabase
        .from('products')
        .update({ cost: newCost })
        .eq('id', productId);
        
      if (error) {
        throw error;
      }
      
      toast.success(`Custo do produto "${product.name}" atualizado para ${formatCurrency(newCost)}.`);
      
      // Cost change log will be created automatically by the database trigger
      return { success: true, data: { ...product, cost: newCost } };
    } catch (error: any) {
      toast.error(`Erro ao atualizar custo: ${error.message}`);
      return { success: false, error };
    }
  };

  return { updateCost };
}
