
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useSalesStatistics() {
  const getSalesStatistics = useCallback(async (period: 'day' | 'week' | 'month' = 'month') => {
    try {
      let fromDate = new Date();
      
      if (period === 'day') {
        fromDate.setDate(fromDate.getDate() - 1);
      } else if (period === 'week') {
        fromDate.setDate(fromDate.getDate() - 7);
      } else if (period === 'month') {
        fromDate.setMonth(fromDate.getMonth() - 1);
      }
      
      const fromDateStr = fromDate.toISOString();
      
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .gte('sale_date', fromDateStr);
        
      if (error) throw error;
      
      const totalSales = data.length;
      const totalRevenue = data.reduce((sum, sale) => sum + sale.final_total, 0);
      const totalProfit = data.reduce((sum, sale) => sum + (sale.profit || 0), 0);
      
      return {
        success: true,
        data: {
          totalSales,
          totalRevenue,
          totalProfit,
          period,
          sales: data
        }
      };
    } catch (error: any) {
      toast.error(`Erro ao carregar estatísticas: ${error.message}`);
      return { success: false, error };
    }
  }, []);

  return { getSalesStatistics };
}
