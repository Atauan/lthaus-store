import { useState, useEffect } from 'react';
import { Sale } from './types';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';

export function useSalesStatistics(sales: Sale[]) {
  const [periodSales, setPeriodSales] = useState<Sale[]>([]);
  const [salesStatistics, setSalesStatistics] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProfit: 0,
    period: 'month' as 'day' | 'week' | 'month' | 'year',
    sales: [] as Sale[]
  });
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(false);

  const getSalesStatistics = (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
    setIsLoadingStatistics(true);
    
    try {
      const now = new Date();
      let startDate, endDate;
      
      switch (period) {
        case 'day':
          startDate = startOfDay(now);
          endDate = endOfDay(now);
          break;
        case 'week':
          startDate = startOfWeek(now, { weekStartsOn: 1 });
          endDate = endOfWeek(now, { weekStartsOn: 1 });
          break;
        case 'month':
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        case 'year':
          startDate = startOfYear(now);
          endDate = endOfYear(now);
          break;
        default:
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
      }
      
      // Filter sales by date range
      const filteredSales = sales.filter(sale => {
        if (!sale.sale_date) return false;
        const saleDate = new Date(sale.sale_date);
        return isWithinInterval(saleDate, { start: startDate, end: endDate });
      });
      
      // Only include completed sales in statistics (not revoked)
      const completedSales = filteredSales.filter(sale => 
        !sale.status || sale.status === 'completed'
      );
      
      // Calculate statistics
      const totalSales = completedSales.length;
      const totalRevenue = completedSales.reduce((sum, sale) => sum + sale.final_total, 0);
      const totalProfit = completedSales.reduce((sum, sale) => sum + (sale.profit || 0), 0);
      
      setSalesStatistics({
        totalSales,
        totalRevenue,
        totalProfit,
        period,
        sales: filteredSales
      });
      
      setPeriodSales(filteredSales);
      
    } catch (error) {
      console.error('Error calculating sales statistics', error);
    } finally {
      setIsLoadingStatistics(false);
    }
  };

  useEffect(() => {
    if (sales.length > 0) {
      getSalesStatistics('month');
    }
  }, [sales]);

  return {
    salesStatistics,
    getSalesStatistics,
    periodSales,
    isLoadingStatistics
  };
}
