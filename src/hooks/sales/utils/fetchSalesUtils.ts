import { supabase } from '@/integrations/supabase/client';
import { Sale } from '../types';
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
