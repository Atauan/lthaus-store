import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SalesSearchFilters from './SalesSearchFilters';
import SalesTable from './SalesTable';
import SalesReportsTab from './SalesReportsTab';
import { useIsMobile } from '@/hooks/use-mobile';

type Sale = {
  id: number;
  date: string;
  customer: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  paymentMethod: string;
  total: number;
};

interface SalesTabsProps {
  searchQuery: string;
  selectedDateRange: string;
  selectedPayment: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedDateRange: (value: string) => void;
  setSelectedPayment: (value: string) => void;
  filteredSales: Sale[];
  loading?: boolean;
}

const SalesTabs: React.FC<SalesTabsProps> = ({
  searchQuery,
  selectedDateRange,
  selectedPayment,
  handleSearch,
  setSelectedDateRange,
  setSelectedPayment,
  filteredSales,
  loading = false
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-white rounded-lg shadow-soft overflow-hidden animate-scale-in mb-8">
      <Tabs defaultValue="list" className="w-full">
        <div className={`px-4 sm:px-6 pt-4 sm:pt-6 border-b ${isMobile ? 'pb-3' : 'pb-6'}`}>
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between md:gap-4">
            <TabsList className="mb-2 md:mb-0">
              <TabsTrigger value="list">Lista de Vendas</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>
            
            <div className="w-full md:w-auto">
              <SalesSearchFilters 
                searchQuery={searchQuery}
                selectedDateRange={selectedDateRange}
                selectedPayment={selectedPayment}
                handleSearch={handleSearch}
                setSelectedDateRange={setSelectedDateRange}
                setSelectedPayment={setSelectedPayment}
                timeRange={selectedDateRange}
                setTimeRange={setSelectedDateRange}
                paymentMethod={selectedPayment}
                setPaymentMethod={setSelectedPayment}
                minAmount=""
                setMinAmount={() => {}}
                maxAmount=""
                setMaxAmount={() => {}}
              />
            </div>
          </div>
        </div>
        
        <TabsContent value="list" className="mt-0">
          <div className="overflow-x-auto">
            <SalesTable 
              sales={filteredSales} 
              isLoading={loading} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="p-4 sm:p-6">
          <SalesReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesTabs;
