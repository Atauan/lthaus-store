
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductData {
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  cost?: number;
}

export function useProductAutoFill() {
  const [loading, setLoading] = useState(false);
  
  const analyzeProductImage = async (
    imageFile: File
  ): Promise<{ success: boolean; data?: ProductData; error?: string }> => {
    try {
      setLoading(true);
      
      // Convert the file to base64
      const base64Image = await fileToBase64(imageFile);
      
      // Call the Supabase Edge Function to analyze the image
      const { data, error } = await supabase.functions.invoke('analyze-product', {
        body: { image: base64Image }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Falha ao analisar a imagem do produto');
      }
      
      return {
        success: true,
        data: data.productData
      };
    } catch (error: any) {
      console.error('Error analyzing product image:', error);
      return {
        success: false,
        error: error.message || 'Erro ao analisar a imagem do produto'
      };
    } finally {
      setLoading(false);
    }
  };
  
  const analyzeProductName = async (
    productName: string
  ): Promise<{ success: boolean; data?: ProductData; error?: string }> => {
    try {
      setLoading(true);
      
      // Call the Supabase Edge Function to analyze the product name
      const { data, error } = await supabase.functions.invoke('analyze-product', {
        body: { productName }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Falha ao analisar o nome do produto');
      }
      
      return {
        success: true,
        data: data.productData
      };
    } catch (error: any) {
      console.error('Error analyzing product name:', error);
      return {
        success: false,
        error: error.message || 'Erro ao analisar o nome do produto'
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };
  
  return {
    loading,
    analyzeProductImage,
    analyzeProductName
  };
}
