
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define sales data types
export interface Sale {
  id: number;
  sale_number: number;
  customer_name?: string;
  customer_contact?: string;
  sale_channel?: string;
  payment_method: string;
  sale_date?: string;
  notes?: string;
  subtotal: number;
  discount?: number;
  final_total: number;
  profit?: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface SaleItem {
  id: number;
  sale_id?: number;
  product_id?: number;
  name: string;
  price: number;
  cost?: number;
  quantity: number;
  type: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface SalePayment {
  id: number;
  sale_id?: number;
  method: string;
  amount: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  // Fetch sales from database
  useEffect(() => {
    const fetchSales = async () => {
      try {
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
    
    fetchSales();
  }, []);

  // Filter sales based on search query and date range
  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      (sale.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (sale.customer_contact?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      sale.sale_number.toString().includes(searchQuery);
    
    let matchesDateRange = true;
    if (dateRange.from || dateRange.to) {
      const saleDate = sale.sale_date ? new Date(sale.sale_date) : null;
      if (saleDate) {
        if (dateRange.from && saleDate < dateRange.from) {
          matchesDateRange = false;
        }
        if (dateRange.to) {
          // Set time to end of day for the to date
          const endDate = new Date(dateRange.to);
          endDate.setHours(23, 59, 59, 999);
          if (saleDate > endDate) {
            matchesDateRange = false;
          }
        }
      }
    }
    
    return matchesSearch && matchesDateRange;
  });

  // Get sale details including items and payments
  const getSaleDetails = async (saleId: number) => {
    try {
      // Get sale
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .select('*')
        .eq('id', saleId)
        .single();
        
      if (saleError) throw saleError;
      
      // Get sale items
      const { data: itemsData, error: itemsError } = await supabase
        .from('sale_items')
        .select('*')
        .eq('sale_id', saleId);
        
      if (itemsError) throw itemsError;
      
      // Get sale payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('sale_payments')
        .select('*')
        .eq('sale_id', saleId);
        
      if (paymentsError) throw paymentsError;
      
      return {
        success: true,
        data: {
          sale: saleData as Sale,
          items: itemsData as SaleItem[],
          payments: paymentsData as SalePayment[]
        }
      };
    } catch (error: any) {
      toast.error(`Erro ao carregar detalhes da venda: ${error.message}`);
      return { success: false, error };
    }
  };

  // Get sales statistics
  const getSalesStatistics = async (period: 'day' | 'week' | 'month' = 'month') => {
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
          sales: data as Sale[]
        }
      };
    } catch (error: any) {
      toast.error(`Erro ao carregar estatísticas: ${error.message}`);
      return { success: false, error };
    }
  };

  return {
    sales,
    filteredSales,
    loading,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    getSaleDetails,
    getSalesStatistics
  };
}
