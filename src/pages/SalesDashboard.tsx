import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageTransition from '@/components/layout/PageTransition';
import { Product, useProducts } from '@/hooks/useProducts';
import { useSales } from '@/hooks/useSales';
import { useStoreCosts } from '@/hooks/settings/useStoreCosts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LowStockTable from '@/components/dashboard/inventory/LowStockTable';
import StagnantProductsTable from '@/components/dashboard/inventory/StagnantProductsTable';
import MonthlyProfitChart from '@/components/dashboard/MonthlyProfitChart';
import PriceComparisonChart from '@/components/dashboard/inventory/PriceComparisonChart';
import InventoryMetricsCards from '@/components/dashboard/inventory/InventoryMetricsCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertTriangle, PackageOpen, ArrowDownUp, ArrowRightLeft } from 'lucide-react';
import { periodToDateRange } from '@/hooks/sales/utils/dateRangeUtils';

const SalesDashboard = () => {
  const navigate = useNavigate();
  const { getLowStockProducts, products } = useProducts();
  const { salesStatistics, getSalesStatistics, isLoadingStatistics } = useSales();
  const { costs: storeCosts } = useStoreCosts();
  
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [stagnantProducts, setStagnantProducts] = useState<Product[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalStock: 0,
    productsCount: 0,
    lowStockCount: 0,
    stagnantCount: 0
  });
  const [productMarginData, setProductMarginData] = useState<any[]>([]);
  
  useEffect(() => {
    const loadLowStockProducts = async () => {
      try {
        const response = await getLowStockProducts();
        
        if (response.success) {
          setLowStockItems(response.data);
        } else {
          console.error("Error fetching low stock products");
          toast.error("Error loading low stock products");
        }
      } catch (error: any) {
        console.error("Error:", error);
        toast.error(`An unexpected error occurred: ${error.message}`);
      }
    };
    
    loadLowStockProducts();
    
    setStagnantProducts([
      {
        id: 1,
        name: "Product A",
        price: 49.99,
        cost: 25,
        stock: 15,
        category: "Category 1",
        brand: "Brand X",
        min_stock: 5
      },
      {
        id: 2,
        name: "Product B",
        price: 99.99,
        cost: 50,
        stock: 8,
        category: "Category 2",
        brand: "Brand Y",
        min_stock: 3
      },
      {
        id: 3,
        name: "Product C",
        price: 29.99,
        cost: 12,
        stock: 20,
        category: "Category 1",
        brand: "Brand Z",
        min_stock: 10
      }
    ]);
    
    setDashboardMetrics({
      totalStock: products.reduce((sum, product) => sum + product.stock, 0),
      productsCount: products.length,
      lowStockCount: lowStockItems.length, 
      stagnantCount: 5
    });
    
    setProductMarginData([
      { category: 'Cabos', costToPrice: 0.4 },
      { category: 'Capas', costToPrice: 0.5 },
      { category: 'Áudio', costToPrice: 0.6 },
      { category: 'Carregadores', costToPrice: 0.3 },
      { category: 'Proteção', costToPrice: 0.4 },
    ]);
    
    getSalesStatistics({
      from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      to: new Date()
    });
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyProfitData = months.map((month, index) => {
      const revenue = Math.random() * 5000 + 3000;
      const cost = revenue * (Math.random() * 0.4 + 0.3);
      return {
        month,
        revenue: revenue,
        profit: revenue - cost,
        costs: cost
      };
    });
    
    setMonthlyData(monthlyProfitData);
  }, [getLowStockProducts, getSalesStatistics, products, lowStockItems.length]);
  
  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 pb-10">
          <h1 className="text-3xl font-bold mb-6">Sales & Inventory Dashboard</h1>
          
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Monthly Profit Overview</CardTitle>
                    <Button variant="ghost" size="sm" className="text-sm">
                      View Detailed Report <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>Revenue, costs, and profit for the past year</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <MonthlyProfitChart data={monthlyData} />
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                        Low Stock Items
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-sm"
                        onClick={() => navigate('/inventory')}
                      >
                        View All <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>Products that need restocking soon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LowStockTable 
                      lowStockProducts={lowStockItems.slice(0, 5)} 
                      totalStock={dashboardMetrics.totalStock}
                      lowStockCount={dashboardMetrics.lowStockCount}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <ArrowDownUp className="mr-2 h-5 w-5 text-blue-500" />
                        Price Analysis
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-sm"
                        onClick={() => navigate('/products')}
                      >
                        Manage Products <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>Compare cost to price ratios across categories</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px]">
                    <PriceComparisonChart productMarginData={productMarginData} />
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <ArrowRightLeft className="mr-2 h-5 w-5 text-purple-500" />
                      Slow-Moving Inventory
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-sm"
                      onClick={() => navigate('/inventory')}
                    >
                      Full Inventory Report <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>Products with low sales velocity that might need attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <StagnantProductsTable stagnantProducts={stagnantProducts} daysThreshold={30} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-6">
              <InventoryMetricsCards 
                totalStock={dashboardMetrics.totalStock}
                productsCount={dashboardMetrics.productsCount}
                lowStockCount={dashboardMetrics.lowStockCount}
                stagnantCount={dashboardMetrics.stagnantCount}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Low Stock Products</CardTitle>
                    <CardDescription>Products that need restocking soon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LowStockTable 
                      lowStockProducts={lowStockItems} 
                      totalStock={dashboardMetrics.totalStock}
                      lowStockCount={dashboardMetrics.lowStockCount}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Stagnant Products</CardTitle>
                    <CardDescription>Products with low sales velocity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StagnantProductsTable stagnantProducts={stagnantProducts} daysThreshold={30} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="sales" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analytics Dashboard</CardTitle>
                  <CardDescription>Detailed sales analytics coming soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This feature is under development</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
};

export default SalesDashboard;
