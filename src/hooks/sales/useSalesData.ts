
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sale } from './types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useSalesData() {
  const { session } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

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
      // Load mock data when not authenticated
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

  return {
    sales,
    setSales,
    loading,
    isAuthenticated: !!session
  };
}
