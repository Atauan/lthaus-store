
import { supabase } from '@/integrations/supabase/client';
import { Sale, SaleDetails, SalesStatistics, SaleItem, SalePayment } from './types';
import { toast } from 'sonner';

export async function fetchSales(): Promise<{ data: Sale[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('sale_date', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return { data: data as Sale[], error: null };
  } catch (error: any) {
    toast.error(`Erro ao carregar vendas: ${error.message}`);
    return { data: null, error };
  }
}

export async function getSaleDetails(saleId: number): Promise<{ success: boolean; data?: SaleDetails; error?: any }> {
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
}

export async function getSalesStatistics(period: 'day' | 'week' | 'month' = 'month'): 
  Promise<{ success: boolean; data?: SalesStatistics; error?: any }> {
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

export async function createSale(
  sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>,
  items: Omit<SaleItem, 'id' | 'created_at' | 'updated_at' | 'sale_id'>[],
  payments: Omit<SalePayment, 'id' | 'created_at' | 'updated_at' | 'sale_id'>[]
): Promise<{ success: boolean; data?: SaleDetails; error?: any }> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Start a transaction
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
    
    // Insert items
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
    
    // Insert payments
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
    
    // Return the complete sale details
    return await getSaleDetails(saleId);
  } catch (error: any) {
    toast.error(`Erro ao criar venda: ${error.message}`);
    return { success: false, error };
  }
}
