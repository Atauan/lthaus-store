
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SalesSearchFilters from './SalesSearchFilters';
import SalesTable from './SalesTable';
import SalesReportsTab from './SalesReportsTab';

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
  formatDate: (dateString: string) => string;
}

const SalesTabs: React.FC<SalesTabsProps> = ({
  searchQuery,
  selectedDateRange,
  selectedPayment,
  handleSearch,
  setSelectedDateRange,
  setSelectedPayment,
  filteredSales,
  formatDate
}) => {
  return (
    <div className="bg-white rounded-lg shadow-soft overflow-hidden animate-scale-in mb-8">
      <Tabs defaultValue="list" className="w-full">
        <div className="px-6 pt-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="list">Lista de Vendas</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>
            
            <SalesSearchFilters 
              searchQuery={searchQuery}
              selectedDateRange={selectedDateRange}
              selectedPayment={selectedPayment}
              handleSearch={handleSearch}
              setSelectedDateRange={setSelectedDateRange}
              setSelectedPayment={setSelectedPayment}
            />
          </div>
        </div>
        
        <TabsContent value="list" className="mt-0">
          <SalesTable sales={filteredSales} formatDate={formatDate} />
        </TabsContent>
        
        <TabsContent value="reports" className="p-6">
          <SalesReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesTabs;
