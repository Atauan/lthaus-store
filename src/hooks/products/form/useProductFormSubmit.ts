
import { UseFormReturn } from 'react-hook-form';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';
import { Product } from '../types';

interface ProductOperations {
  addProduct: (product: any, imageFile?: File) => Promise<{ success: boolean; error?: any }>;
  updateProduct: (product: Product, imageFile?: File) => Promise<{ success: boolean; error?: any }>;
}

export function useProductFormSubmit(
  form: UseFormReturn<any>,
  isEditing: boolean,
  editProduct: Product | undefined,
  selectedImages: File[],
  productOperations: ProductOperations,
  navigate: NavigateFunction,
  setIsSubmitting: (submitting: boolean) => void
) {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = form.getValues();
    const imageFile = selectedImages.length > 0 ? selectedImages[0] : undefined;
    
    // Validate required fields
    if (!formData.name || !formData.category || !formData.brand) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (formData.salePrice <= 0) {
      toast.error('O preço de venda deve ser maior que zero');
      return;
    }

    if (formData.stock < 0) {
      toast.error('O estoque não pode ser negativo');
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description || '',
        category: formData.category,
        brand: formData.brand,
        price: Number(formData.salePrice),
        cost: Number(formData.costPrice) || 0,
        stock: Number(formData.stock),
        min_stock: Number(formData.minStock) || 5,
        image: '',
        image_url: ''
      };

      let result;
      
      if (isEditing && editProduct) {
        const updatedProduct = {
          ...editProduct,
          ...productData
        };
        result = await productOperations.updateProduct(updatedProduct, imageFile);
      } else {
        result = await productOperations.addProduct(productData, imageFile);
      }

      if (result.success) {
        navigate('/products');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erro ao salvar produto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { onSubmit };
}
