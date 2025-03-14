
import React, { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { 
  Search, 
  PlusCircle,
  Filter,
  CalendarDays,
  ArrowUpRight,
  BarChart3,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlassCard from '@/components/ui/custom/GlassCard';

// Dummy data for demonstration
const salesData = [
  { 
    id: 1, 
    date: '2023-07-15T14:30:00',
    customer: 'Venda Balcão',
    items: [
      { name: 'Capa iPhone 13', quantity: 1, price: 79.90 },
      { name: 'Película de Vidro', quantity: 1, price: 19.90 }
    ],
    paymentMethod: 'pix',
    total: 99.80
  },
  { 
    id: 2, 
    date: '2023-07-15T10:45:00',
    customer: 'Maria Silva',
    items: [
      { name: 'Cabo Lightning', quantity: 1, price: 29.90 },
      { name: 'Carregador 20W', quantity: 1, price: 89.90 }
    ],
    paymentMethod: 'cartao',
    total: 119.80
  },
  { 
    id: 3, 
    date: '2023-07-14T16:20:00',
    customer: 'João Santos',
    items: [
      { name: 'Fone de Ouvido Bluetooth', quantity: 1, price: 149.90 }
    ],
    paymentMethod: 'dinheiro',
    total: 149.90
  },
  { 
    id: 4, 
    date: '2023-07-14T09:15:00',
    customer: 'Venda Balcão',
    items: [
      { name: 'Suporte para Carro', quantity: 1, price: 49.90 },
      { name: 'Cabo Lightning', quantity: 1, price: 29.90 }
    ],
    paymentMethod: 'cartao',
    total: 79.80
  },
  { 
    id: 5, 
    date: '2023-07-13T11:30:00',
    customer: 'Ana Oliveira',
    items: [
      { name: 'Película de Vidro', quantity: 2, price: 19.90 },
      { name: 'Capa Samsung S21', quantity: 1, price: 69.90 }
    ],
    paymentMethod: 'pix',
    total: 109.70
  },
  { 
    id: 6, 
    date: '2023-07-12T15:40:00',
    customer: 'Carlos Mendes',
    items: [
      { name: 'Carregador Sem Fio', quantity: 1, price: 129.90 }
    ],
    paymentMethod: 'cartao',
    total: 129.90
  },
];

const categories = ['Todas', 'Cabos', 'Capas', 'Áudio', 'Carregadores', 'Proteção', 'Acessórios'];

const paymentIcons = {
  cartao: <CreditCard className="h-4 w-4" />,
  dinheiro: <Banknote className="h-4 w-4" />,
  pix: <Smartphone className="h-4 w-4" />,
};

const paymentNames = {
  cartao: 'Cartão',
  dinheiro: 'Dinheiro',
  pix: 'PIX',
};

const Sales = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('7dias');
  const [selectedPayment, setSelectedPayment] = useState('todos');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Format date string to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getDateRangeFilter = (dateRange: string) => {
    const now = new Date();
    const pastDate = new Date();
    
    switch (dateRange) {
      case 'hoje':
        pastDate.setHours(0, 0, 0, 0);
        break;
      case '7dias':
        pastDate.setDate(now.getDate() - 7);
        break;
      case '30dias':
        pastDate.setDate(now.getDate() - 30);
        break;
      default:
        pastDate.setFullYear(2000); // Essentially all dates
    }
    
    return pastDate;
  };
  
  const filteredSales = salesData.filter(sale => {
    const matchesSearch = sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sale.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const saleDate = new Date(sale.date);
    const filterDate = getDateRangeFilter(selectedDateRange);
    const matchesDate = saleDate >= filterDate;
    
    const matchesPayment = selectedPayment === 'todos' || sale.paymentMethod === selectedPayment;
    
    return matchesSearch && matchesDate && matchesPayment;
  });
  
  // Calculate totals for the current filter
  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const productsSold = filteredSales.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  
  return (
    <PageTransition>
      <div className="min-h-screen lg:pl-64 pt-16">
        <div className="container mx-auto px-4 pb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
              <p className="text-muted-foreground mt-1">Gerencie e analise suas vendas</p>
            </div>
            
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <GlassCard className="animate-scale-in">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Vendas</p>
                  <h3 className="text-2xl font-bold mt-1">{totalSales}</h3>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </div>
            </GlassCard>
            
            <GlassCard className="animate-scale-in">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Produtos Vendidos</p>
                  <h3 className="text-2xl font-bold mt-1">{productsSold}</h3>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </div>
              </div>
            </GlassCard>
            
            <GlassCard className="animate-scale-in">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                  <h3 className="text-2xl font-bold mt-1">R$ {totalRevenue.toFixed(2)}</h3>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
              </div>
            </GlassCard>
          </div>
          
          <div className="bg-white rounded-lg shadow-soft overflow-hidden animate-scale-in mb-8">
            <Tabs defaultValue="list" className="w-full">
              <div className="px-6 pt-6 border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <TabsList>
                    <TabsTrigger value="list">Lista de Vendas</TabsTrigger>
                    <TabsTrigger value="reports">Relatórios</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        placeholder="Buscar venda..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                    </div>
                    
                    <div className="w-36">
                      <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <SelectValue placeholder="Período" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="hoje">Hoje</SelectItem>
                            <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                            <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                            <SelectItem value="todos">Todos</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="w-36">
                      <Select value={selectedPayment} onValueChange={setSelectedPayment}>
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <SelectValue placeholder="Pagamento" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="cartao">Cartão</SelectItem>
                            <SelectItem value="dinheiro">Dinheiro</SelectItem>
                            <SelectItem value="pix">PIX</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <TabsContent value="list" className="mt-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left py-3 px-4">Venda</th>
                        <th className="text-left py-3 px-4">Data</th>
                        <th className="text-left py-3 px-4 hidden md:table-cell">Cliente</th>
                        <th className="text-left py-3 px-4">Itens</th>
                        <th className="text-left py-3 px-4 hidden md:table-cell">Pagamento</th>
                        <th className="text-right py-3 px-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSales.length > 0 ? (
                        filteredSales.map((sale) => (
                          <tr key={sale.id} className="border-b hover:bg-muted/20 transition-colors">
                            <td className="py-3 px-4 font-medium">#{sale.id.toString().padStart(4, '0')}</td>
                            <td className="py-3 px-4 text-muted-foreground">{formatDate(sale.date)}</td>
                            <td className="py-3 px-4 hidden md:table-cell">{sale.customer}</td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col">
                                {sale.items.map((item, idx) => (
                                  <span key={idx} className="text-sm">
                                    {item.quantity}x {item.name}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-secondary">
                                {paymentIcons[sale.paymentMethod as keyof typeof paymentIcons]}
                                {paymentNames[sale.paymentMethod as keyof typeof paymentNames]}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-semibold">
                              R$ {sale.total.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            Nenhuma venda encontrada. Tente ajustar os filtros.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="reports" className="p-6">
                <div className="text-center p-12">
                  <h3 className="text-lg font-medium mb-2">Relatórios de Vendas</h3>
                  <p className="text-muted-foreground mb-6">
                    Visualize gráficos e análises detalhadas das suas vendas
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline">Vendas por Categoria</Button>
                    <Button variant="outline">Vendas por Período</Button>
                    <Button variant="outline">Produtos Mais Vendidos</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Sales;
