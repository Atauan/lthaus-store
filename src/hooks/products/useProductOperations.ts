
import { Product } from './types';
import { useAddProduct } from './operations/useAddProduct';
import { useUpdateProduct } from './operations/useUpdateProduct';
import { useDeleteProduct } from './operations/useDeleteProduct';
import { useStockOperations } from './operations/useStockOperations';
import { useCostOperations } from './operations/useCostOperations';

export function useProductOperations(
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
) {
  const { addProduct: addProductAPI } = useAddProduct();
  const { updateProduct: updateProductAPI } = useUpdateProduct();
  const { deleteProduct: deleteProductAPI } = useDeleteProduct();
  const { updateStock: updateStockAPI } = useStockOperations();
  const { updateCost: updateCostAPI } = useCostOperations();

  const addProduct = async (productData: any, imageFile?: File) => {
    const result = await addProductAPI(productData, imageFile);
    if (result.success && result.data) {
      setProducts(prev => [result.data!, ...prev]);
    }
    return result;
  };

  const updateProduct = async (updatedProduct: Product, imageFile?: File) => {
    const result = await updateProductAPI(updatedProduct, imageFile);
    if (result.success) {
      setProducts(prev => prev.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      ));
    }
    return result;
  };

  const deleteProduct = async (productId: number) => {
    const result = await deleteProductAPI(productId);
    if (result.success) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
    return result;
  };

  const updateStock = async (productId: number, newStock: number, notes?: string) => {
    const result = await updateStockAPI(productId, newStock, notes);
    if (result.success) {
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, stock: newStock } : p
      ));
    }
    return result;
  };

  const updateCost = async (productId: number, newCost: number, notes?: string) => {
    const result = await updateCostAPI(productId, newCost, notes);
    if (result.success) {
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, cost: newCost } : p
      ));
    }
    return result;
  };

  return {
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    updateCost
  };
}
