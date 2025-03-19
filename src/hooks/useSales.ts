import { useState, useCallback, useEffect } from 'react';
import { 
  getSaleDetails, 
  getSalesStatistics, 
  createSale 
} from './sales/salesUtils';
import { useFilterSales } from './sales/useFilterSales';
import { Sale, DateRange, SaleItem, SalePayment, SaleDetails } from './sales/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export type { Sale, SaleItem, SalePayment, DateRange, SaleDetails } from './sales/types';

export function useSales() {
  const { session } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({});

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };
    
    if (session) {
      fetchSales();
    } else {
      setSales([
        {
          id: 1,
          sale_number: 10001,
          customer_name: 'João Silva',
          customer_contact: '(11) 99999-8888',
          sale_channel: 'store',
          payment_method: 'pix',
          sale_date: new Date().toISOString(),
          subtotal: 159.80,
          discount: 10,
          final_total: 149.80,
          profit: 75.00
        },
        {
          id: 2,
          sale_number: 10002,
          customer_name: 'Maria Oliveira',
          customer_contact: '(11) 97777-6666',
          sale_channel: 'whatsapp',
          payment_method: 'credit_card',
          sale_date: new Date(Date.now() - 86400000).toISOString(),
          subtotal: 299.90,
          discount: 0,
          final_total: 299.90,
          profit: 120.00
        },
        {
          id: 3,
          sale_number: 10003,
          customer_name: 'Carlos Santos',
          customer_contact: '(11) 95555-4444',
          sale_channel: 'instagram',
          payment_method: 'cash',
          sale_date: new Date(Date.now() - 172800000).toISOString(),
          subtotal: 89.90,
          discount: 5,
          final_total: 84.90,
          profit: 35.00
        }
      ]);
      setLoading(false);
    }
  }, [session]);

  const filteredSales = useFilterSales(sales, searchQuery, dateRange);

  const getSaleDetailsCallback = useCallback(async (saleId: number) => {
    try {
      setLoading(true);
      
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .select('*')
        .eq('id', saleId)
        .single();
        
      if (saleError) throw saleError;
      
      const { data: itemsData, error: itemsError } = await supabase
        .from('sale_items')
        .select('*')
        .eq('sale_id', saleId);
        
      if (itemsError) throw itemsError;
      
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('sale_payments')
        .select('*')
        .eq('sale_id', saleId);
        
      if (paymentsError) throw paymentsError;
      
      return {
        success: true,
        data: {
          sale: saleData,
          items: itemsData || [],
          payments: paymentsData || []
        }
      };
    } catch (error: any) {
      toast.error(`Erro ao carregar detalhes da venda: ${error.message}`);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const getSalesStatisticsCallback = useCallback(async (period: 'day' | 'week' | 'month' = 'month') => {
    try {
      setLoading(true);
      
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
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createSaleCallback = useCallback(async (
    sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>,
    items: Omit<SaleItem, 'id' | 'created_at' | 'updated_at' | 'sale_id'>[],
    payments: Omit<SalePayment, 'id' | 'created_at' | 'updated_at' | 'sale_id'>[]
  ) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert([{
          ...sale,
          user_id: userId
        }])
        .select()
        .single();
        
      if (saleError) throw saleError;
      
      const saleId = saleData.id;
      
      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(
          items.map(item => ({
            ...item,
            sale_id: saleId,
            user_id: userId
          }))
        );
        
      if (itemsError) throw itemsError;
      
      const { error: paymentsError } = await supabase
        .from('sale_payments')
        .insert(
          payments.map(payment => ({
            ...payment,
            sale_id: saleId,
            user_id: userId
          }))
        );
        
      if (paymentsError) throw paymentsError;
      
      for (const item of items) {
        if (item.type === 'product' && item.product_id) {
          const { data: productData, error: productError } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single();
            
          if (productError) throw productError;
          
          const currentStock = productData.stock;
          const newStock = Math.max(0, currentStock - item.quantity);
          
          const { error: updateError } = await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', item.product_id);
            
          if (updateError) throw updateError;
        }
      }
      
      setSales(prevSales => [saleData, ...prevSales]);
      
      return {
        success: true,
        data: {
          sale: saleData,
          items: items.map((item, index) => ({
            ...item,
            id: index + 1,
            sale_id: saleId
          })),
          payments: payments.map((payment, index) => ({
            ...payment,
            id: index + 1,
            sale_id: saleId
          }))
        }
      };
    } catch (error: any) {
      toast.error(`Erro ao criar venda: ${error.message}`);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sales,
    filteredSales,
    loading,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    getSaleDetails: getSaleDetailsCallback,
    getSalesStatistics: getSalesStatisticsCallback,
    createSale: createSaleCallback,
    isAuthenticated: !!session
  };
}
