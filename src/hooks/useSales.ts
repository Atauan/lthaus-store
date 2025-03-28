
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sale, SaleItem, SaleDetails, SalesStatistics, DateRange } from './sales/types';
import { toast } from 'sonner';
import { getSaleDetails } from './sales/utils/saleDetailsUtils';

export type { Sale, SaleItem, SaleDetails, SalesStatistics };

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [salesStatistics, setSalesStatistics] = useState<SalesStatistics | null>(null);
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(false);
  const [periodSales, setPeriodSales] = useState<{ date: string; value: number }[]>([]);

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
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSalesStatistics = useCallback(async (dateRangeOrPeriod?: DateRange | string) => {
    try {
      setIsLoadingStatistics(true);
      
      // Handle string period like 'day', 'week', 'month', 'year'
      let dateRange: DateRange = {};
      
      if (typeof dateRangeOrPeriod === 'string') {
        const now = new Date();
        dateRange.to = now;
        
        switch (dateRangeOrPeriod) {
          case 'day':
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            dateRange.from = today;
            break;
          case 'week':
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            dateRange.from = lastWeek;
            break;
          case 'month':
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            dateRange.from = lastMonth;
            break;
          case 'year':
            const lastYear = new Date();
            lastYear.setFullYear(lastYear.getFullYear() - 1);
            dateRange.from = lastYear;
            break;
          default:
            // If not a recognized period, treat as a DateRange object
            dateRange = dateRangeOrPeriod as DateRange;
        }
      } else if (dateRangeOrPeriod) {
        dateRange = dateRangeOrPeriod;
      }
      
      // Calculate date range if provided
      let query = supabase.from('sales').select('*');
      
      if (dateRange?.from) {
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        query = query.gte('sale_date', fromDate.toISOString());
      }
      
      if (dateRange?.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        query = query.lte('sale_date', toDate.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Calculate statistics
        const filteredSales = data as Sale[];
        const totalSales = filteredSales.length;
        const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.final_total, 0);
        const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;
        const totalProfit = filteredSales.reduce((sum, sale) => sum + (sale.profit || 0), 0);
        
        // Group sales by date for the chart
        const salesByDate = filteredSales.reduce((acc, sale) => {
          const date = new Date(sale.sale_date).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += sale.final_total;
          return acc;
        }, {} as Record<string, number>);
        
        const periodSalesData = Object.entries(salesByDate).map(([date, value]) => ({
          date,
          value
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setPeriodSales(periodSalesData);
        
        const statistics: SalesStatistics = {
          totalSales,
          totalRevenue,
          averageSale,
          totalProfit,
          periodSales: periodSalesData
        };
        
        setSalesStatistics(statistics);
        return statistics;
      }
      
      return null;
    } catch (error: any) {
      toast.error(`Erro ao carregar estatísticas: ${error.message}`);
      console.error('Error fetching sales statistics:', error);
      return null;
    } finally {
      setIsLoadingStatistics(false);
    }
  }, []);

  // Create a new sale
  const createSale = async (
    sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>,
    items: Omit<SaleItem, 'id' | 'created_at' | 'updated_at' | 'sale_id'>[],
    payments: { method: string; amount: number }[]
  ) => {
    try {
      // Insert the sale first
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert(sale)
        .select();
        
      if (saleError) {
        throw saleError;
      }
      
      if (!saleData || saleData.length === 0) {
        throw new Error('Failed to create sale');
      }
      
      const newSale = saleData[0] as Sale;
      
      // Insert the sale items, ensuring product_id is not optional
      const itemsWithSaleId = items.map(item => ({
        sale_id: newSale.id,
        price: item.price,
        quantity: item.quantity,
        product_id: item.product_id || 0, // Default to 0 if not provided
        cost: item.cost || 0,
        name: item.name,
        type: item.type || 'product',
        custom_price: item.custom_price || false
      }));
      
      // Use separate inserts for each item to avoid batch issues
      for (const item of itemsWithSaleId) {
        const { error: itemError } = await supabase
          .from('sale_items')
          .insert({
            sale_id: item.sale_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            cost: item.cost
          });
          
        if (itemError) {
          console.error('Error inserting sale item:', itemError);
        }
      }
      
      // Insert the payments
      const paymentsWithSaleId = payments.map(payment => ({
        ...payment,
        sale_id: newSale.id
      }));
      
      const { error: paymentsError } = await supabase
        .from('sale_payments')
        .insert(paymentsWithSaleId);
        
      if (paymentsError) {
        throw paymentsError;
      }
      
      // Update the sales list
      setSales(prevSales => [newSale, ...prevSales]);
      
      return { success: true, data: newSale };
    } catch (error: any) {
      console.error('Error creating sale:', error);
      return { success: false, error };
    }
  };
  
  useEffect(() => {
    fetchSales();
    getSalesStatistics('month');
  }, [getSalesStatistics]);

  return {
    sales,
    setSales,
    loading,
    refresh: fetchSales,
    createSale,
    salesStatistics,
    getSalesStatistics,
    isLoadingStatistics,
    periodSales,
    getSaleDetails
  };
}
