
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '../useProductTypes';

export function useAddProduct() {
  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>, imageFile?: File) => {
    try {
      let imageUrl = product.image;
      
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
      
      // Inserir o produto com a URL da imagem (se existir)
      const productData = {
        ...product,
        image_url: imageUrl
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        toast.success(`Produto "${product.name}" adicionado com sucesso!`);
        return { success: true, data: data[0] as Product };
      }
      
      return { success: false, error: new Error('Falha ao adicionar produto') };
    } catch (error: any) {
      toast.error(`Erro ao adicionar produto: ${error.message}`);
      return { success: false, error };
    }
  };

  return { addProduct };
}
