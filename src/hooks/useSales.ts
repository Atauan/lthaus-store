
import { useSalesData } from './sales/useSalesData';
import { useSaleDetails } from './sales/useSaleDetails';
import { useSaleCreate } from './sales/useSaleCreate';
import { useSalesStatistics } from './sales/useSalesStatistics';
import { useSalesFiltering } from './sales/useSalesFiltering';
import { useSalesSort } from './sales/useSalesSort';

export type { Sale, SaleItem, SalePayment, DateRange, SaleDetails, SalesStatistics } from './sales/types';

export function useSales() {
  const { sales, setSales, loading, isAuthenticated } = useSalesData();
  const { getSaleDetails } = useSaleDetails();
  const { createSale } = useSaleCreate();
  const { getSalesStatistics } = useSalesStatistics();
  const { searchQuery, setSearchQuery, dateRange, setDateRange, filteredSales } = useSalesFiltering(sales);
  const { sortedSales, sortBy, setSortBy, sortDirection, setSortDirection } = useSalesSort(filteredSales);

  return {
    sales,
    filteredSales,
    sortedSales,
    loading,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    sortBy,
    setSortBy,
    sortDirection, 
    setSortDirection,
    getSaleDetails,
    getSalesStatistics,
    createSale,
    isAuthenticated
  };
}
