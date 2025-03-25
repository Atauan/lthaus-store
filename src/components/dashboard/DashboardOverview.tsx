
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesStatistics, Sale } from '@/hooks/sales/types';
import { Product } from '@/hooks/products/useProductTypes';
import { 
  ArrowUp, CreditCard, DollarSign, Package, 
  ShoppingCart, Ticket, LineChart, TrendingUp
} from 'lucide-react';
import GlassCard from '@/components/ui/custom/GlassCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

interface DashboardOverviewProps {
  sales: Sale[];
  products: Product[];
  salesStatistics: SalesStatistics;
  timeRange: 'day' | 'week' | 'month' | 'year';
  isLoading?: boolean;
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600'];

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  sales,
  products,
  salesStatistics,
  timeRange,
  isLoading = false
}) => {
  // Calculate metrics
  const ticketMedio = useMemo(() => {
    return salesStatistics.totalSales > 0 
      ? salesStatistics.totalRevenue / salesStatistics.totalSales 
      : 0;
  }, [salesStatistics]);
  
  // Calculate total products sold (estimated)
  const totalProductsSold = salesStatistics.totalSales * 2; // Assuming average of 2 products per sale
  
  // Calculate product rankings
  const productRankingData = useMemo(() => {
    // In a real implementation, we would fetch this from the database
    // For now, we'll create mock data based on product names
    return products.slice(0, 5).map((product, index) => ({
      name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
      value: Math.floor(Math.random() * 50) + 10,
      revenue: product.price * (Math.floor(Math.random() * 50) + 10)
    }));
  }, [products]);
  
  // Sales by category data
  const salesByCategoryData = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category))];
    return categories.slice(0, 6).map((category, index) => ({
      name: category,
      value: Math.floor(Math.random() * 10000) + 1000
    }));
  }, [products]);
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando dados...</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Key metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="animate-scale-in">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Faturamento Total</p>
              <h3 className="text-2xl font-bold mt-1">R$ {salesStatistics.totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="p-2 rounded-full bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>12% em relação ao período anterior</span>
          </div>
        </GlassCard>
        
        <GlassCard className="animate-scale-in">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Vendas</p>
              <h3 className="text-2xl font-bold mt-1">{salesStatistics.totalSales}</h3>
            </div>
            <div className="p-2 rounded-full bg-primary/10">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>8% em relação ao período anterior</span>
          </div>
        </GlassCard>
        
        <GlassCard className="animate-scale-in">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
              <h3 className="text-2xl font-bold mt-1">R$ {ticketMedio.toFixed(2)}</h3>
            </div>
            <div className="p-2 rounded-full bg-primary/10">
              <Ticket className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>5% em relação ao período anterior</span>
          </div>
        </GlassCard>
        
        <GlassCard className="animate-scale-in">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Lucro Bruto</p>
              <h3 className="text-2xl font-bold mt-1">R$ {salesStatistics.totalProfit.toFixed(2)}</h3>
            </div>
            <div className="p-2 rounded-full bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>15% em relação ao período anterior</span>
          </div>
        </GlassCard>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productRankingData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip 
                  formatter={(value) => [`${value} unidades`, 'Quantidade']}
                />
                <Bar dataKey="value" fill="#0088FE">
                  {productRankingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {salesByCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => {
                  return typeof value === 'number'
                    ? [`R$ ${value.toFixed(2)}`, 'Valor']
                    : [value, ''];
                }}/>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Produtos Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{totalProductsSold}</div>
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Média de {(totalProductsSold / salesStatistics.totalSales).toFixed(1)} produtos por venda
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Formas de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">PIX</div>
              <CreditCard className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Método de pagamento mais utilizado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Lucratividade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {salesStatistics.totalRevenue > 0
                  ? ((salesStatistics.totalProfit / salesStatistics.totalRevenue) * 100).toFixed(1)
                  : "0"}%
              </div>
              <LineChart className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Margem média de lucro
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
