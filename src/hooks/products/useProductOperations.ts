
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from './types';

export function useProductOperations(products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>>) {
  // Add a new product
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
        // Add new product to state
        setProducts(prev => [...prev, data[0] as Product]);
        toast.success(`Produto "${product.name}" adicionado com sucesso!`);
        return { success: true, data: data[0] as Product };
      }
      
      return { success: false, error: new Error('Falha ao adicionar produto') };
    } catch (error: any) {
      toast.error(`Erro ao adicionar produto: ${error.message}`);
      return { success: false, error };
    }
  };

  // Update an existing product
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
      
      // Inserir o produto com a URL da imagem (se existir)
      const productData = {
        ...updatedProduct,
        image_url: imageUrl
      };
      
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', updatedProduct.id);
        
      if (error) {
        throw error;
      }
      
      // Update product in state
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === updatedProduct.id ? {...productData as Product} : p)
      );
      
      toast.success(`Produto "${updatedProduct.name}" atualizado com sucesso!`);
      return { success: true };
    } catch (error: any) {
      toast.error(`Erro ao atualizar produto: ${error.message}`);
      return { success: false, error };
    }
  };

  // Update stock manually
  const updateStock = async (productId: number, newStock: number, notes: string = 'Atualização manual') => {
    try {
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        throw new Error('Produto não encontrado');
      }
      
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);
        
      if (error) {
        throw error;
      }
      
      // Update product in state
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === productId ? { ...p, stock: newStock } : p)
      );
      
      toast.success(`Estoque do produto "${product.name}" atualizado para ${newStock} unidades.`);
      
      // Stock log will be created automatically by the database trigger
      return { success: true };
    } catch (error: any) {
      toast.error(`Erro ao atualizar estoque: ${error.message}`);
      return { success: false, error };
    }
  };

  // Delete a product
  const deleteProduct = async (id: number) => {
    try {
      const product = products.find(p => p.id === id);
      
      if (!product) {
        throw new Error('Produto não encontrado');
      }
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Remove product from state
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      toast.success(`Produto "${product.name}" excluído com sucesso!`);
      return { success: true };
    } catch (error: any) {
      toast.error(`Erro ao excluir produto: ${error.message}`);
      return { success: false, error };
    }
  };

  return {
    addProduct,
    updateProduct,
    updateStock,
    deleteProduct
  };
}
