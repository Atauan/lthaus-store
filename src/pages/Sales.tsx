
import React, { useState, useEffect } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import SalesHeader from '@/components/sales/SalesHeader';
import SalesStatistics from '@/components/sales/SalesStatistics';
import SalesTabs from '@/components/sales/SalesTabs';
import { useSales } from '@/hooks/useSales';
import { formatDate } from '@/components/sales/utils/salesFilterUtils';

// Add this type to bridge the gap between our backend and UI types
type SaleForUI = {
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

const Sales = () => {
  const { 
    loading,
    filteredSales: backendSales,
    searchQuery, 
    setSearchQuery,
    dateRange,
    setDateRange,
    getSalesStatistics
  } = useSales();
  
  const [selectedPayment, setSelectedPayment] = useState('todos');
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [productsSold, setProductsSold] = useState(0);
  const [uiSales, setUiSales] = useState<SaleForUI[]>([]);
  
  // Convert backend sales to UI format
  useEffect(() => {
    const mappedSales = backendSales.map(sale => ({
      id: sale.id,
      date: sale.sale_date || '',
      customer: sale.customer_name || 'Cliente não identificado',
      // Since we don't have actual items in the current data, we're creating a placeholder
      items: [{ 
        name: 'Item da venda', 
        quantity: 1, 
        price: sale.final_total 
      }],
      paymentMethod: sale.payment_method,
      total: sale.final_total
    }));
    
    setUiSales(mappedSales);
  }, [backendSales]);
  
  useEffect(() => {
    const loadStatistics = async () => {
      const { success, data } = await getSalesStatistics('month');
      if (success && data) {
        setTotalSales(data.totalSales);
        setTotalRevenue(data.totalRevenue);
        
        // Calculate products sold (estimate if not available)
        if (data.sales) {
          // This would ideally come from backend sum of all sale items quantities
          // For now we'll use average 2 items per sale as an estimation
          setProductsSold(data.sales.length * 2);
        }
      }
    };
    
    loadStatistics();
  }, [getSalesStatistics]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleDateRangeChange = (value: string) => {
    // Convert string values to actual date range
    const now = new Date();
    let from: Date | undefined;
    
    if (value === '7dias') {
      from = new Date();
      from.setDate(from.getDate() - 7);
    } else if (value === '30dias') {
      from = new Date();
      from.setDate(from.getDate() - 30);
    } else if (value === '90dias') {
      from = new Date();
      from.setDate(from.getDate() - 90);
    } else if (value === 'ano') {
      from = new Date();
      from.setFullYear(from.getFullYear() - 1);
    }
    
    setDateRange({ from, to: now });
  };
  
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
            selectedDateRange={'30dias'} // This is just the UI representation
            selectedPayment={selectedPayment}
            handleSearch={handleSearch}
            setSelectedDateRange={handleDateRangeChange}
            setSelectedPayment={setSelectedPayment}
            filteredSales={uiSales}
            loading={loading}
            formatDate={formatDate}
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default Sales;
