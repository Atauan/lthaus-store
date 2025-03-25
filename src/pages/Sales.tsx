
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageTransition from '@/components/layout/PageTransition';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import SalesHeader from '@/components/sales/SalesHeader';
import SalesTable from '@/components/sales/SalesTable';
import SalesSearchFilters from '@/components/sales/SalesSearchFilters';
import SalesReportsTab from '@/components/sales/SalesReportsTab';
import SalesStatistics from '@/components/sales/SalesStatistics';

import { useSales } from '@/hooks/useSales';

// Define a conversion function to adapt our Sale type to the expected format by SalesTable
function adaptSalesToTableFormat(sales: Array<any>) {
  return sales.map(sale => ({
    id: sale.id,
    date: sale.sale_date,
    customer: sale.customer_name || 'Cliente não identificado',
    items: [], // We don't have items directly in the sale object
    paymentMethod: sale.payment_method,
    total: sale.final_total,
    status: sale.status
  }));
}

export default function Sales() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('vendas');
  const [page, setPage] = useState(1);
  const [viewingSale, setViewingSale] = useState<number | null>(null);
  const [saleDetails, setSaleDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const pageSize = 10;

  // Fetch sales data
  const { 
    sales, 
    loading, 
    refresh, 
    revokeSale, 
    isRevoking,
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
    setShowFilters,
    salesStatistics,
    getSalesStatistics,
    isLoadingStatistics,
    getSaleDetails
  } = useSales();

  // Load initial data
  useEffect(() => {
    refresh();
  }, []);

  // Calculate estimated number of products sold
  // Since we don't have direct access to items, use a fixed value per sale
  const totalProductsSold = useMemo(() => {
    return salesStatistics.sales.length * 2; // Estimating an average of 2 products per sale
  }, [salesStatistics.sales]);

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
  
  // Handle view sale details
  const handleViewSale = async (saleId: number) => {
    try {
      setLoadingDetails(true);
      setViewingSale(saleId);
      
      const { success, data, error } = await getSaleDetails(saleId);
      
      if (success && data) {
        setSaleDetails(data);
      } else {
        toast.error(`Erro ao carregar detalhes: ${error?.message || 'Erro desconhecido'}`);
        setViewingSale(null);
      }
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
      setViewingSale(null);
    } finally {
      setLoadingDetails(false);
    }
  };
  
  // Handle revoke sale
  const handleRevokeSale = async (saleId: number) => {
    const { success, error } = await revokeSale(saleId);
    
    if (success) {
      toast.success("Venda cancelada com sucesso!");
      refresh(); // Reload the sales data
    } else {
      toast.error(`Erro ao cancelar venda: ${error?.message || 'Erro desconhecido'}`);
    }
  };

  return (
    <div className="w-full">
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
                  isLoading={loading || isRevoking}
                  onViewSale={handleViewSale}
                  onRevokeSale={handleRevokeSale}
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

        {/* Sale Details Dialog */}
        <Dialog open={viewingSale !== null} onOpenChange={(open) => !open && setViewingSale(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Venda #{viewingSale}</DialogTitle>
            </DialogHeader>
            
            {loadingDetails ? (
              <div className="py-8 text-center">
                <p>Carregando detalhes...</p>
              </div>
            ) : saleDetails ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Informações da Venda</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Data:</span> {new Date(saleDetails.sale.sale_date).toLocaleString('pt-BR')}</p>
                      <p><span className="font-medium">Cliente:</span> {saleDetails.sale.customer_name || 'Cliente não identificado'}</p>
                      <p><span className="font-medium">Contato:</span> {saleDetails.sale.customer_contact || 'N/A'}</p>
                      <p><span className="font-medium">Canal de venda:</span> {saleDetails.sale.sale_channel || 'Loja'}</p>
                      <p><span className="font-medium">Método de pagamento:</span> {saleDetails.sale.payment_method}</p>
                      <p><span className="font-medium">Status:</span> {saleDetails.sale.status || 'Concluída'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Resumo Financeiro</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Subtotal:</span> R$ {saleDetails.sale.subtotal.toFixed(2)}</p>
                      <p><span className="font-medium">Desconto:</span> R$ {saleDetails.sale.discount?.toFixed(2) || '0.00'}</p>
                      {saleDetails.sale.delivery_fee > 0 && (
                        <p><span className="font-medium">Taxa de entrega:</span> R$ {saleDetails.sale.delivery_fee.toFixed(2)}</p>
                      )}
                      <p className="font-medium">Total: R$ {saleDetails.sale.final_total.toFixed(2)}</p>
                      <p className="text-green-600"><span className="font-medium">Lucro:</span> R$ {saleDetails.sale.profit?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Itens da Venda</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qtde</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {saleDetails.items.length > 0 ? (
                          saleDetails.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">{item.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">{item.quantity}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">R$ {item.price.toFixed(2)}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">R$ {(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-4 py-3 text-center text-sm text-gray-500">
                              Nenhum item encontrado
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {saleDetails.payments && saleDetails.payments.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Pagamentos</h3>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {saleDetails.payments.map((payment, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">{payment.method}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">R$ {payment.amount.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {saleDetails.sale.notes && (
                  <div>
                    <h3 className="font-medium mb-2">Observações</h3>
                    <p className="text-sm p-3 bg-gray-50 rounded-md">{saleDetails.sale.notes}</p>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  {(!saleDetails.sale.status || saleDetails.sale.status !== 'revoked') && (
                    <>
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/sales/edit/${viewingSale}`)}
                      >
                        Editar Venda
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          setViewingSale(null);
                          handleRevokeSale(saleDetails.sale.id);
                        }}
                      >
                        Cancelar Venda
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p>Não foi possível carregar os detalhes da venda.</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => navigate('/sales/new')}
            className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </PageTransition>
    </div>
  );
}
