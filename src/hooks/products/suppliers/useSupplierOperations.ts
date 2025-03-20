
import { useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Supplier, SupplierFormData } from './types';

export function useSupplierOperations(
  suppliers: Supplier[],
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>
) {
  const { user } = useAuth();

  // Add a new supplier to the database
  const addSupplier = useCallback(async (
    supplierData: SupplierFormData
  ): Promise<{ success: boolean; supplier?: Supplier }> => {
    try {
      // Use the user's ID from the auth context instead of hardcoding "system"
      const userId = user?.id || '00000000-0000-0000-0000-000000000000'; // Default UUID if user is not available
      
      // Insert into database
      const { data, error } = await supabase
        .from('suppliers')
        .insert([{
          name: supplierData.name,
          contact_name: supplierData.contact_name,
          email: supplierData.email,
          phone: supplierData.phone,
          address: supplierData.address,
          user_id: userId, // Use the actual UUID
          categories: supplierData.categories || []
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
  }, [user, setSuppliers]);

  // Update an existing supplier
  const updateSupplier = useCallback(async (
    id: number,
    supplierData: Partial<SupplierFormData>
  ): Promise<{ success: boolean }> => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update(supplierData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setSuppliers(prev => 
        prev.map(supplier => 
          supplier.id === id 
            ? { ...supplier, ...supplierData } 
            : supplier
        )
      );
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating supplier:', error.message);
      toast.error(`Erro ao atualizar fornecedor: ${error.message}`);
      return { success: false };
    }
  }, [setSuppliers]);

  // Delete a supplier
  const deleteSupplier = useCallback(async (
    id: number
  ): Promise<{ success: boolean }> => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting supplier:', error.message);
      toast.error(`Erro ao excluir fornecedor: ${error.message}`);
      return { success: false };
    }
  }, [setSuppliers]);

  return {
    addSupplier,
    updateSupplier,
    deleteSupplier
  };
}
