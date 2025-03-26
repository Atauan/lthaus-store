
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import PageTransition from '@/components/layout/PageTransition';
import { useSales } from '@/hooks/useSales';
import { useProducts } from '@/hooks/useProducts';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import InventoryModule from '@/components/dashboard/InventoryModule';
import SalesAnalysisModule from '@/components/dashboard/SalesAnalysisModule';
import CustomersModule from '@/components/dashboard/CustomersModule';
import ProductAnalysisModule from '@/components/dashboard/ProductAnalysisModule';
import { Product } from '@/hooks/products/useProductTypes';
import { toast } from 'sonner';

export default function SalesDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
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
  
  // Get low stock products
  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        setIsLoadingLowStock(true);
        const result = await getLowStockProducts();
        
        if (result && 'success' in result) {
          // It's the result object with success/data properties
          if (result.success && result.data) {
            setLowStockItems(result.data);
          } else {
            setLowStockItems([]);
            if (result.error) {
              toast.error(`Error fetching low stock products: ${result.error}`);
            }
          }
        } else if (Array.isArray(result)) {
          // It's already an array
          setLowStockItems(result);
        } else {
          // Default to empty array for any other case
          setLowStockItems([]);
        }
      } catch (error) {
        console.error('Error fetching low stock products:', error);
        setLowStockItems([]);
        toast.error('Failed to fetch low stock products');
      } finally {
        setIsLoadingLowStock(false);
      }
    };
    
    fetchLowStock();
  }, [getLowStockProducts]);

  const handlePeriodChange = (value: string) => {
    setTimeRange(value as 'day' | 'week' | 'month' | 'year');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 pt-20 pb-10">
        <PageTransition>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard de Análise</h1>
                <p className="text-muted-foreground">
                  Visualize insights estratégicos sobre o desempenho comercial
                </p>
              </div>
              
              <Tabs
                defaultValue={timeRange}
                value={timeRange}
                onValueChange={handlePeriodChange}
                className="w-full md:w-auto"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="day">Hoje</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="month">Mês</TabsTrigger>
                  <TabsTrigger value="year">Ano</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full max-w-3xl mx-auto mb-6 overflow-x-auto flex-nowrap">
                <TabsTrigger value="overview" className="flex-1">
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex-1">
                  Estoque
                </TabsTrigger>
                <TabsTrigger value="sales-analysis" className="flex-1">
                  Análise de Vendas
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex-1">
                  Clientes
                </TabsTrigger>
                <TabsTrigger value="product-analysis" className="flex-1">
                  Análise de Produtos
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <DashboardOverview 
                  sales={sales} 
                  products={products}
                  salesStatistics={salesStatistics}
                  timeRange={timeRange}
                  isLoading={salesLoading || productsLoading || isLoadingLowStock}
                />
              </TabsContent>
              
              <TabsContent value="inventory">
                <InventoryModule 
                  products={products}
                  lowStockProducts={lowStockItems}
                  isLoading={productsLoading || isLoadingLowStock}
                />
              </TabsContent>
              
              <TabsContent value="sales-analysis">
                <SalesAnalysisModule 
                  sales={sales}
                  timeRange={timeRange}
                  isLoading={salesLoading}
                />
              </TabsContent>
              
              <TabsContent value="customers">
                <CustomersModule 
                  sales={sales}
                  isLoading={salesLoading}
                />
              </TabsContent>
              
              <TabsContent value="product-analysis">
                <ProductAnalysisModule 
                  sales={sales}
                  products={products}
                  isLoading={salesLoading || productsLoading}
                />
              </TabsContent>
            </Tabs>
          </div>
        </PageTransition>
      </main>
    </div>
  );
}
