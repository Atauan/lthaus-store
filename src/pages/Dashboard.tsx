
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
import { requestCache } from '@/utils/requestCache';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [isLoadingLowStock, setIsLoadingLowStock] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
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
    const loadData = async () => {
      try {
        setLoadingError(null);
        await refreshSales();
        await getSalesStatistics(timeRange);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setLoadingError("Erro ao carregar dados do dashboard. Tente novamente mais tarde.");
        toast.error("Erro ao carregar dados do dashboard");
      }
    };
    
    loadData();
  }, [timeRange, refreshSales, getSalesStatistics]);
  
  // Fetch low stock products
  const fetchLowStockProducts = useCallback(async () => {
    try {
      setIsLoadingLowStock(true);
      setLoadingError(null);
      const result = await getLowStockProducts();
      
      if (result && 'success' in result) {
        // It's the result object with success/data properties
        if (result.success && result.data) {
          setLowStockProducts(result.data);
        } else {
          setLowStockProducts([]);
          if (result.error) {
            console.error('Error fetching low stock products:', result.error);
            setLoadingError("Erro ao carregar produtos com estoque baixo");
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
      setLoadingError("Erro ao carregar produtos com estoque baixo");
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
  
  // Request queue status for debugging
  const [requestStatus, setRequestStatus] = useState<any>(null);
  
  // Update status periodically for debugging
  useEffect(() => {
    const interval = setInterval(() => {
      setRequestStatus(requestCache.getThrottleStatus());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <PageTransition>
      <div className="container mx-auto p-4 space-y-6">
        {loadingError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Erro!</strong>
            <span className="block sm:inline"> {loadingError}</span>
            <button 
              className="absolute top-0 right-0 px-4 py-3"
              onClick={() => {
                setLoadingError(null);
                refreshSales();
                fetchLowStockProducts();
              }}
            >
              Tentar novamente
            </button>
          </div>
        )}
        
        {requestStatus?.isThrottled && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Atenção!</strong>
            <span className="block sm:inline"> Muitas requisições detectadas. Algumas operações estão sendo limitadas até {requestStatus.throttleEndTime}.</span>
          </div>
        )}
        
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
