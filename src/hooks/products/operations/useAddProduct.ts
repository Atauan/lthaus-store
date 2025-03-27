
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '../useProductTypes';
import { uploadProductImage } from './useImageUpload';
import { requestCache } from '@/utils/requestCache';

export function useAddProduct() {
  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>, imageFile?: File) => {
    try {
      let imageUrl = null;
      
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
      
      // Convert minStock to min_stock if it exists
      const productData = {
        ...product,
        image_url: imageUrl
      };
      
      toast.loading('Adding product...');
      
      // Type safety: explicit casting to avoid TypeScript errors
      const { data, error } = await supabase
        .from('products')
        .insert(productData as any)
        .select();
        
      toast.dismiss();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Invalidate products cache
        requestCache.clear('products_list');
        
        toast.success(`Product "${product.name}" added successfully!`);
        return { success: true, data: data[0] as unknown as Product };
      }
      
      return { success: false, error: new Error('Failed to add product') };
    } catch (error: any) {
      toast.dismiss();
      toast.error(`Error adding product: ${error.message}`);
      return { success: false, error };
    }
  };

  return { addProduct };
}
