
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import GlassCard from '@/components/ui/custom/GlassCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import IconButton from '@/components/ui/custom/IconButton';

// Dummy data for demonstration
const lowStockItems = [
  { id: 1, name: 'Cabo USB-C', category: 'Cabos', stock: 3, image: '/placeholder.svg' },
  { id: 2, name: 'Fone Bluetooth', category: 'Áudio', stock: 2, image: '/placeholder.svg' },
  { id: 3, name: 'Carregador Sem Fio', category: 'Carregadores', stock: 4, image: '/placeholder.svg' },
];

const topSellingProducts = [
  { id: 1, name: 'Capa iPhone 13', category: 'Capas', sales: 28, image: '/placeholder.svg' },
  { id: 2, name: 'Película Galaxy S21', category: 'Proteção', sales: 24, image: '/placeholder.svg' },
  { id: 3, name: 'Cabo Lightning 2m', category: 'Cabos', sales: 21, image: '/placeholder.svg' },
  { id: 4, name: 'Fone TWS Pro', category: 'Áudio', sales: 18, image: '/placeholder.svg' },
];

const stats = [
  { id: 1, title: 'Produtos', value: '356', change: '+12%', icon: <Package className="h-4 w-4" /> },
  { id: 2, title: 'Vendas (mês)', value: 'R$ 23.450', change: '+18%', icon: <ShoppingBag className="h-4 w-4" /> },
  { id: 3, title: 'Novos itens', value: '24', change: '+5%', icon: <TrendingUp className="h-4 w-4" /> },
  { id: 4, title: 'Categorias', value: '12', change: '', icon: <BarChart3 className="h-4 w-4" /> },
];

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Simulated data loading animation
    const items = document.querySelectorAll('.animate-on-mount');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-slide-up');
      }, 100 * index);
    });
  }, []);

  if (!mounted) return null;
  
  return (
    <PageTransition>
      <div className="min-h-screen lg:pl-64 pt-16">
        <div className="container mx-auto px-4 pb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Visão geral da sua loja</p>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar produtos..." 
                className="pl-9 bg-background border-none glass-effect" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <GlassCard 
                key={stat.id}
                className="animate-on-mount opacity-0"
                hoverEffect
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    {stat.change && (
                      <p className="inline-flex items-center text-xs font-medium text-green-500 mt-1">
                        {stat.change}
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      </p>
                    )}
                  </div>
                  <div className="p-2 rounded-full bg-primary/10">
                    {stat.icon}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 animate-on-mount opacity-0 border-none shadow-soft">
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
                <CardDescription>Os itens com maior volume de vendas este mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSellingProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{product.sales}</span>
                        <p className="text-xs text-muted-foreground">unidades</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to="/sales">
                    <Button variant="outline" className="w-full">
                      Ver todos os relatórios
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-on-mount opacity-0 border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Estoque Baixo</CardTitle>
                  <CardDescription>Produtos que precisam ser reabastecidos</CardDescription>
                </div>
                <IconButton variant="ghost" size="sm">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                </IconButton>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-md bg-amber-50/50 border border-amber-100">
                      <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{item.category}</span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            {item.stock} restantes
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to="/inventory">
                    <Button variant="outline" className="w-full">
                      Gerenciar estoque
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <GlassCard className="lg:col-span-2 animate-on-mount opacity-0" hoverEffect>
              <h3 className="text-lg font-medium mb-4">Vendas Recentes</h3>
              <p className="text-muted-foreground">Visualização das vendas mais recentes aparecerá aqui.</p>
              <div className="mt-4">
                <Link to="/sales">
                  <Button>Ver vendas</Button>
                </Link>
              </div>
            </GlassCard>
            
            <GlassCard className="lg:col-span-2 animate-on-mount opacity-0" hoverEffect>
              <h3 className="text-lg font-medium mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/products/add">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    Novo Produto
                  </Button>
                </Link>
                <Link to="/sales/new">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Registrar Venda
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
