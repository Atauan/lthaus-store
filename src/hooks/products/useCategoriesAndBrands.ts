
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useCategoriesAndBrands() {
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories and brands on component mount
  useEffect(() => {
    async function fetchCategoriesAndBrands() {
      try {
        setLoading(true);
        
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('name')
          .order('name');
        
        if (categoriesError) throw categoriesError;
        
        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('name')
          .order('name');
        
        if (brandsError) throw brandsError;
        
        // Extract names and update state
        const categoryNames = categoriesData.map(cat => cat.name);
        const brandNames = brandsData.map(brand => brand.name);
        
        setCategories(categoryNames);
        setBrands(brandNames);
      } catch (error: any) {
        console.error('Error fetching categories and brands:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoriesAndBrands();
  }, []);

  // Add a new category to the database
  const addCategory = useCallback(async (name: string): Promise<boolean> => {
    try {
      // Check if category already exists locally
      if (categories.includes(name)) {
        return true; // Already exists, consider it a success
      }
      
      // Insert into database
      const { error } = await supabase
        .from('categories')
        .insert([{ name }]);
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          console.log('Category already exists in the database');
          return true; // Already exists, consider it a success
        }
        throw error;
      }
      
      // Update local state
      setCategories(prev => [...prev, name].sort());
      return true;
    } catch (error: any) {
      console.error('Error adding category:', error.message);
      toast.error(`Erro ao adicionar categoria: ${error.message}`);
      return false;
    }
  }, [categories]);

  // Add a new brand to the database
  const addBrand = useCallback(async (name: string): Promise<boolean> => {
    try {
      // Check if brand already exists locally
      if (brands.includes(name)) {
        return true; // Already exists, consider it a success
      }
      
      // Insert into database
      const { error } = await supabase
        .from('brands')
        .insert([{ name }]);
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          console.log('Brand already exists in the database');
          return true; // Already exists, consider it a success
        }
        throw error;
      }
      
      // Update local state
      setBrands(prev => [...prev, name].sort());
      return true;
    } catch (error: any) {
      console.error('Error adding brand:', error.message);
      toast.error(`Erro ao adicionar marca: ${error.message}`);
      return false;
    }
  }, [brands]);

  return {
    categories,
    brands,
    loading,
    addCategory,
    addBrand
  };
}
