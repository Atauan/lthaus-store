import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Product } from '@/hooks/useProducts';
import { Sale, SaleItem } from '@/hooks/useSales';
import { Skeleton } from '@/components/ui/skeleton';

// Helper to format numbers to a fixed decimal place if they're numbers
const formatToFixed = (value: any, decimals: number = 2) => {
  if (typeof value === 'number') {
    return value.toFixed(decimals);
  }
  return value;
};

interface ProductAnalysisModuleProps {
  sales: Sale[];
  products: Product[];
  isLoading: boolean;
}

const ProductAnalysisModule: React.FC<ProductAnalysisModuleProps> = ({ 
  sales, 
  products, 
  isLoading
}) => {
  const [analysisView, setAnalysisView] = useState<'bestsellers' | 'profitable' | 'category'>('bestsellers');
  
  // Extract all sale items from sales
  const saleItems = useMemo(() => {
    return sales.flatMap(sale => {
      // We might need to get the items separately since they're not included in sale directly
      // This is a placeholder - adjust based on your actual data structure
      const items: SaleItem[] = sale.items || [];
      return items;
    });
  }, [sales]);
  
  // Calculate product performance stats
  const productStats = useMemo(() => {
    const stats = new Map();
    
    saleItems.forEach(item => {
      if (!item.product_id) return;
      
      const existing = stats.get(item.product_id) || { 
        id: item.product_id,
        name: item.name,
        quantity: 0,
        revenue: 0,
        profit: 0
      };
      
      existing.quantity += item.quantity;
      existing.revenue += item.price * item.quantity;
      existing.profit += ((item.price - (item.cost || 0)) * item.quantity);
      
      stats.set(item.product_id, existing);
    });
    
    return Array.from(stats.values());
  }, [saleItems]);
  
  // Best sellers by quantity
  const bestSellers = useMemo(() => {
    return [...productStats]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }, [productStats]);
  
  // Most profitable products
  const mostProfitable = useMemo(() => {
    return [...productStats]
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10);
  }, [productStats]);
  
  // Sales by category
  const salesByCategory = useMemo(() => {
    const categories = new Map();
    
    // Match sale items with products to get categories
    saleItems.forEach(item => {
      if (!item.product_id) return;
      
      const product = products.find(p => p.id === item.product_id);
      if (!product) return;
      
      const category = product.category || 'Sem Categoria';
      const existing = categories.get(category) || { name: category, value: 0 };
      existing.value += item.price * item.quantity;
      categories.set(category, existing);
    });
    
    return Array.from(categories.values());
  }, [saleItems, products]);
  
  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Análise de Produtos</CardTitle>
          <Tabs value={analysisView} onValueChange={(v) => setAnalysisView(v as any)} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bestsellers">Mais Vendidos</TabsTrigger>
              <TabsTrigger value="profitable">Mais Lucrativos</TabsTrigger>
              <TabsTrigger value="category">Por Categoria</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <TabsContent value="bestsellers" className="mt-0">
            <div className="h-80">
              {bestSellers.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bestSellers}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
                    <Tooltip 
                      formatter={(value) => [formatToFixed(value), 'Quantidade']}
                      labelFormatter={(_, payload) => payload[0]?.payload?.name || ''}
                    />
                    <Bar dataKey="quantity" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Não há dados de vendas suficientes para análise.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="profitable" className="mt-0">
            <div className="h-80">
              {mostProfitable.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mostProfitable}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
                    <Tooltip 
                      formatter={(value) => [`R$ ${formatToFixed(value)}`, 'Lucro']}
                      labelFormatter={(_, payload) => payload[0]?.payload?.name || ''}
                    />
                    <Bar dataKey="profit" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Não há dados de lucro suficientes para análise.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="category" className="mt-0">
            <div className="h-80">
              {salesByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${formatToFixed(percent * 100)}%`}
                    >
                      {salesByCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`R$ ${formatToFixed(value)}`, 'Vendas']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Não há dados por categoria suficientes para análise.
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductAnalysisModule;
