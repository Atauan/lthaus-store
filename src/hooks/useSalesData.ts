import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sale } from './types';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 50;
const CACHE_KEY = 'salesData';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export function useSalesData() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchSales = async (page = 1) => {
    try {
      setLoading(true);
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setSales(data);
          setLoading(false);
          return;
        }
      }

      const { data, error, count } = await supabase
        .from('sales')
        .select('*', { count: 'exact' })
        .order('sale_date', { ascending: false })
        .range(from, to);
        
      if (error) throw error;
      
      if (data) {
        setSales(prevSales => page === 1 ? data : [...prevSales, ...data]);
        setHasMore(count > to + 1);
        setCurrentPage(page);

        // Cache the data
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
      }
    } catch (error: any) {
      toast.error(`Erro ao carregar vendas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSales();
  }, []);

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchSales(currentPage + 1);
    }
  };

  return {
    sales,
    loading,
    hasMore,
    loadMore,
    refresh: () => fetchSales(1)
  };
}
