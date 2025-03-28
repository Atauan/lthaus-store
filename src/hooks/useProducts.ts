
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product, StockLog, CostChangeLog } from './products/types';
import { useFetchProducts } from './products/useFetchProducts';
import { useProductFilters } from './products/useProductFilters';
import { useProductOperations } from './products/useProductOperations';
import { useProductLogs } from './products/useProductLogs';

const ITEMS_PER_PAGE = 50;

// Re-export types
export type { Product, StockLog, CostChangeLog };

// Exportando brands diretamente
export const brands = ['Todas', 'Apple', 'Samsung', 'Anker', 'JBL', 'Generic'];

export function useProducts() {
  // Use the extracted hooks
  const { products, setProducts, loading } = useFetchProducts();
  const { filteredProducts, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, selectedBrand, setSelectedBrand } = useProductFilters(products);
  const { addProduct, updateProduct, updateStock, updateCost, deleteProduct } = useProductOperations(products, setProducts);
  const { stockLogs, costChangeLogs, fetchStockLogs, fetchCostChangeLogs } = useProductLogs();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  
  // Calculate if there are more items to load
  useEffect(() => {
    setHasMore(products.length > currentPage * ITEMS_PER_PAGE);
  }, [products, currentPage]);
  
  // Set low stock products
  useEffect(() => {
    const lowStock = products.filter(product => 
      product.stock <= (product.min_stock || 5)
    );
    setLowStockProducts(lowStock);
  }, [products]);
  
  // Function to load more products for pagination
  const loadMore = useCallback(() => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore]);
  
  // Function to get low stock products
  const getLowStockProducts = useCallback(async () => {
    return lowStockProducts;
  }, [lowStockProducts]);

  // Return all necessary properties and functions
  return {
    products,
    loading,
    currentPage,
    hasMore,
    loadMore,
    categories: ['Todas', 'Cabos', 'Capas', 'Áudio', 'Carregadores', 'Proteção', 'Acessórios'],
    filteredProducts,
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
    stockLogs,
    costChangeLogs,
    fetchStockLogs,
    fetchCostChangeLogs,
    lowStockProducts,
    getLowStockProducts
  };
}
