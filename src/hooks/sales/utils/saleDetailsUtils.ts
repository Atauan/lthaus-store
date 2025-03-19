
import { supabase } from '@/integrations/supabase/client';
import { SaleDetails, Sale } from '../types';
import { toast } from 'sonner';

// Mock function for getting sale details (no Supabase)
export async function getSaleDetails(saleId: number): Promise<{ success: boolean; data?: SaleDetails; error?: any }> {
  try {
    // This would normally fetch from Supabase, but we'll return mock data
    return {
      success: true,
      data: {
        sale: {
          id: saleId,
          sale_number: 10000 + saleId,
          customer_name: 'Cliente de Teste',
          customer_contact: '(11) 99999-9999',
          sale_channel: 'store',
          payment_method: 'pix',
          sale_date: new Date().toISOString(),
          subtotal: 100,
          discount: 0,
          final_total: 100,
          profit: 50
        },
        items: [
          {
            id: 1,
            sale_id: saleId,
            product_id: 1,
            name: 'Produto de teste',
            price: 100,
            cost: 50,
            quantity: 1,
            type: 'product'
          }
        ],
        payments: [
          {
            id: 1,
            sale_id: saleId,
            method: 'pix',
            amount: 100
          }
        ]
      }
    };
  } catch (error: any) {
    toast.error(`Erro ao carregar detalhes da venda: ${error.message}`);
    return { success: false, error };
  }
}

export async function getSalesStatistics(period: 'day' | 'week' | 'month' = 'month'): 
  Promise<{ success: boolean; data?: any; error?: any }> {
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
}
