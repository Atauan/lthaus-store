
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/hooks/products/useProductTypes';
import { AlertTriangle, Package, RotateCcw, Clock, TrendingDown, Zap } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface InventoryModuleProps {
  products: Product[];
  lowStockProducts: Product[];
  isLoading?: boolean;
}

const InventoryModule: React.FC<InventoryModuleProps> = ({
  products,
  lowStockProducts,
  isLoading = false
}) => {
  // Calculate inventory metrics
  const totalStock = useMemo(() => {
    return products.reduce((sum, product) => sum + product.stock, 0);
  }, [products]);
  
  // Calculate average stock level
  const averageStock = useMemo(() => {
    return products.length > 0 ? totalStock / products.length : 0;
  }, [products, totalStock]);
  
  // Products with no movement (mock data - in a real app, we would have a timestamp of last sale)
  const stagnantProducts = useMemo(() => {
    // For demonstration, select 20% of products as stagnant
    const count = Math.floor(products.length * 0.2);
    return products
      .slice()
      .sort((a, b) => a.stock - b.stock)
      .slice(-count);
  }, [products]);
  
  // Calculate product margin data (price vs cost)
  const productMarginData = useMemo(() => {
    return products.slice(0, 5).map(product => ({
      name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
      custo: product.cost || 0,
      preco: product.price,
      margem: product.cost ? ((product.price - product.cost) / product.price) * 100 : 100
    }));
  }, [products]);
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando dados de estoque...</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Inventory metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produtos em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{totalStock}</div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {products.length} produtos diferentes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produtos com Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{lowStockProducts.length}</div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {((lowStockProducts.length / products.length) * 100).toFixed(1)}% do total de produtos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produtos Parados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stagnantProducts.length}</div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Sem movimento há mais de 30 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Giro de Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">24 dias</div>
              <RotateCcw className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tempo médio de renovação
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Low stock alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
            Alertas de Estoque Baixo
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Estoque Atual</TableHead>
                  <TableHead className="text-right">Estoque Mínimo</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.slice(0, 5).map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell className="text-right">{product.min_stock}</TableCell>
                    <TableCell className="text-right">
                      {product.stock === 0 ? (
                        <Badge variant="destructive">Esgotado</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                          Baixo
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                
                {lowStockProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Não há produtos com estoque baixo.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Price vs Cost comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5 text-primary" />
            Comparação Custo vs. Preço de Venda
          </CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={productMarginData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value}`} />
              <Bar dataKey="custo" name="Custo" fill="#8884d8" />
              <Bar dataKey="preco" name="Preço de Venda" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Stagnant Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingDown className="mr-2 h-5 w-5 text-red-500" />
            Produtos Parados
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                  <TableHead className="text-right">Dias Parado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stagnantProducts.slice(0, 5).map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">R$ {product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell className="text-right">{30 + index * 5}</TableCell>
                  </TableRow>
                ))}
                
                {stagnantProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Não há produtos parados no estoque.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryModule;
