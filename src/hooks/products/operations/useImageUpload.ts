
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function uploadProductImage(imageFile: File) {
  try {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;
    
    // Enviar a imagem para o Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('products')
      .upload(filePath, imageFile);
      
    if (uploadError) {
      console.error('Erro ao fazer upload da imagem:', uploadError);
      toast.error(`Erro ao fazer upload da imagem: ${uploadError.message}`);
      return null;
    } 
    
    if (uploadData) {
      // Obter URL pública
      const { data: { publicUrl } } = supabase
        .storage
        .from('products')
        .getPublicUrl(filePath);
        
      return publicUrl;
    }
    
    return null;
  } catch (error: any) {
    console.error('Erro ao fazer upload da imagem:', error);
    toast.error(`Erro ao fazer upload da imagem: ${error.message}`);
    return null;
  }
}

export function useImageUpload() {
  return { uploadProductImage };
}
