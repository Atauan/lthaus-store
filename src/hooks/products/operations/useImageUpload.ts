
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function uploadProductImage(imageFile: File): Promise<string | null> {
  try {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    console.log('Starting image upload to Supabase storage...', filePath);
    
    // Upload the image to Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('products')
      .upload(filePath, imageFile);
      
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      toast.error(`Error uploading image: ${uploadError.message}`);
      return null;
    } 
    
    if (uploadData) {
      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('products')
        .getPublicUrl(filePath);
        
      console.log('Image uploaded successfully, public URL:', publicUrl);
      return publicUrl;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    toast.error(`Error uploading image: ${error.message}`);
    return null;
  }
}

export function useImageUpload() {
  return { uploadProductImage };
}
