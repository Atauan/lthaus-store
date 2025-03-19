
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchSales, 
  getSaleDetails, 
  getSalesStatistics, 
  createSale 
} from './sales/salesUtils';
import { useFilterSales } from './sales/useFilterSales';
import { Sale, DateRange, SaleItem, SalePayment, SaleDetails } from './sales/types';

export type { Sale, SaleItem, SalePayment, DateRange, SaleDetails } from './sales/types';

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({});

  // Fetch sales from database
  useEffect(() => {
    const loadSales = async () => {
      setLoading(true);
      try {
        const { data, error } = await fetchSales();
        if (error) throw error;
        if (data) {
          setSales(data);
        }
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSales(); // Carrega as vendas sem verificar autenticação
  }, []);

  // Use the filtering hook
  const filteredSales = useFilterSales(sales, searchQuery, dateRange);

  // Memoize commonly used functions to prevent unnecessary re-renders
  const getSaleDetailsCallback = useCallback(getSaleDetails, []);
  const getSalesStatisticsCallback = useCallback(getSalesStatistics, []);
  const createSaleCallback = useCallback(createSale, []);

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
    isAuthenticated: true // Sempre retorna como autenticado até que o sistema de login esteja pronto
  };
}
