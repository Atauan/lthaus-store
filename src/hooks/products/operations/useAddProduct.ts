
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '../types';
import { uploadProductImage } from './useImageUpload';

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
      
      // Create the complete product data object
      const productData = {
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        min_stock: product.min_stock,
        image: product.image,
        image_url: imageUrl || product.image_url
      };
      
      toast.loading('Adding product...');
      
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select();
        
      toast.dismiss();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        toast.success(`Product "${product.name}" added successfully!`);
        return { success: true, data: data[0] as Product };
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
