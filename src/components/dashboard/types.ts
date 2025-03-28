
import { Product } from '@/hooks/useProducts';
import { Sale } from '@/hooks/useSales';

export interface LowStockTableProps {
  products: Product[];
  totalStock?: number;
  lowStockCount?: number;
}

export interface StagnantProductsTableProps {
  products: Product[];
  daysThreshold?: number;
}

export interface PriceComparisonChartProps {
  productMarginData: Array<{
    category: string;
    costToPrice: number;
  }>;
}

export interface InventoryMetricsCardsProps {
  totalStock: number;
  productsCount: number;
  lowStockCount: number;
  stagnantCount: number;
}

export interface SalesReportsTabProps {
  sales: Sale[];
  isLoading: boolean;
}
