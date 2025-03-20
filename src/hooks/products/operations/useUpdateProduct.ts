
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '../useProductTypes';

export function useUpdateProduct() {
  const updateProduct = async (updatedProduct: Product, imageFile?: File) => {
    try {
      let imageUrl = updatedProduct.image_url || updatedProduct.image;
      
      // Se tiver arquivo de imagem, enviar para o Storage primeiro
      if (imageFile) {
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
        } else if (uploadData) {
          // Obter URL pública
          const { data: { publicUrl } } = supabase
            .storage
            .from('products')
            .getPublicUrl(filePath);
            
          imageUrl = publicUrl;
        }
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
      
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', updatedProduct.id);
        
      if (error) {
        throw error;
      }
      
      toast.success(`Produto "${updatedProduct.name}" atualizado com sucesso!`);
      return { success: true, data: productData as Product };
    } catch (error: any) {
      toast.error(`Erro ao atualizar produto: ${error.message}`);
      return { success: false, error };
    }
  };

  return { updateProduct };
}
