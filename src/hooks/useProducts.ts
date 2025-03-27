import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 50;

export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  cost: number;
  stock: number;
}

// Exportando brands diretamente
export const brands = ['Todas', 'Apple', 'Samsung', 'Anker', 'JBL', 'Generic'];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .range(from, to);

      if (error) throw error;

      if (data) {
        setProducts(prevProducts => page === 1 ? data : [...prevProducts, ...data]);
        setHasMore(count > to + 1);
        setCurrentPage(page);

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      toast.error(`Erro ao carregar produtos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchProducts(currentPage + 1);
    }
  };

  return { products, loading, hasMore, loadMore, categories };
}
