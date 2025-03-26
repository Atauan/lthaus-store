
import React, { useState, useEffect } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import InventoryModule from '@/components/dashboard/InventoryModule';
import SalesAnalysisModule from '@/components/dashboard/SalesAnalysisModule';
import StoreCostsModule from '@/components/dashboard/StoreCostsModule';
import { useSales } from '@/hooks/useSales';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/hooks/products/useProductTypes';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  
  // Fetch data from hooks
  const { 
    sales, 
    loading: salesLoading, 
    salesStatistics, 
    getSalesStatistics, 
  } = useSales();
  
  const { 
    products, 
    loading: productsLoading,
    getLowStockProducts
  } = useProducts();
  
  // Load initial data
  useEffect(() => {
    getSalesStatistics(timeRange);
  }, [timeRange, getSalesStatistics]);
  
  // Fetch low stock products
  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const result = await getLowStockProducts();
        
        // Check if result is Promise or already resolved
        if (result && typeof result === 'object' && 'success' in result) {
          // It's the result object with success/data properties
          if (result.success && result.data) {
            setLowStockProducts(result.data);
          } else {
            setLowStockProducts([]);
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
      }
    };
    
    fetchLowStockProducts();
  }, [getLowStockProducts]);
  
  const isLoading = salesLoading || productsLoading;

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
            isLoading={productsLoading}
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
