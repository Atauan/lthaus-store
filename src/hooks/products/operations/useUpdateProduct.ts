
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '../useProductTypes';
import { uploadProductImage } from './useImageUpload';

export function useUpdateProduct() {
  const updateProduct = async (updatedProduct: Product, imageFile?: File) => {
    try {
      let imageUrl = updatedProduct.image_url || updatedProduct.image;
      
      // If there's an image file, upload it to Storage first
      if (imageFile) {
        toast.loading('Uploading product image...');
        
        imageUrl = await uploadProductImage(imageFile);
        
        if (!imageUrl) {
          toast.error('Failed to upload image');
          return { success: false, error: new Error('Failed to upload image') };
        }
        
        toast.dismiss();
      }
      
      // Create a clean product object for the database update
      // Removing any file property that might have been added
      const productData = {
        ...updatedProduct,
        image_url: imageUrl
      };
      
      // Remove the file property if it exists
      if ('file' in productData) {
        delete (productData as any).file;
      }
      
      toast.loading('Updating product...');
      
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', updatedProduct.id);
        
      toast.dismiss();
      
      if (error) {
        throw error;
      }
      
      toast.success(`Product "${updatedProduct.name}" updated successfully!`);
      return { success: true, data: productData as Product };
    } catch (error: any) {
      toast.dismiss();
      toast.error(`Error updating product: ${error.message}`);
      return { success: false, error };
    }
  };

  return { updateProduct };
}
