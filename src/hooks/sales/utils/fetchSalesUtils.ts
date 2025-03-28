
import { supabase } from '@/integrations/supabase/client';
import { Sale, DateRange } from '../types';
import { toast } from 'sonner';

// Fetch sales with optional date range filtering
export async function fetchSales(dateRange?: DateRange, status?: string) {
  try {
    let query = supabase.from('sales').select('*');
    
    // Apply date range filter
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
    
    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    // Execute query
    const { data, error } = await query.order('sale_date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return { success: true, data: data as Sale[] };
  } catch (error: any) {
    toast.error(`Erro ao carregar vendas: ${error.message}`);
    console.error('Error fetching sales:', error);
    return { success: false, error: error.message };
  }
}

// Fetch a single sale by ID
export async function fetchSaleById(saleId: number) {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('id', saleId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return { success: true, data: data as Sale };
  } catch (error: any) {
    console.error('Error fetching sale:', error);
    return { success: false, error: error.message };
  }
}

// Update sale status
export async function updateSaleStatus(saleId: number, status: string) {
  try {
    const { data, error } = await supabase
      .from('sales')
      .update({ status })
      .eq('id', saleId)
      .select();
      
    if (error) {
      throw error;
    }
    
    return { success: true, data: data?.[0] as Sale };
  } catch (error: any) {
    console.error('Error updating sale status:', error);
    return { success: false, error: error.message };
  }
}
