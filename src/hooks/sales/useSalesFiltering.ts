import { useState } from 'react';
import { Sale, DateRange } from './types';
import { useFilterSales } from './useFilterSales';

export function useSalesFiltering(sales: Sale[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({});
  
  // Use the existing filter logic but with our additional filters
  const filteredSales = useFilterSales(sales, searchTerm, dateRange).filter(sale => {
    // Payment method filter
    if (paymentMethod !== 'all' && sale.payment_method !== paymentMethod) {
      return false;
    }
    
    // Amount range filter
    const amount = sale.final_total;
    if (minAmount && Number(minAmount) > amount) {
      return false;
    }
    if (maxAmount && Number(maxAmount) < amount) {
      return false;
    }
    
    return true;
  });

  return {
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    timeRange,
    setTimeRange,
    paymentMethod,
    setPaymentMethod,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    filteredSales,
    showFilters,
    setShowFilters
  };
}
