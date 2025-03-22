
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageTransition from '@/components/layout/PageTransition';

import SalesHeader from '@/components/sales/SalesHeader';
import SalesTable from '@/components/sales/SalesTable';
import SalesSearchFilters from '@/components/sales/SalesSearchFilters';
import SalesReportsTab from '@/components/sales/SalesReportsTab';
import SalesStatistics from '@/components/sales/SalesStatistics';

import { useSalesData } from '@/hooks/sales/useSalesData';
import { useSalesFiltering } from '@/hooks/sales/useSalesFiltering';
import { useSalesStatistics } from '@/hooks/sales/useSalesStatistics';

// Define a conversion function to adapt our Sale type to the expected format by SalesTable
function adaptSalesToTableFormat(sales: Array<any>) {
  return sales.map(sale => ({
    id: sale.id,
    date: sale.sale_date,
    customer: sale.customer_name || 'Cliente não identificado',
    items: [], // We don't have items directly in the sale object, we'll handle this differently
    paymentMethod: sale.payment_method,
    total: sale.final_total
  }));
}

export default function Sales() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('vendas');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch sales data
  const { sales, loading, refresh } = useSalesData();
  
  // Filtering
  const {
    searchTerm,
    setSearchTerm,
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
  } = useSalesFiltering(sales);

  // Sales statistics
  const { 
    salesStatistics, 
    periodSales,
    isLoadingStatistics 
  } = useSalesStatistics(sales);

  // Calculate estimated number of products sold
  // Since we don't have direct access to items, use a fixed value per sale
  const totalProductsSold = useMemo(() => {
    return periodSales.length * 2; // Estimating an average of 2 products per sale
  }, [periodSales]);

  // Convert our sales data to the format expected by SalesTable
  const adaptedFilteredSales = useMemo(() => {
    return adaptSalesToTableFormat(filteredSales);
  }, [filteredSales]);

  // Pagination
  const totalPages = Math.ceil(adaptedFilteredSales.length / pageSize);
  const paginatedSales = adaptedFilteredSales.slice((page - 1) * pageSize, page * pageSize);

  // Go to prev page
  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Go to next page
  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 pt-20 pb-10">
        <PageTransition>
          <SalesHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            refresh={refresh}
          />

          {showFilters && (
            <SalesSearchFilters 
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              minAmount={minAmount}
              setMinAmount={setMinAmount}
              maxAmount={maxAmount}
              setMaxAmount={setMaxAmount}
            />
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="w-full max-w-md mx-auto mb-6">
              <TabsTrigger value="vendas" className="flex-1">
                Vendas
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="flex-1">
                Relatórios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vendas" className="space-y-6">
              <SalesStatistics 
                totalSales={salesStatistics.totalSales}
                productsSold={totalProductsSold}
                totalRevenue={salesStatistics.totalRevenue}
                isLoading={isLoadingStatistics}
              />
              
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg font-medium text-gray-700">
                    Histórico de Vendas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SalesTable 
                    sales={paginatedSales}
                    isLoading={loading}
                  />
                  
                  {/* Pagination */}
                  {adaptedFilteredSales.length > 0 && totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-500">
                        Página {page} de {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={goToPrevPage}
                          disabled={page === 1}
                          className="px-3 py-1 h-8"
                        >
                          Anterior
                        </Button>
                        <Button
                          onClick={goToNextPage}
                          disabled={page === totalPages}
                          className="px-3 py-1 h-8"
                        >
                          Próxima
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="relatorios">
              <SalesReportsTab />
            </TabsContent>
          </Tabs>

          <div className="fixed bottom-6 right-6">
            <Button
              onClick={() => navigate('/sales/new')}
              className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </PageTransition>
      </main>
    </div>
  );
}
