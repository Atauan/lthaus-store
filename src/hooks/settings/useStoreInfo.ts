
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface StoreInfo {
  name: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  ownerName: string;
  defaultSeller: string;
  latitude?: number;
  longitude?: number;
}

export function useStoreInfo() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreInfo();
  }, []);

  const fetchStoreInfo = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Use default values if not authenticated
        setStoreInfo({
          name: 'Lthaus Imports',
          cnpj: '',
          address: 'Av. Francisco José da Fonseca, 937',
          city: 'Aracaju',
          state: 'SE',
          zipCode: '49042-000',
          phone: '',
          email: '',
          ownerName: '',
          defaultSeller: '',
          latitude: -10.9342,  // Default coordinates for Aracaju
          longitude: -37.0677
        });
        return;
      }
      
      // Fetch store info from database
      const { data, error } = await supabase
        .from('store_info')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // Handle error but not "No rows returned" error
        throw error;
      }
      
      // If data exists, set it
      if (data) {
        setStoreInfo(data as StoreInfo);
      } else {
        // Set default values
        setStoreInfo({
          name: 'Lthaus Imports',
          cnpj: '',
          address: 'Av. Francisco José da Fonseca, 937',
          city: 'Aracaju',
          state: 'SE',
          zipCode: '49042-000',
          phone: '',
          email: '',
          ownerName: '',
          defaultSeller: '',
          latitude: -10.9342,  // Default coordinates for Aracaju
          longitude: -37.0677
        });
      }
    } catch (error: any) {
      toast.error(`Erro ao carregar informações da loja: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveStoreInfo = async (info: StoreInfo) => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Check if record exists
      const { data: existingData, error: fetchError } = await supabase
        .from('store_info')
        .select('id')
        .limit(1);
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        const { error } = await supabase
          .from('store_info')
          .update(info)
          .eq('id', existingData[0].id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('store_info')
          .insert([info]);
        
        if (error) throw error;
      }
      
      // Update local state
      setStoreInfo(info);
    } catch (error: any) {
      toast.error(`Erro ao salvar informações da loja: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    storeInfo,
    loading,
    fetchStoreInfo,
    saveStoreInfo
  };
}
