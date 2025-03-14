
import React, { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import {
  Search,
  ArrowDownUp,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertCircle,
  Filter,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent } from '@/components/ui/card';

// Dummy data for demonstration
const inventoryMovements = [
  { 
    id: 1, 
    type: 'entrada', 
    product: 'Cabo Lightning',
    quantity: 20,
    date: '2023-07-15T14:30:00',
    user: 'Admin',
    notes: 'Reabastecimento regular'
  },
  { 
    id: 2, 
    type: 'saida', 
    product: 'Capa iPhone 13',
    quantity: 3,
    date: '2023-07-15T10:15:00',
    user: 'Vendedor 1',
    notes: 'Venda loja física'
  },
  { 
    id: 3, 
    type: 'entrada', 
    product: 'Película de Vidro',
    quantity: 50,
    date: '2023-07-14T09:45:00',
    user: 'Admin',
    notes: 'Novo fornecedor'
  },
  { 
    id: 4, 
    type: 'saida', 
    product: 'Fone de Ouvido Bluetooth',
    quantity: 2,
    date: '2023-07-13T16:20:00',
    user: 'Vendedor 2',
    notes: 'Venda online'
  },
  { 
    id: 5, 
    type: 'saida', 
    product: 'Cabo Lightning',
    quantity: 5,
    date: '2023-07-13T11:30:00',
    user: 'Vendedor 1',
    notes: 'Venda loja física'
  },
  { 
    id: 6, 
    type: 'entrada', 
    product: 'Carregador 20W',
    quantity: 15,
    date: '2023-07-12T14:00:00',
    user: 'Admin',
    notes: 'Reabastecimento regular'
  },
];

const lowStockItems = [
  { id: 1, name: 'Suporte para Carro', category: 'Acessórios', stock: 3, image: '/placeholder.svg' },
  { id: 2, name: 'Fone de Ouvido Bluetooth', category: 'Áudio', stock: 5, image: '/placeholder.svg' },
  { id: 3, name: 'Carregador 20W', category: 'Carregadores', stock: 8, image: '/placeholder.svg' },
];

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovementType, setSelectedMovementType] = useState('todos');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredMovements = inventoryMovements.filter(movement => {
    const matchesSearch = movement.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedMovementType === 'todos' || movement.type === selectedMovementType;
    
    return matchesSearch && matchesType;
  });
  
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
  
  return (
    <PageTransition>
      <div className="min-h-screen lg:pl-64 pt-16">
        <div className="container mx-auto px-4 pb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
              <p className="text-muted-foreground mt-1">Gerencie as entradas e saídas de produtos</p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <ArrowUpCircle className="h-4 w-4 text-green-600" />
                Nova Entrada
              </Button>
              <Button variant="outline" className="gap-2">
                <ArrowDownCircle className="h-4 w-4 text-red-600" />
                Nova Saída
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <GlassCard className="lg:col-span-3 p-0 animate-scale-in">
              <Tabs defaultValue="movements" className="w-full">
                <div className="px-6 pt-6 border-b">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <TabsList>
                      <TabsTrigger value="movements">Movimentações</TabsTrigger>
                      <TabsTrigger value="alerts">Alertas</TabsTrigger>
                    </TabsList>
                    
                    <div className="flex gap-3 w-full md:w-auto">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          placeholder="Buscar produto..." 
                          className="pl-9"
                          value={searchQuery}
                          onChange={handleSearch}
                        />
                      </div>
                      
                      <div className="w-40">
                        <Select value={selectedMovementType} onValueChange={setSelectedMovementType}>
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <Filter className="h-4 w-4" />
                              <SelectValue placeholder="Tipo" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="todos">Todos</SelectItem>
                              <SelectItem value="entrada">Entradas</SelectItem>
                              <SelectItem value="saida">Saídas</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <TabsContent value="movements" className="mt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="text-left py-3 px-4">Tipo</th>
                          <th className="text-left py-3 px-4">Produto</th>
                          <th className="text-left py-3 px-4 hidden md:table-cell">Data</th>
                          <th className="text-right py-3 px-4">Quantidade</th>
                          <th className="text-left py-3 px-4 hidden md:table-cell">Usuário</th>
                          <th className="text-left py-3 px-4 hidden lg:table-cell">Observações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMovements.length > 0 ? (
                          filteredMovements.map((movement) => (
                            <tr key={movement.id} className="border-b hover:bg-muted/20 transition-colors">
                              <td className="py-3 px-4">
                                {movement.type === 'entrada' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <PlusCircle className="h-3 w-3" />
                                    Entrada
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <MinusCircle className="h-3 w-3" />
                                    Saída
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 font-medium">{movement.product}</td>
                              <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{formatDate(movement.date)}</td>
                              <td className="py-3 px-4 text-right font-medium">{movement.quantity} un</td>
                              <td className="py-3 px-4 hidden md:table-cell">{movement.user}</td>
                              <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{movement.notes}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                              Nenhuma movimentação encontrada. Tente ajustar os filtros.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="alerts" className="mt-0 p-6">
                  <div className="mb-4 flex items-center gap-2 text-amber-600">
                    <AlertCircle className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Produtos com estoque baixo</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {lowStockItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 rounded-md border border-amber-100 bg-amber-50/50">
                        <div className="w-12 h-12 rounded-md flex items-center justify-center overflow-hidden bg-white">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">{item.category}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              {item.stock} restantes
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <ArrowUpCircle className="h-4 w-4 mr-2 text-green-600" />
                          Reabastecer
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </GlassCard>
            
            <Card className="border-none shadow-soft animate-scale-in">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Estatísticas de Estoque</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Entradas (este mês)</p>
                      <p className="text-lg font-medium">87 produtos</p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-[65%]"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Saídas (este mês)</p>
                      <p className="text-lg font-medium">43 produtos</p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full w-[35%]"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Alertas de estoque</p>
                      <p className="text-lg font-medium">3 produtos</p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[15%]"></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium">Total em estoque</p>
                        <p className="text-xs text-muted-foreground">Valor aproximado</p>
                      </div>
                      <p className="text-xl font-semibold">R$ 12.450,00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Inventory;
