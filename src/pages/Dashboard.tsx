import React, { useState, useMemo } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import SalesStatistics from '@/components/sales/SalesStatistics';
import { useNavigate } from 'react-router-dom';
import { useSalesStatistics } from '@/hooks/sales/useSalesStatistics';
import { useSalesData } from '@/hooks/sales/useSalesData';
import { useProducts } from '@/hooks/useProducts';
import Navbar from '@/components/layout/Navbar';
import AlertBanner from '@/components/ui/custom/AlertBanner';
import GlassCard from '@/components/ui/custom/GlassCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { sales } = useSalesData();
  const { salesStatistics, periodSales, isLoadingStatistics } = useSalesStatistics(sales);
  const { products } = useProducts();
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'Estoque Baixo',
      message: 'Alguns produtos estão com estoque abaixo do mínimo.',
      type: 'warning' as const,
      actionText: 'Ver Produtos',
      onAction: () => navigate('/inventory')
    },
    {
      id: 2,
      title: 'Novas Vendas',
      message: 'Você tem 3 novas vendas hoje.',
      type: 'success' as const,
      actionText: 'Ver Vendas',
      onAction: () => navigate('/sales')
    }
  ]);

  // Calculate estimated number of products sold
  // Since we don't have direct access to items, use a fixed value per sale or get from another source
  const totalProductsSold = useMemo(() => {
    return periodSales.length * 2; // Estimating an average of 2 products per sale
  }, [periodSales]);

  // Calculate low stock products
  const lowStockProducts = products.filter(product => 
    product.stock <= (product.min_stock || 5)
  );

  // Handle alert dismissal
  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-10 lg:ml-64 lg:pl-8">
        <PageTransition>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Bem-vindo(a) ao seu painel de controle
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => navigate('/sales/new')}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Nova Venda
              </Button>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-4 mb-6">
            {alerts.map(alert => (
              <AlertBanner
                key={alert.id}
                title={alert.title}
                message={alert.message}
                type={alert.type}
                actionText={alert.actionText}
                onAction={alert.onAction}
                onDismiss={() => dismissAlert(alert.id)}
              />
            ))}
            
            {lowStockProducts.length > 0 && (
              <AlertBanner
                title="Alerta de Estoque"
                message={`${lowStockProducts.length} produtos estão com estoque abaixo do mínimo.`}
                type="warning"
                actionText="Ver Estoque"
                onAction={() => navigate('/inventory')}
              />
            )}
          </div>

          {/* Statistics */}
          <SalesStatistics 
            totalSales={salesStatistics.totalSales}
            productsSold={totalProductsSold}
            totalRevenue={salesStatistics.totalRevenue}
            isLoading={isLoadingStatistics}
          />

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <GlassCard 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/products')}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary/10 mr-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Produtos</h3>
                  <p className="text-sm text-muted-foreground mt-1">{products.length} produtos cadastrados</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
              </div>
            </GlassCard>
            
            <GlassCard 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/sales')}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary/10 mr-4">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Vendas</h3>
                  <p className="text-sm text-muted-foreground mt-1">{sales.length} vendas realizadas</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
              </div>
            </GlassCard>
            
            <GlassCard 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/inventory')}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary/10 mr-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Estoque</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {lowStockProducts.length > 0 
                      ? <span className="text-amber-500">{lowStockProducts.length} alertas</span> 
                      : 'Estoque saudável'}
                  </p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
              </div>
            </GlassCard>
            
            <GlassCard 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/suppliers')}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary/10 mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Fornecedores</h3>
                  <p className="text-sm text-muted-foreground mt-1">Gerenciar fornecedores</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
              </div>
            </GlassCard>
          </div>

          {/* Recent Activity and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sales.slice(0, 5).map((sale, index) => (
                    <div key={index} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                      <div className="p-2 rounded-full bg-primary/10 mr-3">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Venda #{sale.sale_number || index + 1001} - {sale.customer_name || 'Cliente'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          R$ {sale.final_total?.toFixed(2) || '0.00'} • {new Date(sale.sale_date || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {sales.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhuma atividade recente</p>
                    </div>
                  )}
                </div>
                
                {sales.length > 0 && (
                  <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/sales')}>
                    Ver Todas as Vendas
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Vendas Diárias</span>
                      <span className="text-sm text-primary font-medium">+12%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Rotatividade de Estoque</span>
                      <span className="text-sm text-primary font-medium">+5%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Lucro Mensal</span>
                      <span className="text-sm text-primary font-medium">+8%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-6" onClick={() => navigate('/sales')}>
                  <TrendingUp className="mr-2 h-4 w-4" /> Análise Completa
                </Button>
              </CardContent>
            </Card>
          </div>
        </PageTransition>
      </main>
    </div>
  );
}
