import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sale } from '@/hooks/sales/types';
import { Users, UserPlus, UserMinus, CreditCard, ShoppingCart } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';

interface CustomersModuleProps {
  sales: Sale[];
  isLoading?: boolean;
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#a05195'];

const CustomersModule: React.FC<CustomersModuleProps> = ({
  sales,
  isLoading = false
}) => {
  // Get unique customers
  const uniqueCustomers = useMemo(() => {
    if (sales.length === 0) return [];
    
    const customerMap = new Map<string, { 
      name: string, 
      totalSpent: number, 
      purchaseCount: number,
      lastPurchaseDate: Date
    }>();
    
    sales.forEach(sale => {
      const customerName = sale.customer_name || 'Cliente não identificado';
      const existingCustomer = customerMap.get(customerName);
      
      if (existingCustomer) {
        existingCustomer.totalSpent += sale.final_total;
        existingCustomer.purchaseCount += 1;
        
        // Update last purchase date if more recent
        const saleDate = new Date(sale.sale_date || '');
        if (saleDate > existingCustomer.lastPurchaseDate) {
          existingCustomer.lastPurchaseDate = saleDate;
        }
      } else {
        customerMap.set(customerName, {
          name: customerName,
          totalSpent: sale.final_total,
          purchaseCount: 1,
          lastPurchaseDate: new Date(sale.sale_date || '')
        });
      }
    });
    
    return Array.from(customerMap.values());
  }, [sales]);
  
  // Top customers by spending
  const topCustomers = useMemo(() => {
    return [...uniqueCustomers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
  }, [uniqueCustomers]);
  
  // Customers by purchase frequency
  const customersByFrequency = useMemo(() => {
    const frequencyData = [
      { name: '1 compra', value: 0 },
      { name: '2 compras', value: 0 },
      { name: '3 compras', value: 0 },
      { name: '4+ compras', value: 0 }
    ];
    
    uniqueCustomers.forEach(customer => {
      if (customer.purchaseCount === 1) {
        frequencyData[0].value += 1;
      } else if (customer.purchaseCount === 2) {
        frequencyData[1].value += 1;
      } else if (customer.purchaseCount === 3) {
        frequencyData[2].value += 1;
      } else {
        frequencyData[3].value += 1;
      }
    });
    
    return frequencyData;
  }, [uniqueCustomers]);
  
  // New vs returning customers (mock data)
  const customerTypeData = [
    { name: 'Novos', value: Math.round(uniqueCustomers.length * 0.3) },
    { name: 'Recorrentes', value: Math.round(uniqueCustomers.length * 0.7) }
  ];
  
  // Customer purchase preferences (mock data)
  const purchasePreferencesData = [
    { name: 'Capas', value: 65 },
    { name: 'Carregadores', value: 25 },
    { name: 'Cabos', value: 45 },
    { name: 'Acessórios', value: 30 },
    { name: 'Controles', value: 15 }
  ];
  
  // Customer retention over time (mock data)
  const retentionData = [
    { name: 'Jan', ativos: 40, inativos: 5 },
    { name: 'Fev', ativos: 45, inativos: 8 },
    { name: 'Mar', ativos: 50, inativos: 10 },
    { name: 'Abr', ativos: 55, inativos: 15 },
    { name: 'Mai', ativos: 60, inativos: 20 },
    { name: 'Jun', ativos: 65, inativos: 22 }
  ];
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando dados de clientes...</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Customer metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{uniqueCustomers.length}</div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Novos Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{customerTypeData[0].value}</div>
              <UserPlus className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{retentionData[5].inativos}</div>
              <UserMinus className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Sem compras há mais de 60 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio por Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                R$ {uniqueCustomers.length > 0 
                  ? (uniqueCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / uniqueCustomers.length).toFixed(2)
                  : '0.00'}
              </div>
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
            Clientes com Maior Consumo
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Total Gasto</TableHead>
                  <TableHead className="text-right">Qtd. Compras</TableHead>
                  <TableHead className="text-right">Média por Compra</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.slice(0, 5).map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell className="text-right">R$ {customer.totalSpent.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{customer.purchaseCount}</TableCell>
                    <TableCell className="text-right">
                      R$ {(customer.totalSpent / customer.purchaseCount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        Ativo
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                
                {topCustomers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Não há dados de clientes disponíveis.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New vs Returning Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes Novos vs. Recorrentes</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {customerTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} clientes`, 'Quantidade']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Customer Purchase Frequency */}
        <Card>
          <CardHeader>
            <CardTitle>Frequência de Compra</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={customersByFrequency}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} clientes`, 'Quantidade']} />
                <Bar dataKey="value" name="Quantidade de Clientes" fill="#8884d8">
                  {customersByFrequency.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Customer Purchase Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferências de Compra</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={purchasePreferencesData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip formatter={(value) => [`${value} vendas`, 'Quantidade']} />
                <Bar dataKey="value" name="Quantidade de Vendas" fill="#8884d8">
                  {purchasePreferencesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Customer Retention */}
        <Card>
          <CardHeader>
            <CardTitle>Retenção de Clientes</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={retentionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} clientes`, '']} />
                <Legend />
                <Line type="monotone" dataKey="ativos" name="Clientes Ativos" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="inativos" name="Clientes Inativos" stroke="#ff8042" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomersModule;
