
import { useState } from 'react';
import { Sale, DateRange } from './types';
import { useFilterSales } from './useFilterSales';

export function useSalesFiltering(sales: Sale[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({});
  
  const filteredSales = useFilterSales(sales, searchQuery, dateRange);

  return {
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    filteredSales
  };
}
