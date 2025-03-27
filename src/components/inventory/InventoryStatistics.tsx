import React from 'react';
import { Card } from "@/components/ui/card";
import { Package, DollarSign, ShoppingCart, AlertTriangle } from 'lucide-react';

interface InventoryStatisticsProps {
  totalProducts: number;
  totalStockValue: number;
  totalStockCount: number;
  lowStockProducts: number;
}

const InventoryStatistics = ({
  totalProducts,
  totalStockValue,
  totalStockCount,
  lowStockProducts
}: InventoryStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 flex items-center">
        <div className="bg-primary/10 rounded-full p-3 mr-4">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total de Produtos</p>
          <h3 className="text-2xl font-bold">{totalProducts}</h3>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center">
        <div className="bg-primary/10 rounded-full p-3 mr-4">
          <ShoppingCart className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Itens em Estoque</p>
          <h3 className="text-2xl font-bold">{totalStockCount}</h3>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center">
        <div className="bg-primary/10 rounded-full p-3 mr-4">
          <DollarSign className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Valor em Estoque</p>
          <h3 className="text-2xl font-bold">R$ {totalStockValue.toFixed(2)}</h3>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center">
        <div className="bg-red-100 rounded-full p-3 mr-4">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Estoque Baixo</p>
          <h3 className="text-2xl font-bold">{lowStockProducts}</h3>
        </div>
      </Card>
    </div>
  );
};

export default InventoryStatistics;
