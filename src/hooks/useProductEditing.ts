import { useState } from 'react';
import { toast } from "sonner";
import { Product } from '@/hooks/useProducts';

export function useProductEditing(
  updateProduct: (product: Product, imageFile?: File) => Promise<{ success: boolean; error?: Error }>,
  updateCost: (productId: number, newCost: number) => Promise<{ success: boolean; error?: Error }>,
  fetchCostChangeLogs: () => Promise<any[]>
) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<'price' | 'profit' | 'stock' | 'cost' | 'full'>('price');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  
  const openEditDialog = (product: Product, type: 'price' | 'profit' | 'stock' | 'cost' | 'full') => {
    setSelectedProduct(product);
    setEditType(type);
    
    if (type === 'price') {
      setEditValue(product.price.toString());
    } else if (type === 'stock') {
      setEditValue(product.stock.toString());
    } else if (type === 'cost') {
      setEditValue((product.cost || 0).toString());
    } else if (type === 'profit') {
      if (product.cost) {
        const profitMargin = ((product.price - product.cost) / product.cost) * 100;
        setEditValue(profitMargin.toFixed(2));
      } else {
        setEditValue('0');
      }
    }
    
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedProduct) return;
    
    try {
      const numericValue = parseFloat(editValue);
      
      if (isNaN(numericValue)) {
        toast.error("O valor inserido não é válido");
        return;
      }
      
      const updatedProduct = { ...selectedProduct };
      
      if (editType === 'price') {
        if (numericValue <= 0) {
          toast.error("O preço deve ser maior que zero");
          return;
        }
        updatedProduct.price = numericValue;
        toast.success(`Preço do produto "${selectedProduct.name}" atualizado para R$ ${numericValue.toFixed(2)}`);
      } 
      else if (editType === 'stock') {
        if (numericValue < 0 || !Number.isInteger(numericValue)) {
          toast.error("A quantidade em estoque deve ser um número inteiro positivo");
          return;
        }
        updatedProduct.stock = numericValue;
        toast.success(`Estoque do produto "${selectedProduct.name}" atualizado para ${numericValue} unidades`);
      }
      else if (editType === 'cost') {
        if (numericValue < 0) {
          toast.error("O custo deve ser um valor positivo");
          return;
        }
        updateCost(selectedProduct.id, numericValue);
        setEditDialogOpen(false);
        return;
      }
      else if (editType === 'profit') {
        if (!selectedProduct.cost) {
          toast.error("Não é possível definir margem de lucro sem o custo do produto");
          return;
        }
        
        const newPrice = selectedProduct.cost * (1 + numericValue / 100);
        updatedProduct.price = newPrice;
        toast.success(`Margem de lucro do produto "${selectedProduct.name}" definida para ${numericValue}%`);
      }
      
      updateProduct(updatedProduct);
      
      setEditDialogOpen(false);
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar as alterações");
    }
  };

  const handleFullEditSave = async (updatedProduct: Product) => {
    try {
      const imageFile = (updatedProduct as any).file;
      
      const productToUpdate = { ...updatedProduct };
      if ('file' in productToUpdate) {
        delete (productToUpdate as any).file;
      }
      
      const result = await updateProduct(productToUpdate, imageFile);
      
      if (result.success) {
        toast.success(`Produto "${updatedProduct.name}" atualizado com sucesso!`);
      } else {
        toast.error("Erro ao atualizar produto");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar as alterações");
    }
  };

  return {
    editDialogOpen,
    setEditDialogOpen,
    editType,
    selectedProduct,
    editValue,
    setEditValue,
    openEditDialog,
    handleEditSave,
    handleFullEditSave
  };
}
