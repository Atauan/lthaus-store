
import React, { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import SalesHeader from '@/components/sales/SalesHeader';
import SalesStatistics from '@/components/sales/SalesStatistics';
import SalesTabs from '@/components/sales/SalesTabs';
import { salesData } from '@/components/sales/data/salesData';
import { formatDate, getDateRangeFilter } from '@/components/sales/utils/salesFilterUtils';

const Sales = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('7dias');
  const [selectedPayment, setSelectedPayment] = useState('todos');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredSales = salesData.filter(sale => {
    const matchesSearch = sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sale.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const saleDate = new Date(sale.date);
    const filterDate = getDateRangeFilter(selectedDateRange);
    const matchesDate = saleDate >= filterDate;
    
    const matchesPayment = selectedPayment === 'todos' || sale.paymentMethod === selectedPayment;
    
    return matchesSearch && matchesDate && matchesPayment;
  });
  
  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const productsSold = filteredSales.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  
  return (
    <PageTransition>
      <div className="min-h-screen lg:pl-64 pt-16">
        <div className="container mx-auto px-4 pb-10">
          <SalesHeader 
            title="Vendas" 
            description="Gerencie e analise suas vendas"
          />
          
          <SalesStatistics 
            totalSales={totalSales}
            productsSold={productsSold}
            totalRevenue={totalRevenue}
          />
          
          <SalesTabs 
            searchQuery={searchQuery}
            selectedDateRange={selectedDateRange}
            selectedPayment={selectedPayment}
            handleSearch={handleSearch}
            setSelectedDateRange={setSelectedDateRange}
            setSelectedPayment={setSelectedPayment}
            filteredSales={filteredSales}
            formatDate={formatDate}
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default Sales;
