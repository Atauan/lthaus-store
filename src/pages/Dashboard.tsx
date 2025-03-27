
import React, { useState, useEffect, useCallback } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import InventoryModule from '@/components/dashboard/InventoryModule';
import SalesAnalysisModule from '@/components/dashboard/SalesAnalysisModule';
import StoreCostsModule from '@/components/dashboard/StoreCostsModule';
import { useSales } from '@/hooks/useSales';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/hooks/products/useProductTypes';
import { toast } from 'sonner';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [isLoadingLowStock, setIsLoadingLowStock] = useState(false);
  
  // Fetch data from hooks
  const { 
    sales, 
    loading: salesLoading, 
    salesStatistics, 
    getSalesStatistics, 
    refresh: refreshSales
  } = useSales();
  
  const { 
    products, 
    loading: productsLoading,
    getLowStockProducts
  } = useProducts();
  
  // Load initial data
  useEffect(() => {
    refreshSales();
    getSalesStatistics(timeRange);
  }, [timeRange, refreshSales, getSalesStatistics]);
  
  // Fetch low stock products
  const fetchLowStockProducts = useCallback(async () => {
    try {
      setIsLoadingLowStock(true);
      const result = await getLowStockProducts();
      
      if (result && 'success' in result) {
        // It's the result object with success/data properties
        if (result.success && result.data) {
          setLowStockProducts(result.data);
        } else {
          setLowStockProducts([]);
          if (result.error) {
            console.error('Error fetching low stock products:', result.error);
          }
        }
      } else if (Array.isArray(result)) {
        // It's already an array
        setLowStockProducts(result);
      } else {
        // Default to empty array for any other case
        setLowStockProducts([]);
      }
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      setLowStockProducts([]);
    } finally {
      setIsLoadingLowStock(false);
    }
  }, [getLowStockProducts]);
  
  useEffect(() => {
    fetchLowStockProducts();
    // Only run this effect once when component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const isLoading = salesLoading || productsLoading || isLoadingLowStock;

  return (
    <PageTransition>
      <div className="container mx-auto p-4 space-y-6">
        <DashboardOverview 
          sales={sales}
          products={products}
          salesStatistics={salesStatistics}
          timeRange={timeRange}
          isLoading={isLoading}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InventoryModule 
            products={products}
            lowStockProducts={lowStockProducts}
            isLoading={productsLoading || isLoadingLowStock}
          />
          <SalesAnalysisModule 
            sales={sales}
            timeRange={timeRange}
            isLoading={salesLoading}
          />
        </div>
        
        <StoreCostsModule />
      </div>
    </PageTransition>
  );
};

export default Dashboard;
