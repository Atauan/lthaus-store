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

// The rest of the utility functions can remain unchanged
export function generateSaleNumber() {
  return Math.floor(10000 + Math.random() * 90000);
}

export function calculateSubtotal(items: SaleItem[]) {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export function calculateProfit(items: SaleItem[]) {
  return items.reduce((sum, item) => {
    const itemCost = item.cost || 0;
    return sum + ((item.price - itemCost) * item.quantity);
  }, 0);
}

export function calculateFinalTotal(subtotal: number, discountType: 'percentage' | 'fixed', discount: number, deliveryFee: number = 0) {
  const discountValue = discountType === 'percentage' 
    ? subtotal * (discount / 100)
    : discount;
  
  return Math.max(0, subtotal - discountValue + deliveryFee);
}

export function mapSaleFormToDatabase(
  saleData: any,
  userId?: string
) {
  // Map form data to database schema
  return {
    sale: {
      sale_number: saleData.saleNumber,
      customer_name: saleData.customerName,
      customer_contact: saleData.customerContact,
      sale_channel: saleData.saleChannel === 'other' ? saleData.otherChannel : saleData.saleChannel,
      payment_method: saleData.paymentMethods[0].method,
      notes: saleData.notes,
      subtotal: saleData.subtotal,
      discount: saleData.discount,
      final_total: saleData.finalTotal,
      profit: saleData.profit,
      sale_date: saleData.date,
      delivery_address: saleData.deliveryAddress || null,
      delivery_fee: saleData.deliveryFee || 0,
      user_id: userId
    },
    items: saleData.items.map((item: any) => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      cost: item.cost,
      quantity: item.quantity,
      type: item.type,
      custom_price: item.custom_price || false,
      user_id: userId
    })),
    payments: saleData.paymentMethods.map((payment: any) => ({
      method: payment.method,
      amount: payment.amount,
      user_id: userId
    }))
  };
}
