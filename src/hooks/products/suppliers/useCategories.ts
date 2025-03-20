
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useCategories() {
  const [allCategories, setAllCategories] = useState<string[]>([]);

  useEffect(() => {
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

    fetchCategories();
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
    allCategories,
    addCategory
  };
}
