
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StockLog, CostChangeLog } from './types';
import { toast } from 'sonner';

export function useProductLogs() {
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [costChangeLogs, setCostChangeLogs] = useState<CostChangeLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch stock logs with product names
  const fetchStockLogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stock_logs')
        .select(`
          *,
          products:product_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format data to include product_name
      const formattedLogs: StockLog[] = data.map(log => ({
        ...log,
        product_name: log.products?.name || 'Produto Desconhecido'
      }));

      setStockLogs(formattedLogs);
      return formattedLogs;
    } catch (error: any) {
      toast.error(`Erro ao carregar logs de estoque: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cost change logs with product names
  const fetchCostChangeLogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cost_change_logs')
        .select(`
          *,
          products:product_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format data to include product_name
      const formattedLogs: CostChangeLog[] = data.map(log => ({
        ...log,
        product_name: log.products?.name || 'Produto Desconhecido'
      }));

      setCostChangeLogs(formattedLogs);
      return formattedLogs;
    } catch (error: any) {
      toast.error(`Erro ao carregar logs de alteração de custo: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stockLogs,
    costChangeLogs,
    loading,
    fetchStockLogs,
    fetchCostChangeLogs
  };
}
