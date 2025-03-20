
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface Supplier {
  id: number;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  categories?: string[];
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch suppliers on component mount
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
      } finally {
        setLoading(false);
      }
    }

    fetchSuppliers();
  }, []);

  // Add a new supplier to the database
  const addSupplier = useCallback(async (
    supplierData: {
      name: string;
      contact_name?: string;
      email?: string;
      phone?: string;
      address?: string;
    }
  ): Promise<{ success: boolean; supplier?: Supplier }> => {
    try {
      // Insert into database
      const { data, error } = await supabase
        .from('suppliers')
        .insert([{
          name: supplierData.name,
          contact_name: supplierData.contact_name,
          email: supplierData.email,
          phone: supplierData.phone,
          address: supplierData.address,
          user_id: 'system', // Since we don't have authentication yet
          categories: []
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      const newSupplier = data as Supplier;
      setSuppliers(prev => [...prev, newSupplier].sort((a, b) => a.name.localeCompare(b.name)));
      
      return { success: true, supplier: newSupplier };
    } catch (error: any) {
      console.error('Error adding supplier:', error.message);
      toast.error(`Erro ao adicionar fornecedor: ${error.message}`);
      return { success: false };
    }
  }, []);

  return {
    suppliers,
    loading,
    addSupplier
  };
}
