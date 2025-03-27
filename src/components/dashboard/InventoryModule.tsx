import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Product } from '@/hooks/products/useProductTypes';
import InventoryMetricsCards from './inventory/InventoryMetricsCards';
import LowStockTable from './inventory/LowStockTable';
import PriceComparisonChart from './inventory/PriceComparisonChart';
import StagnantProductsTable from './inventory/StagnantProductsTable';

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
      <InventoryMetricsCards 
        totalStock={totalStock} 
        productsCount={products.length}
        lowStockCount={lowStockProducts.length}
        stagnantCount={stagnantProducts.length}
      />
      
      {/* Low stock alerts */}
      <LowStockTable lowStockProducts={lowStockProducts} />
      
      {/* Price vs Cost comparison */}
      <PriceComparisonChart productMarginData={productMarginData} />
      
      {/* Stagnant Products */}
      <StagnantProductsTable stagnantProducts={stagnantProducts.slice(0, 5)} />
    </div>
  );
};

export default InventoryModule;
