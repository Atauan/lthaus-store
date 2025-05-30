
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from './types';

export function useProductSearch() {
  const searchProducts = useCallback(async (query: string): Promise<Product[]> => {
    if (!query.trim()) return [];

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,brand.ilike.%${query}%`)
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }, []);

  const getLowStockProducts = useCallback(async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .filter('stock', 'lte', 'min_stock')
        .order('stock');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      return [];
    }
  }, []);

  return {
    searchProducts,
    getLowStockProducts
  };
}
