
import { useState, useCallback } from 'react';
import { 
  getSaleDetails, 
  getSalesStatistics, 
  createSale 
} from './sales/salesUtils';
import { useFilterSales } from './sales/useFilterSales';
import { Sale, DateRange, SaleItem, SalePayment, SaleDetails } from './sales/types';

// Sample sales data for testing
const sampleSalesData: Sale[] = [
  {
    id: 1,
    sale_number: 10001,
    customer_name: 'João Silva',
    customer_contact: '(11) 99999-8888',
    sale_channel: 'store',
    payment_method: 'pix',
    sale_date: new Date().toISOString(),
    subtotal: 159.80,
    discount: 10,
    final_total: 149.80,
    profit: 75.00
  },
  {
    id: 2,
    sale_number: 10002,
    customer_name: 'Maria Oliveira',
    customer_contact: '(11) 97777-6666',
    sale_channel: 'whatsapp',
    payment_method: 'credit_card',
    sale_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    subtotal: 299.90,
    discount: 0,
    final_total: 299.90,
    profit: 120.00
  },
  {
    id: 3,
    sale_number: 10003,
    customer_name: 'Carlos Santos',
    customer_contact: '(11) 95555-4444',
    sale_channel: 'instagram',
    payment_method: 'cash',
    sale_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    subtotal: 89.90,
    discount: 5,
    final_total: 84.90,
    profit: 35.00
  }
];

export type { Sale, SaleItem, SalePayment, DateRange, SaleDetails } from './sales/types';

export function useSales() {
  const [sales, setSales] = useState<Sale[]>(sampleSalesData);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({});

  // Use the filtering hook
  const filteredSales = useFilterSales(sales, searchQuery, dateRange);

  // Mock function to add a new sale
  const mockCreateSale = async (
    sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>,
    items: Omit<SaleItem, 'id' | 'created_at' | 'updated_at' | 'sale_id'>[],
    payments: Omit<SalePayment, 'id' | 'created_at' | 'updated_at' | 'sale_id'>[]
  ) => {
    // Create new sale with generated ID
    const newSale: Sale = {
      ...sale,
      id: sales.length + 1
    };
    
    // Add the new sale to the local state
    setSales([newSale, ...sales]);
    
    return {
      success: true,
      data: {
        sale: newSale,
        items: items.map((item, index) => ({
          ...item,
          id: index + 1,
          sale_id: newSale.id
        })),
        payments: payments.map((payment, index) => ({
          ...payment,
          id: index + 1,
          sale_id: newSale.id
        }))
      }
    };
  };

  // Memoize commonly used functions to prevent unnecessary re-renders
  const getSaleDetailsCallback = useCallback(getSaleDetails, []);
  const getSalesStatisticsCallback = useCallback(() => {
    // Mock statistics data
    return Promise.resolve({
      success: true,
      data: {
        totalSales: sales.length,
        totalRevenue: sales.reduce((sum, sale) => sum + sale.final_total, 0),
        totalProfit: sales.reduce((sum, sale) => sum + (sale.profit || 0), 0),
        period: 'month',
        sales: sales
      }
    });
  }, [sales]);
  
  const createSaleCallback = useCallback(mockCreateSale, [sales]);

  return {
    sales,
    filteredSales,
    loading,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    getSaleDetails: getSaleDetailsCallback,
    getSalesStatistics: getSalesStatisticsCallback,
    createSale: createSaleCallback,
    isAuthenticated: true // Always return as authenticated
  };
}
