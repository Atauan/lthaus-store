
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sale, SaleItem, SaleDetails, SalesStatistics, DateRange } from './sales/types';
import { toast } from 'sonner';

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

  const getSalesStatistics = useCallback(async (dateRange?: DateRange) => {
    try {
      setIsLoadingStatistics(true);
      
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
    items: Omit<SaleItem, 'id' | 'sale_id' | 'created_at'>[],
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
      
      // Insert the sale items
      const itemsWithSaleId = items.map(item => ({
        ...item,
        sale_id: newSale.id
      }));
      
      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(itemsWithSaleId);
        
      if (itemsError) {
        throw itemsError;
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
    getSalesStatistics();
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
    periodSales
  };
}
