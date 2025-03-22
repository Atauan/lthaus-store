
import { useState, useEffect } from 'react';
import { Sale, SalesStatistics } from './types';

export function useSalesStatistics(salesData: Sale[]) {
  const [salesStatistics, setSalesStatistics] = useState<SalesStatistics>({
    totalSales: 0,
    totalRevenue: 0,
    totalProfit: 0,
    period: 'month',
    sales: []
  });
  const [periodSales, setPeriodSales] = useState<Sale[]>([]);
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(true);

  useEffect(() => {
    calculateStatistics('month');
  }, [salesData]);

  const calculateStatistics = (period: 'day' | 'week' | 'month' = 'month') => {
    setIsLoadingStatistics(true);
    
    try {
      const now = new Date();
      let cutoffDate = new Date();
      
      // Set cutoff date based on selected period
      if (period === 'day') {
        cutoffDate.setDate(now.getDate() - 1);
      } else if (period === 'week') {
        cutoffDate.setDate(now.getDate() - 7);
      } else {
        cutoffDate.setMonth(now.getMonth() - 1);
      }
      
      // Filter sales by period
      const filteredSales = salesData.filter(sale => {
        const saleDate = new Date(sale.sale_date || '');
        return saleDate >= cutoffDate;
      });
      
      // Calculate statistics
      const totalSales = filteredSales.length;
      const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.final_total, 0);
      const totalProfit = filteredSales.reduce((sum, sale) => sum + (sale.profit || 0), 0);
      
      setSalesStatistics({
        totalSales,
        totalRevenue,
        totalProfit,
        period,
        sales: filteredSales
      });
      
      setPeriodSales(filteredSales);
    } catch (error) {
      console.error('Error calculating statistics:', error);
    } finally {
      setIsLoadingStatistics(false);
    }
  };

  // Method that can be called to get sales statistics
  const getSalesStatistics = async (period: 'day' | 'week' | 'month' = 'month') => {
    calculateStatistics(period);
    return {
      success: true,
      data: salesStatistics
    };
  };

  return {
    salesStatistics,
    periodSales,
    isLoadingStatistics,
    getSalesStatistics
  };
}
