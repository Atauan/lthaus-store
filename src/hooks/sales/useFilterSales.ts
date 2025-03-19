
import { useMemo } from 'react';
import { Sale, DateRange } from './types';

export function useFilterSales(
  sales: Sale[],
  searchQuery: string,
  dateRange: DateRange
) {
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      // Filter by search query
      const matchesSearch = 
        (sale.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (sale.customer_contact?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        sale.sale_number.toString().includes(searchQuery);
      
      // Filter by date range
      let matchesDateRange = true;
      if (dateRange.from || dateRange.to) {
        const saleDate = sale.sale_date ? new Date(sale.sale_date) : null;
        if (saleDate) {
          if (dateRange.from && saleDate < dateRange.from) {
            matchesDateRange = false;
          }
          if (dateRange.to) {
            // Set time to end of day for the to date
            const endDate = new Date(dateRange.to);
            endDate.setHours(23, 59, 59, 999);
            if (saleDate > endDate) {
              matchesDateRange = false;
            }
          }
        }
      }
      
      return matchesSearch && matchesDateRange;
    });
  }, [sales, searchQuery, dateRange]);

  return filteredSales;
}
