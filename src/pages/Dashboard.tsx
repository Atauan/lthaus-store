
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageTransition from '@/components/layout/PageTransition';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import SalesAnalysisModule from '@/components/dashboard/SalesAnalysisModule';
import InventoryModule from '@/components/dashboard/InventoryModule';
import ProductAnalysisModule from '@/components/dashboard/ProductAnalysisModule';
import StoreCostsModule from '@/components/dashboard/StoreCostsModule';
import CustomersModule from '@/components/dashboard/CustomersModule';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { useSales } from '@/hooks/useSales';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
  const { 
    sales, 
    loading: salesLoading, 
    salesStatistics, 
    periodSales, 
    isLoadingStatistics 
  } = useSales();
  
  const { products, loading: productsLoading, lowStockProducts } = useProducts();
  
  // Calculate metric for low stock alert
  const lowStockCount = lowStockProducts?.length || 0;
  
  if (salesLoading || productsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={(value) => setActiveTab(value as string)}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="inventory">Estoque</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview 
              sales={sales}
              products={products}
              salesStatistics={salesStatistics}
              timeRange={timeRange}
              isLoading={isLoadingStatistics}
            />
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <SalesAnalysisModule 
              sales={sales}
              timeRange={timeRange}
              isLoading={isLoadingStatistics}
            />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <InventoryModule 
              products={products}
              lowStockProducts={lowStockProducts || []}
              isLoading={productsLoading}
            />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomersModule 
              sales={sales}
              isLoading={salesLoading}
            />
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <StoreCostsModule />
              
              <ProductAnalysisModule 
                sales={sales}
                products={products}
                isLoading={salesLoading || productsLoading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
