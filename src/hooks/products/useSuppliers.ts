import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const { user } = useAuth();

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
        toast.error(`Erro ao carregar fornecedores: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('name')
          .order('name');
          
        if (error) throw error;
        
        setAllCategories(data.map(cat => cat.name));
      } catch (error: any) {
        console.error('Error fetching categories:', error.message);
      }
    }

    fetchSuppliers();
    fetchCategories();
  }, []);

  // Add a new supplier to the database
  const addSupplier = useCallback(async (
    supplierData: {
      name: string;
      contact_name?: string;
      email?: string;
      phone?: string;
      address?: string;
      categories?: string[];
    }
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
  }, [user]);

  // Update an existing supplier
  const updateSupplier = useCallback(async (
    id: number,
    supplierData: {
      name?: string;
      contact_name?: string;
      email?: string;
      phone?: string;
      address?: string;
      categories?: string[];
    }
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
  }, []);

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
  }, []);

  // Add a category to the database if it doesn't exist
  const addCategory = useCallback(async (name: string): Promise<boolean> => {
    try {
      // Check if category already exists
      if (allCategories.includes(name)) {
        return true; // Already exists, consider it a success
      }
      
      // Insert into database
      const { error } = await supabase
        .from('categories')
        .insert([{ name }]);
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return true; // Already exists, consider it a success
        }
        throw error;
      }
      
      // Update local state
      setAllCategories(prev => [...prev, name].sort());
      return true;
    } catch (error: any) {
      console.error('Error adding category:', error.message);
      toast.error(`Erro ao adicionar categoria: ${error.message}`);
      return false;
    }
  }, [allCategories]);

  return {
    suppliers,
    loading,
    allCategories,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addCategory
  };
}
