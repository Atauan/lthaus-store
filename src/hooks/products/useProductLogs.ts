import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StockLog, CostChangeLog } from './useProductTypes';

export function useProductLogs() {
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [costChangeLogs, setCostChangeLogs] = useState<CostChangeLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch stock logs
  const fetchStockLogs = useCallback(async () => {
    try {
      setLoading(true);
      
      // First get all stock logs
      const { data: logsData, error: logsError } = await supabase
        .from('stock_logs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (logsError) throw logsError;
      
      // Get product names for display
      const productIds = [...new Set(logsData.map(log => log.product_id))];
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name')
        .in('id', productIds);
        
      if (productsError) throw productsError;
      
      // Create a map of product IDs to names
      const productMap = Object.fromEntries(
        productsData.map(product => [product.id, product.name])
      );
      
      // Combine the data
      const logsWithProductNames = logsData.map(log => ({
        ...log,
        product_name: productMap[log.product_id] || 'Produto Desconhecido'
      }));
      
      setStockLogs(logsWithProductNames);
      
      return logsWithProductNames;
    } catch (error: any) {
      toast.error(`Erro ao carregar histórico de estoque: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch cost change logs
  const fetchCostChangeLogs = useCallback(async () => {
    try {
      setLoading(true);
      
      // First get all cost change logs
      const { data: logsData, error: logsError } = await supabase
        .from('cost_change_logs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (logsError) throw logsError;
      
      // Get product names for display
      const productIds = [...new Set(logsData.map(log => log.product_id))];
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name')
        .in('id', productIds);
        
      if (productsError) throw productsError;
      
      // Create a map of product IDs to names
      const productMap = Object.fromEntries(
        productsData.map(product => [product.id, product.name])
      );
      
      // Combine the data
      const logsWithProductNames = logsData.map(log => ({
        ...log,
        product_name: productMap[log.product_id] || 'Produto Desconhecido'
      }));
      
      setCostChangeLogs(logsWithProductNames);
      
      return logsWithProductNames;
    } catch (error: any) {
      toast.error(`Erro ao carregar histórico de alterações de custo: ${error.message}`);
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
