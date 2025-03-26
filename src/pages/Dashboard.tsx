
import React, { useState, useEffect } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import InventoryModule from '@/components/dashboard/InventoryModule';
import SalesAnalysisModule from '@/components/dashboard/SalesAnalysisModule';
import StoreCostsModule from '@/components/dashboard/StoreCostsModule';
import { useSales } from '@/hooks/useSales';
import { useProducts } from '@/hooks/useProducts';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
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
  
  const lowStockProducts = getLowStockProducts() || [];
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
