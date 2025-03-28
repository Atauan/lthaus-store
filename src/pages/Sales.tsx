
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageTransition from '@/components/layout/PageTransition';
import { useSales } from '@/hooks/useSales';
import SalesHeader from '@/components/sales/SalesHeader';
import SalesSearchFilters from '@/components/sales/SalesSearchFilters';
import SalesTabs from '@/components/sales/SalesTabs';
import SaleReceiptModal from '@/components/sales/SaleReceiptModal';
import { Button } from '@/components/ui/button';
import { Calendar, CreditCard, Download, DollarSign, Search, ShoppingCart, Users, X } from 'lucide-react';

const Sales = () => {
  const navigate = useNavigate();
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [saleDetailsForReceipt, setSaleDetailsForReceipt] = useState<any>(null);

  const {
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
    revokeSale,
    isRevoking,
    showFilters,
    setShowFilters
  } = useSales();

  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // We'll use this to determine if there are more sales to load
  useEffect(() => {
    setHasMore(sortedSales.length > currentPage * itemsPerPage);
  }, [sortedSales, currentPage]);

  const loadMore = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleNewSale = () => {
    navigate('/sales/new');
  };

  const handleViewSale = async (saleId: number) => {
    try {
      const saleDetails = await getSaleDetails(saleId);
      
      if (saleDetails) {
        setSaleDetailsForReceipt(saleDetails);
        setSelectedSaleId(saleId);
        setReceiptModalOpen(true);
      } else {
        toast.error('Não foi possível carregar os detalhes da venda');
      }
    } catch (error: any) {
      toast.error(`Erro ao carregar detalhes da venda: ${error.message}`);
    }
  };

  const handleEditSale = (saleId: number) => {
    navigate(`/sales/edit/${saleId}`);
  };

  const handleRevokeSale = async (saleId: number) => {
    if (window.confirm('Tem certeza que deseja cancelar esta venda? Esta ação não pode ser desfeita.')) {
      await revokeSale(saleId);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDateRange({ from: undefined, to: undefined });
    setTimeRange('all');
    setPaymentMethod('all');
    setMinAmount('');
    setMaxAmount('');
  };

  const filterComponents = [
    {
      icon: <Search className="h-4 w-4" />,
      name: 'Busca',
      active: !!searchTerm
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      name: 'Data',
      active: !!(dateRange.from || dateRange.to || timeRange !== 'all')
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      name: 'Pagamento',
      active: paymentMethod !== 'all'
    },
    {
      icon: <DollarSign className="h-4 w-4" />,
      name: 'Valor',
      active: !!(minAmount || maxAmount)
    },
    {
      icon: <Users className="h-4 w-4" />,
      name: 'Cliente',
      active: false
    }
  ];

  const activeFiltersCount = filterComponents.filter(f => f.active).length;

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 pb-10">
          <SalesHeader onNewSale={handleNewSale} />
          
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Button 
                variant={showFilters ? "default" : "outline"} 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1"
              >
                <Search className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary-foreground text-primary w-5 h-5 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
              
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Limpar filtros
                </Button>
              )}
              
              <div className="ml-auto flex gap-1">
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
            
            {showFilters && (
              <SalesSearchFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                dateRange={dateRange}
                setDateRange={setDateRange}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                minAmount={minAmount}
                setMinAmount={setMinAmount}
                maxAmount={maxAmount}
                setMaxAmount={setMaxAmount}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
              />
            )}
          </div>
          
          <SalesTabs 
            sales={sortedSales} 
            isLoading={loading}
            onViewSale={handleViewSale}
            onRevokeSale={handleRevokeSale}
            hasMore={hasMore}
            loadMore={loadMore}
          />
        </div>
      </div>
      
      <SaleReceiptModal
        open={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        saleDetails={saleDetailsForReceipt}
        onEditSale={selectedSaleId ? () => handleEditSale(selectedSaleId) : undefined}
      />
    </PageTransition>
  );
};

export default Sales;
