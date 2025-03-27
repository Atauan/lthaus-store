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
      
      // If data exists, set it with proper field mapping
      if (data) {
        // Map database fields to our interface
        const mappedData: StoreInfo = {
          name: data.name,
          cnpj: data.cnpj || '',
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipcode, // Map zipcode from DB to zipCode in interface
          phone: data.phone || '',
          email: data.email || '',
          ownerName: data.ownername || '', // Map ownername from DB to ownerName in interface
          defaultSeller: data.defaultseller || '', // Map defaultseller from DB to defaultSeller in interface
          latitude: data.latitude,
          longitude: data.longitude
        };
        
        setStoreInfo(mappedData);
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
      
      // Map our interface fields to database column names
      const dbData = {
        name: info.name,
        cnpj: info.cnpj,
        address: info.address,
        city: info.city,
        state: info.state,
        zipcode: info.zipCode, // Map zipCode to zipcode for DB
        phone: info.phone,
        email: info.email,
        ownername: info.ownerName, // Map ownerName to ownername for DB
        defaultseller: info.defaultSeller, // Map defaultSeller to defaultseller for DB
        latitude: info.latitude,
        longitude: info.longitude
      };
      
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
          .update(dbData)
          .eq('id', existingData[0].id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('store_info')
          .insert([dbData]);
        
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
