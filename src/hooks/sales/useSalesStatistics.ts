
import { useState, useEffect, useMemo } from 'react';
import { Sale, SalesStatistics } from './types';

export function useSalesStatistics(sales: Sale[]) {
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(true);
  const [salesStatistics, setSalesStatistics] = useState<SalesStatistics>({
    totalSales: 0,
    totalRevenue: 0,
    totalProfit: 0,
    period: 'day',
    sales: []
  });

  // For the current time period (default: today)
  const periodSales = useMemo(() => {
    if (!sales || sales.length === 0) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.sale_date || new Date());
      return saleDate >= today;
    });
  }, [sales]);
  
  // Calculate statistics based on period sales
  useEffect(() => {
    if (sales && sales.length > 0) {
      try {
        const totalSales = periodSales.length;
        const totalRevenue = periodSales.reduce((sum, sale) => sum + sale.final_total, 0);
        const totalProfit = periodSales.reduce((sum, sale) => sum + (sale.profit || 0), 0);
        
        setSalesStatistics({
          totalSales,
          totalRevenue,
          totalProfit,
          period: 'day',
          sales: periodSales
        });
      } catch (error) {
        console.error('Error calculating sales statistics:', error);
      }
    }
    setIsLoadingStatistics(false);
  }, [periodSales, sales]);
  
  const getSalesStatistics = (period: 'day' | 'week' | 'month' = 'day') => {
    setIsLoadingStatistics(true);
    
    try {
      let filteredSales: Sale[] = [];
      const now = new Date();
      
      switch (period) {
        case 'day':
          // Sales from today
          const startOfDay = new Date(now);
          startOfDay.setHours(0, 0, 0, 0);
          
          filteredSales = sales.filter(sale => {
            const saleDate = new Date(sale.sale_date || new Date());
            return saleDate >= startOfDay;
          });
          break;
          
        case 'week':
          // Sales from the past 7 days
          const oneWeekAgo = new Date(now);
          oneWeekAgo.setDate(now.getDate() - 7);
          
          filteredSales = sales.filter(sale => {
            const saleDate = new Date(sale.sale_date || new Date());
            return saleDate >= oneWeekAgo;
          });
          break;
          
        case 'month':
          // Sales from the current month
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          
          filteredSales = sales.filter(sale => {
            const saleDate = new Date(sale.sale_date || new Date());
            return saleDate >= startOfMonth;
          });
          break;
      }
      
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
    } catch (error) {
      console.error('Error calculating sales statistics:', error);
    } finally {
      setIsLoadingStatistics(false);
    }
  };
  
  return {
    salesStatistics,
    periodSales,
    isLoadingStatistics,
    getSalesStatistics
  };
}
