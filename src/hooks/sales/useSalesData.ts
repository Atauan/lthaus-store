
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sale } from './types';
import { toast } from 'sonner';

export function useSalesData() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('sale_date', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setSales(data as Sale[]);
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

  return {
    sales,
    setSales,
    loading,
    isAuthenticated: true, // Always return true to bypass authentication checks
    refresh: fetchSales
  };
}
