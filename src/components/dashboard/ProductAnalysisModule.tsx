
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sale } from '@/hooks/sales/types';
import { Product } from '@/hooks/products/useProductTypes';
import { Package, TrendingUp, DollarSign, BarChart2, ShoppingBag } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';

interface ProductAnalysisModuleProps {
  sales: Sale[];
  products: Product[];
  isLoading?: boolean;
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ProductAnalysisModule: React.FC<ProductAnalysisModuleProps> = ({
  sales,
  products,
  isLoading = false
}) => {
  // Top selling products (since we don't have actual sales items data, we'll mock this)
  const topSellingProducts = useMemo(() => {
    return products.slice(0, 8).map(product => ({
      id: product.id,
      name: product.name.length > 25 ? product.name.substring(0, 25) + '...' : product.name,
      category: product.category,
      quantity: Math.floor(Math.random() * 50) + 5,
      revenue: product.price * (Math.floor(Math.random() * 50) + 5),
      profit: (product.price - (product.cost || 0)) * (Math.floor(Math.random() * 50) + 5)
    }));
  }, [products]);
  
  // Worst selling products
  const worstSellingProducts = useMemo(() => {
    return products.slice(-8).map(product => ({
      id: product.id,
      name: product.name.length > 25 ? product.name.substring(0, 25) + '...' : product.name,
      category: product.category,
      quantity: Math.floor(Math.random() * 3) + 1,
      revenue: product.price * (Math.floor(Math.random() * 3) + 1),
      profit: (product.price - (product.cost || 0)) * (Math.floor(Math.random() * 3) + 1)
    }));
  }, [products]);
  
  // Sales by category
  const salesByCategory = useMemo(() => {
    // Get unique categories
    const categories = [...new Set(products.map(p => p.category))];
    
    return categories.map(category => {
      const productsInCategory = products.filter(p => p.category === category);
      
      // Calculate mocked sales for this category
      const quantity = Math.floor(Math.random() * 100) + 20;
      const revenue = productsInCategory.reduce((sum, p) => sum + p.price, 0) * Math.random() * 5;
      
      return {
        name: category,
        quantidade: quantity,
        valor: revenue
      };
    });
  }, [products]);
  
  // Product metrics calculations
  const mostProfitableProducts = useMemo(() => {
    return products
      .filter(p => p.cost && p.cost > 0)
      .map(product => ({
        id: product.id,
        name: product.name.length > 25 ? product.name.substring(0, 25) + '...' : product.name,
        category: product.category,
        price: product.price,
        cost: product.cost || 0,
        margin: ((product.price - (product.cost || 0)) / product.price) * 100
      }))
      .sort((a, b) => b.margin - a.margin)
      .slice(0, 5);
  }, [products]);
  
  // Related products (mock data)
  const relatedProductsData = [
    { name: 'Capas + Cabos', value: 35 },
    { name: 'Carregador + Cabo', value: 25 },
    { name: 'Fone + Capa', value: 18 },
    { name: 'Película + Capa', value: 15 },
    { name: 'Carregador + Adaptador', value: 10 }
  ];
  
  // Product abandonment rate (mock data)
  const abandonmentRateData = [
    { name: 'Capas', taxa: 5, vendas: 95 },
    { name: 'Cabos', taxa: 12, vendas: 88 },
    { name: 'Carregadores', taxa: 18, vendas: 82 },
    { name: 'Fones', taxa: 25, vendas: 75 },
    { name: 'Películas', taxa: 15, vendas: 85 }
  ];
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando dados de análise de produtos...</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
            Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Receita</TableHead>
                  <TableHead className="text-right">Lucro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSellingProducts.slice(0, 5).map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">{product.quantity}</TableCell>
                    <TableCell className="text-right">R$ {product.revenue.toFixed(2)}</TableCell>
                    <TableCell className="text-right">R$ {product.profit.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                
                {topSellingProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Não há dados de vendas disponíveis.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Products by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5 text-primary" />
            Vendas por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salesByCategory}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip formatter={(value, name) => {
                if (name === "quantidade") return [`${value} unidades`, "Quantidade"];
                return [`R$ ${Number(value).toFixed(2)}`, "Valor"];
              }} />
              <Legend />
              <Bar yAxisId="left" dataKey="quantidade" name="Quantidade" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="valor" name="Valor (R$)" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products with Highest Margin */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              Produtos com Maior Margem de Lucro
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mostProfitableProducts}
                layout="vertical"
                margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(2)}%`, 'Margem']}
                />
                <Bar dataKey="margin" name="Margem de Lucro (%)" fill="#82ca9d">
                  {mostProfitableProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Related Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-primary" />
              Produtos Relacionados
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={relatedProductsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {relatedProductsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} vendas conjuntas`, 'Quantidade']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Product Abandonment Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-primary" />
              Taxa de Abandono de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={abandonmentRateData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => {
                  if (name === "taxa") return [`${value}%`, "Taxa de Abandono"];
                  return [`${value}%`, "Conversão em Vendas"];
                }} />
                <Legend />
                <Bar dataKey="taxa" name="Taxa de Abandono (%)" fill="#FF8042" />
                <Bar dataKey="vendas" name="Conversão em Vendas (%)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Worst Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-red-500" />
              Produtos com Baixa Saída
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 h-80 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Dias em Estoque</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {worstSellingProducts.slice(0, 5).map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">{product.quantity}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                        {Math.floor(Math.random() * 60) + 30} dias
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                
                {worstSellingProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Não há dados disponíveis.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductAnalysisModule;
