
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StockLog, CostChangeLog } from './types';

export function useProductLogs() {
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [costChangeLogs, setCostChangeLogs] = useState<CostChangeLog[]>([]);

  const fetchStockLogs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('stock_logs')
        .select(`
          *,
          products (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedLogs = (data || []).map(log => ({
        ...log,
        product_name: log.products?.name || 'Produto não encontrado'
      }));

      setStockLogs(formattedLogs);
      return formattedLogs;
    } catch (error: any) {
      toast.error(`Erro ao carregar histórico de estoque: ${error.message}`);
      return [];
    }
  }, []);

  const fetchCostChangeLogs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('cost_change_logs')
        .select(`
          *,
          products (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedLogs = (data || []).map(log => ({
        ...log,
        product_name: log.products?.name || 'Produto não encontrado'
      }));

      setCostChangeLogs(formattedLogs);
      return formattedLogs;
    } catch (error: any) {
      toast.error(`Erro ao carregar histórico de custos: ${error.message}`);
      return [];
    }
  }, []);

  return {
    stockLogs,
    costChangeLogs,
    fetchStockLogs,
    fetchCostChangeLogs
  };
}
