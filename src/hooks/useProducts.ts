
import { useFetchProducts } from './products/useFetchProducts';
import { useProductFilters } from './products/useProductFilters';
import { useProductLogs } from './products/useProductLogs';
import { useProductOperations } from './products/useProductOperations';
import { useProductSearch } from './products/useProductSearch';

// Re-export types from our types file
export type { Product, StockLog, CostChangeLog } from './products/useProductTypes';
export { categories, brands } from './products/useProductTypes';

export function useProducts() {
  // Use our smaller hooks
  const { 
    products, 
    setProducts, 
    loading 
  } = useFetchProducts();
  
  const { 
    filteredProducts, 
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand
  } = useProductFilters(products);
  
  const {
    stockLogs,
    costChangeLogs,
    fetchStockLogs,
    fetchCostChangeLogs
  } = useProductLogs();
  
  const {
    addProduct,
    updateProduct,
    updateStock,
    updateCost,
    deleteProduct
  } = useProductOperations(products, setProducts);
  
  const {
    searchProducts,
    getLowStockProducts
  } = useProductSearch();
  
  return {
    products,
    filteredProducts,
    stockLogs,
    costChangeLogs,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    addProduct,
    updateProduct,
    updateStock,
    updateCost,
    deleteProduct,
    searchProducts,
    getLowStockProducts,
    fetchStockLogs,
    fetchCostChangeLogs,
    isAuthenticated: true // Kept for compatibility
  };
}
