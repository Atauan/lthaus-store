
import { useSalesData } from './sales/useSalesData';
import { useSaleDetails } from './sales/useSaleDetails';
import { useSaleCreate } from './sales/useSaleCreate';
import { useSalesStatistics } from './sales/useSalesStatistics';
import { useSalesFiltering } from './sales/useSalesFiltering';
import { useSalesSort } from './sales/useSalesSort';
import { useState } from 'react';

export type { Sale, SaleItem, SalePayment, DateRange, SaleDetails, SalesStatistics } from './sales/types';

export function useSales() {
  const { sales, setSales, loading, isAuthenticated, refresh } = useSalesData();
  const { getSaleDetails } = useSaleDetails();
  const { createSale } = useSaleCreate();
  const { salesStatistics, getSalesStatistics } = useSalesStatistics(sales);
  const { 
    searchTerm, 
    setSearchTerm, 
    dateRange, 
    setDateRange, 
    timeRange,
    setTimeRange,
    paymentMethod,
    setPaymentMethod,
    minAmount,
    setMaxAmount,
    setMinAmount,
    maxAmount,
    filteredSales 
  } = useSalesFiltering(sales);
  const { sortedSales, sortBy, setSortBy, sortDirection, setSortDirection } = useSalesSort(filteredSales);

  return {
    sales,
    filteredSales,
    sortedSales,
    loading,
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
    sortBy,
    setSortBy,
    sortDirection, 
    setSortDirection,
    getSaleDetails,
    getSalesStatistics,
    createSale,
    isAuthenticated,
    refresh
  };
}
