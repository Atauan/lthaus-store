
import { useSalesData } from './sales/useSalesData';
import { useSaleDetails } from './sales/useSaleDetails';
import { useSaleCreate } from './sales/useSaleCreate';
import { useSalesStatistics } from './sales/useSalesStatistics';
import { useSalesFiltering } from './sales/useSalesFiltering';

export type { Sale, SaleItem, SalePayment, DateRange, SaleDetails } from './sales/types';

export function useSales() {
  const { sales, setSales, loading, isAuthenticated } = useSalesData();
  const { getSaleDetails } = useSaleDetails();
  const { createSale } = useSaleCreate();
  const { getSalesStatistics } = useSalesStatistics();
  const { searchQuery, setSearchQuery, dateRange, setDateRange, filteredSales } = useSalesFiltering(sales);

  return {
    sales,
    filteredSales,
    loading,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    getSaleDetails,
    getSalesStatistics,
    createSale,
    isAuthenticated
  };
}
