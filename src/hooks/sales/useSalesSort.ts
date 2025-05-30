
import { useState, useMemo } from 'react';
import { Sale } from './types';

type SortField = 'date' | 'customer_name' | 'final_total' | 'sale_number';
type SortDirection = 'asc' | 'desc';

export function useSalesSort(sales: Sale[]) {
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const sortedSales = useMemo(() => {
    if (!sales || sales.length === 0) return [];
    
    return [...sales].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.sale_date || '').getTime() - new Date(b.sale_date || '').getTime();
          break;
        case 'customer_name':
          comparison = (a.customer_name || '').localeCompare(b.customer_name || '');
          break;
        case 'final_total':
          comparison = a.final_total - b.final_total;
          break;
        case 'sale_number':
          comparison = a.sale_number - b.sale_number;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [sales, sortBy, sortDirection]);

  return {
    sortedSales,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection
  };
}
