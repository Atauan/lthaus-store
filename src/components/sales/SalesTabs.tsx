
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalesTable from './SalesTable';
import SalesStatistics from './SalesStatistics';
import SalesReportsTab from './SalesReportsTab';
import { Sale } from '@/hooks/sales/types';

interface SalesTabsProps {
  sales: Sale[];
  isLoading: boolean;
  onViewSale: (saleId: number) => Promise<void>;
  onRevokeSale: (saleId: number) => Promise<void>;
  hasMore: boolean;
  loadMore: () => void;
}

const SalesTabs: React.FC<SalesTabsProps> = ({ 
  sales = [], 
  isLoading = false,
  onViewSale,
  onRevokeSale,
  hasMore,
  loadMore
}) => {
  const recentSales = sales
    .filter(sale => sale.status !== 'canceled')
    .slice(0, 10);

  const canceledSales = sales
    .filter(sale => sale.status === 'canceled')
    .slice(0, 10);

  // Calculate statistics
  const totalSales = sales.filter(sale => sale.status !== 'canceled').length;
  const totalRevenue = sales
    .filter(sale => sale.status !== 'canceled')
    .reduce((acc, sale) => acc + (sale.final_total || 0), 0);
  const totalProfit = sales
    .filter(sale => sale.status !== 'canceled')
    .reduce((acc, sale) => acc + (sale.profit || 0), 0);
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

  return (
    <div className="w-full">
      <Tabs defaultValue="recent">
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="recent">Vendas Recentes</TabsTrigger>
          <TabsTrigger value="canceled">Canceladas</TabsTrigger>
          <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <div className="bg-white shadow rounded-lg border">
            <SalesTable 
              sales={recentSales.map(sale => ({
                id: sale.id,
                date: sale.sale_date || sale.created_at || '',
                customer: sale.customer_name || '',
                items: [], // We'll fetch items on demand
                paymentMethod: sale.payment_method,
                total: sale.final_total,
                status: sale.status,
              }))} 
              isLoading={isLoading} 
              onViewSale={onViewSale}
              onRevokeSale={onRevokeSale}
              hasMore={hasMore}
              loadMore={loadMore}
            />
          </div>
        </TabsContent>

        <TabsContent value="canceled">
          <div className="bg-white shadow rounded-lg border">
            <SalesTable 
              sales={canceledSales.map(sale => ({
                id: sale.id,
                date: sale.sale_date || sale.created_at || '',
                customer: sale.customer_name || '',
                items: [], // We'll fetch items on demand
                paymentMethod: sale.payment_method,
                total: sale.final_total,
                status: sale.status,
              }))} 
              isLoading={isLoading}
              onViewSale={onViewSale}
              onRevokeSale={onRevokeSale}
              hasMore={hasMore}
              loadMore={loadMore}
            />
          </div>
        </TabsContent>

        <TabsContent value="statistics">
          <SalesStatistics 
            totalSales={totalSales}
            totalRevenue={totalRevenue}
            totalProfit={totalProfit}
            averageSale={averageSale}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="reports">
          <SalesReportsTab 
            sales={sales} 
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesTabs;
