
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, AlertTriangle, Clock, RotateCcw } from 'lucide-react';

interface InventoryMetricsCardsProps {
  totalStock: number;
  productsCount: number;
  lowStockCount: number;
  stagnantCount: number;
}

const InventoryMetricsCards: React.FC<InventoryMetricsCardsProps> = ({
  totalStock,
  productsCount,
  lowStockCount,
  stagnantCount
}) => {
  return (
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
            {productsCount} produtos diferentes
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Produtos com Estoque Baixo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{lowStockCount}</div>
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {productsCount > 0 ? ((lowStockCount / productsCount) * 100).toFixed(1) : '0'}% do total de produtos
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Produtos Parados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{stagnantCount}</div>
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
  );
};

export default InventoryMetricsCards;
