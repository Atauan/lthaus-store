
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageTransition from '@/components/layout/PageTransition';
import { useSales } from '@/hooks/useSales';
import { Button } from '@/components/ui/button';
import { Calendar, CreditCard, Download, DollarSign, Search, ShoppingCart, Users, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';

const Sales = () => {
  const navigate = useNavigate();
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [saleDetailsForReceipt, setSaleDetailsForReceipt] = useState<any>(null);

  const {
    sales,
    loading,
  } = useSales();

  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // We'll use this to determine if there are more sales to load
  useEffect(() => {
    if (sales && sales.length) {
      setHasMore(sales.length > currentPage * itemsPerPage);
    }
  }, [sales, currentPage]);

  const loadMore = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleNewSale = () => {
    navigate('/sales/new');
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-16">
          <div className="container mx-auto px-4 pb-10 flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Carregando vendas...</span>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 pb-10">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
              <p className="text-muted-foreground mt-1">Gerencie suas vendas e acompanhe o desempenho</p>
            </div>
            <Button onClick={handleNewSale} className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Nova Venda
            </Button>
          </div>
          
          <Tabs defaultValue="sales">
            <TabsList className="mb-4">
              <TabsTrigger value="sales">Vendas</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales">
              {sales && sales.length > 0 ? (
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="text-left">
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground">Número</th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground">Data</th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground">Cliente</th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground">Pagamento</th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground">Total</th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.slice(0, currentPage * itemsPerPage).map((sale) => (
                        <tr key={sale.id} className="border-t">
                          <td className="py-3 px-4">{sale.sale_number}</td>
                          <td className="py-3 px-4">{new Date(sale.sale_date).toLocaleDateString()}</td>
                          <td className="py-3 px-4">{sale.customer_name || 'Cliente não informado'}</td>
                          <td className="py-3 px-4">{sale.payment_method}</td>
                          <td className="py-3 px-4">R$ {sale.final_total.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              sale.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              sale.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {sale.status === 'completed' ? 'Concluída' : 
                               sale.status === 'cancelled' ? 'Cancelada' : 
                               'Pendente'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/sales/edit/${sale.id}`)}>
                                Editar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {hasMore && (
                    <div className="flex justify-center p-4 border-t">
                      <Button variant="outline" onClick={loadMore}>
                        Carregar mais
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center h-64">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center mb-4">
                      Nenhuma venda encontrada.
                    </p>
                    <Button onClick={handleNewSale}>
                      Registrar primeira venda
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios de Vendas</CardTitle>
                  <CardDescription>Analise o desempenho da sua loja</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Funcionalidade de relatórios em breve...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
};

export default Sales;
