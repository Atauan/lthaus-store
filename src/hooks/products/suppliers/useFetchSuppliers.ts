import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Supplier } from './types';

export function useFetchSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('suppliers')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setSuppliers(data as Supplier[]);
      } catch (error: any) {
        console.error('Error fetching suppliers:', error.message);
        toast.error(`Erro ao carregar fornecedores: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchSuppliers();
  }, []);

  return {
    suppliers,
    setSuppliers,
    loading
  };
}
